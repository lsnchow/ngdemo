import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

export interface SessionCache {
  assistantId?: string
  assistantsByOpportunity?: Record<string, string>
  threadsByOpportunity: Record<string, string>
}

function createEmptySessionCache(): SessionCache {
  return {
    threadsByOpportunity: {},
  }
}

export async function loadSessionCache(cachePath: string): Promise<SessionCache> {
  try {
    const raw = await readFile(cachePath, "utf8")
    const parsed = JSON.parse(raw) as SessionCache

    return {
      assistantId: parsed.assistantId,
      assistantsByOpportunity: parsed.assistantsByOpportunity ?? {},
      threadsByOpportunity: parsed.threadsByOpportunity ?? {},
    }
  } catch {
    return createEmptySessionCache()
  }
}

export async function saveSessionCache(
  cachePath: string,
  cache: SessionCache
): Promise<void> {
  await mkdir(path.dirname(cachePath), { recursive: true })
  await writeFile(cachePath, JSON.stringify(cache, null, 2), "utf8")
}

export async function updateOpportunityThread(
  cachePath: string,
  opportunityId: string,
  threadId: string
): Promise<SessionCache> {
  const cache = await loadSessionCache(cachePath)
  const updated: SessionCache = {
    assistantId: cache.assistantId,
    assistantsByOpportunity: cache.assistantsByOpportunity,
    threadsByOpportunity: {
      ...cache.threadsByOpportunity,
      [opportunityId]: threadId,
    },
  }

  await saveSessionCache(cachePath, updated)

  return updated
}

export async function updateAssistantId(
  cachePath: string,
  assistantId: string
): Promise<SessionCache> {
  const cache = await loadSessionCache(cachePath)
  const updated: SessionCache = {
    assistantId,
    assistantsByOpportunity: cache.assistantsByOpportunity,
    threadsByOpportunity: cache.threadsByOpportunity,
  }

  await saveSessionCache(cachePath, updated)

  return updated
}

export async function updateOpportunityAssistant(
  cachePath: string,
  opportunityId: string,
  assistantId: string
): Promise<SessionCache> {
  const cache = await loadSessionCache(cachePath)
  const updated: SessionCache = {
    assistantId: cache.assistantId,
    assistantsByOpportunity: {
      ...(cache.assistantsByOpportunity ?? {}),
      [opportunityId]: assistantId,
    },
    threadsByOpportunity: cache.threadsByOpportunity,
  }

  await saveSessionCache(cachePath, updated)

  return updated
}
