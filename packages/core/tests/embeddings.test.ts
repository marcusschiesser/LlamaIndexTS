import { BaseEmbedding } from "@llamaindex/core/embeddings";
import { describe, expect, test } from "vitest";

describe("BaseEmbedding", () => {
  test("should be defined", () => {
    expect(BaseEmbedding).toBeDefined();
  });
});
