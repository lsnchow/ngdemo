import { describe, expect, it } from "vitest"

import { extractCopilotReply } from "@/lib/backboard/client"

describe("Backboard client helpers", () => {
  it("extracts the latest assistant message from a chat messages response", () => {
    const content = extractCopilotReply({
      messages: [
        {
          role: "user",
          content: "Give me an overview",
        },
        {
          role: "assistant",
          content: "Here is the latest opportunity summary.",
        },
      ],
    })

    expect(content).toBe("Here is the latest opportunity summary.")
  })

  it("throws when the chat response has no assistant content", () => {
    expect(() =>
      extractCopilotReply({
        messages: [
          {
            role: "user",
            content: "Hello",
          },
        ],
      })
    ).toThrow("Backboard returned no assistant response")
  })
})
