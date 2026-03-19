"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Bot, Mail, Send, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { EmailDraft, EmailDraftIntent } from "@/lib/workspace/email-drafts"
import { createStakeholderEmailDraft } from "@/lib/workspace/email-drafts"
import type { StakeholderRole } from "@/lib/types"
import type { OpportunityWorkspaceData } from "@/lib/workspace/workspace-context"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "assistant" | "user"
  content: string
}

function getDraftIntent(role: StakeholderRole): EmailDraftIntent {
  switch (role) {
    case "economic_buyer":
      return "budget_alignment"
    case "evaluator":
      return "technical_validation"
    case "champion":
      return "follow_up"
    default:
      return "intro"
  }
}

function createStarterMessage(workspace: OpportunityWorkspaceData): ChatMessage {
  return {
    id: "assistant-intro",
    role: "assistant",
    content: `I can help summarize ${workspace.opportunity.account_name}, suggest next steps, and tee up outreach drafts for the mapped stakeholders.`,
  }
}

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  ),
}

export function OpportunityCopilot({
  workspace,
  onDraftEmail,
}: {
  workspace: OpportunityWorkspaceData
  onDraftEmail: (draft: EmailDraft) => void
}) {
  const starterPrompts = useMemo(
    () => [
      "Give me an AI overview of this opportunity.",
      "What are the next three actions I should take?",
      "Who is missing from this buying committee?",
      "What should I ask the evaluator next?",
    ],
    []
  )
  const [messages, setMessages] = useState<ChatMessage[]>([
    createStarterMessage(workspace),
  ])
  const [draftMessage, setDraftMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState<string | null>(null)

  async function submitMessage(content: string) {
    const trimmed = content.trim()

    if (!trimmed || isSubmitting) {
      return
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    }

    setMessages((current) => [...current, userMessage])
    setDraftMessage("")
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/opportunities/${workspace.opportunity.id}/copilot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: trimmed }),
        }
      )
      const data = (await response.json()) as {
        content?: string
        error?: string
        model?: string
      }

      if (!response.ok || !data.content) {
        throw new Error(data.error ?? "The copilot could not answer that.")
      }

      setModel(data.model ?? null)
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.content,
        },
      ])
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The copilot could not answer that."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-base text-balance">
          <Bot className="size-4 text-muted-foreground" />
          AI Overview
        </CardTitle>
        <CardDescription className="text-pretty">
          Opportunity-scoped chat powered by Backboard memory for this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              size="sm"
              className="h-auto whitespace-normal text-left text-xs text-pretty"
              onClick={() => submitMessage(prompt)}
              disabled={isSubmitting}
            >
              {prompt}
            </Button>
          ))}
        </div>

        <ScrollArea
          className="h-[360px] rounded-xl border bg-muted/20"
          aria-busy={isSubmitting}
        >
          <div className="space-y-3 p-4">
            {messages.map((message, index) => {
              const showDraftActions =
                message.role === "assistant" && index === messages.length - 1

              return (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[92%] rounded-2xl border px-4 py-3 text-sm text-pretty shadow-sm",
                    message.role === "assistant"
                      ? "bg-card"
                      : "ml-auto border-primary/20 bg-primary/10 text-foreground"
                  )}
                >
                  <div className="mb-2 flex items-center gap-2 text-[11px] uppercase text-muted-foreground">
                    <span>{message.role === "assistant" ? "Copilot" : "You"}</span>
                    {showDraftActions && model ? <Badge variant="outline">{model}</Badge> : null}
                  </div>
                  {message.role === "assistant" ? (
                    <div className="text-pretty">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  {showDraftActions && workspace.stakeholders.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {workspace.stakeholders.slice(0, 2).map((stakeholder) => (
                        <Button
                          key={stakeholder.id}
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            onDraftEmail(
                              createStakeholderEmailDraft({
                                opportunity: workspace.opportunity,
                                stakeholder,
                                intent: getDraftIntent(stakeholder.role),
                              })
                            )
                          }
                        >
                          <Mail className="size-4" />
                          Draft email to {stakeholder.name.split(" ")[0]}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
            {isSubmitting ? (
              <div className="max-w-[92%] rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase text-muted-foreground">
                  <span>Copilot</span>
                </div>
                <div className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  <span>Responding...</span>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            void submitMessage(draftMessage)
          }}
        >
          <Textarea
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder="Ask about risks, stakeholders, next steps, or outreach..."
            className="min-h-28 text-sm text-pretty"
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {workspace.stakeholders.slice(0, 2).map((stakeholder) => (
                <Button
                  key={stakeholder.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() =>
                    onDraftEmail(
                      createStakeholderEmailDraft({
                        opportunity: workspace.opportunity,
                        stakeholder,
                        intent: getDraftIntent(stakeholder.role),
                      })
                    )
                  }
                >
                  <Sparkles className="size-3.5 text-muted-foreground" />
                  Draft {stakeholder.name.split(" ")[0]} email
                </Button>
              ))}
            </div>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Send className="size-4" />
              {isSubmitting ? "Thinking..." : "Send"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
