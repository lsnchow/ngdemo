import path from "node:path"

import { BackboardClient } from "backboard-sdk"
import type { ChatMessagesResponse } from "backboard-sdk/dist/models.js"

import {
  loadSessionCache,
  updateOpportunityAssistant,
  updateOpportunityThread,
} from "@/lib/backboard/session-cache"
import { buildOpportunityWorkspaceContext } from "@/lib/workspace/workspace-context"

const BACKBOARD_CACHE_PATH = path.join(process.cwd(), ".backboard-demo-cache.json")
const MODEL_PROVIDER = "google"
const MODEL_NAME = "gemini-2.5-flash"

const globalBackboard = globalThis as {
  backboardClient?: BackboardClient
}

function getBackboardApiKey() {
  const apiKey = process.env.BACKBOARD_API_KEY

  if (!apiKey) {
    throw new Error("Missing BACKBOARD_API_KEY")
  }

  return apiKey
}

export function getBackboardClient() {
  if (!globalBackboard.backboardClient) {
    globalBackboard.backboardClient = new BackboardClient({
      apiKey: getBackboardApiKey(),
    })
  }

  return globalBackboard.backboardClient
}

export function extractCopilotReply(response: ChatMessagesResponse): string {
  const latestAssistantMessage = [...response.messages]
    .reverse()
    .find((message) => message.role === "assistant" && message.content?.trim())

  if (!latestAssistantMessage?.content) {
    throw new Error("Backboard returned no assistant response")
  }

  return latestAssistantMessage.content
}

function buildOpportunityAssistantPrompt(opportunityId: string) {
  return [
    "You are an internal capture copilot for a single public-sector opportunity workspace.",
    "Stay grounded in the provided workspace context and do not invent facts that are not present.",
    "Your jobs are to summarize the opportunity, explain stakeholder roles plainly, recommend concrete next steps, and help draft short outreach copy when asked.",
    "If the workspace is missing information, say what is missing and suggest the best next research or outreach step.",
    "Never claim to have sent an email or changed CRM data.",
    "",
    "Workspace context:",
    buildOpportunityWorkspaceContext(opportunityId),
  ].join("\n")
}

async function ensureOpportunityAssistant(opportunityId: string) {
  const client = getBackboardClient()
  const cache = await loadSessionCache(BACKBOARD_CACHE_PATH)
  const cachedAssistantId = cache.assistantsByOpportunity?.[opportunityId]

  if (cachedAssistantId) {
    return {
      client,
      assistantId: cachedAssistantId,
    }
  }

  const assistant = await client.createAssistant({
    name: `NationGraph Copilot ${opportunityId}`,
    system_prompt: buildOpportunityAssistantPrompt(opportunityId),
  })

  await updateOpportunityAssistant(
    BACKBOARD_CACHE_PATH,
    opportunityId,
    assistant.assistantId
  )

  return {
    client,
    assistantId: assistant.assistantId,
  }
}

async function ensureOpportunityThread(opportunityId: string) {
  const { client, assistantId } = await ensureOpportunityAssistant(opportunityId)
  const cache = await loadSessionCache(BACKBOARD_CACHE_PATH)
  const cachedThreadId = cache.threadsByOpportunity[opportunityId]

  if (cachedThreadId) {
    return {
      client,
      assistantId,
      threadId: cachedThreadId,
    }
  }

  const thread = await client.createThread(assistantId)

  await updateOpportunityThread(
    BACKBOARD_CACHE_PATH,
    opportunityId,
    thread.threadId
  )

  return {
    client,
    assistantId,
    threadId: thread.threadId,
  }
}

export async function sendOpportunityCopilotMessage(
  opportunityId: string,
  message: string
) {
  const { client, threadId } = await ensureOpportunityThread(opportunityId)
  const response = await client.addMessage(threadId, {
    content: message,
    llmProvider: MODEL_PROVIDER,
    modelName: MODEL_NAME,
    memory: "Auto",
    stream: false,
  })

  if (Symbol.asyncIterator in Object(response)) {
    throw new Error("Expected non-streaming Backboard response")
  }

  return {
    content: extractCopilotReply(response),
    threadId,
    model: `${MODEL_PROVIDER}/${MODEL_NAME}`,
  }
}
