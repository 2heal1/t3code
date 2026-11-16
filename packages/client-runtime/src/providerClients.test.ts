import { describe, expect, it } from "vite-plus/test";

import { resolveModelSourceLabel } from "./providerClients.ts";

describe("model source labels", () => {
  it("uses reported source metadata before a gateway namespace", () => {
    expect(
      resolveModelSourceLabel(
        { slug: "gateway/gpt-test", subProvider: "TRAE Internal" },
        "codex",
        "Codex Work",
      ),
    ).toBe("TRAE Internal");
    expect(
      resolveModelSourceLabel(
        { slug: "github-copilot/claude-test", subProvider: "GitHub Copilot" },
        "opencode",
        "OpenCode",
      ),
    ).toBe("GitHub Copilot");
  });

  it("keeps a gateway route distinct from the harness without guessing from model names", () => {
    for (const [slug, expected] of [
      ["trae-internal/gpt-test", "trae-internal"],
      ["auto/gpt-test", "auto"],
      ["other-provider/vendor/model", "other-provider"],
      ["gpt-test", "Codex Work"],
      ["openai.gpt-test", "Codex Work"],
      ["/local/model", "Codex Work"],
      ["https://example.com/model", "Codex Work"],
      ["gateway/", "Codex Work"],
    ] as const) {
      expect(resolveModelSourceLabel({ slug }, "codex", "Codex Work")).toBe(expected);
    }
    expect(resolveModelSourceLabel({ slug: "vendor/model" }, "pi", "Pi")).toBeUndefined();
  });
});
