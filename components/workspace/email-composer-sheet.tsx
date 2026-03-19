"use client"

import { useState, type FormEvent } from "react"
import { Mail, Send } from "lucide-react"
import { toast } from "sonner"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EmailDraft } from "@/lib/workspace/email-drafts"

function ComposerForm({
  draft,
  onClose,
}: {
  draft: EmailDraft
  onClose: () => void
}) {
  const [to, setTo] = useState(draft.to)
  const [subject, setSubject] = useState(draft.subject)
  const [body, setBody] = useState(draft.body)
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSending(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    toast.success(`Demo email queued for ${to}`)
    setIsSending(false)
    onClose()
  }

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          <Label htmlFor="composer-to">To</Label>
          <Input
            id="composer-to"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="composer-subject">Subject</Label>
          <Input
            id="composer-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="composer-body">Message</Label>
          <Textarea
            id="composer-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-72 text-sm text-pretty"
          />
        </div>
      </div>
      <SheetFooter className="border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSending} className="gap-2">
          <Send className="size-4" />
          {isSending ? "Sending..." : "Send Demo Email"}
        </Button>
      </SheetFooter>
    </form>
  )
}

export function EmailComposerSheet({
  draft,
  open,
  onOpenChange,
}: {
  draft: EmailDraft | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2 text-balance">
            <Mail className="size-4 text-muted-foreground" />
            Email Draft
          </SheetTitle>
          <SheetDescription className="text-pretty">
            Review or tweak the draft before sending. This is a demo-only send
            flow.
          </SheetDescription>
        </SheetHeader>
        {draft ? (
          <ComposerForm
            key={`${draft.to}-${draft.subject}`}
            draft={draft}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
