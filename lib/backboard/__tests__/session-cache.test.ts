import os from "node:os"
import path from "node:path"
import { mkdtemp, rm } from "node:fs/promises"

import { afterEach, describe, expect, it } from "vitest"

import {
  loadSessionCache,
  saveSessionCache,
  updateOpportunityThread,
} from "@/lib/backboard/session-cache"

describe("session cache", () => {
  const directories: string[] = []

  afterEach(async () => {
    await Promise.all(
      directories.splice(0).map((directory) =>
        rm(directory, { recursive: true, force: true })
      )
    )
  })

  it("persists assistant and opportunity thread ids", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "backboard-cache-"))
    directories.push(directory)
    const cachePath = path.join(directory, "cache.json")

    await saveSessionCache(cachePath, {
      assistantId: "assistant_123",
      threadsByOpportunity: {
        opp_001: "thread_001",
      },
    })

    const loaded = await loadSessionCache(cachePath)

    expect(loaded.assistantId).toBe("assistant_123")
    expect(loaded.threadsByOpportunity.opp_001).toBe("thread_001")
  })

  it("updates a single opportunity thread without removing previous values", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "backboard-cache-"))
    directories.push(directory)
    const cachePath = path.join(directory, "cache.json")

    await saveSessionCache(cachePath, {
      assistantId: "assistant_123",
      threadsByOpportunity: {
        opp_001: "thread_001",
      },
    })

    const updated = await updateOpportunityThread(
      cachePath,
      "opp_002",
      "thread_002"
    )

    expect(updated.threadsByOpportunity).toEqual({
      opp_001: "thread_001",
      opp_002: "thread_002",
    })
  })
})
