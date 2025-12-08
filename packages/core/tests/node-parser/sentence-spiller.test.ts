import { Document, SentenceSplitter } from "@llamaindex/core";
import { getEncoding } from "js-tiktoken";
import { beforeEach, describe, expect, test } from "vitest";

// Create tokenizer from js-tiktoken for tests
const encoding = getEncoding("cl100k_base");
const tokenSizer = (text: string) => encoding.encode(text).length;

describe("SentenceSplitter", () => {
  let sentenceSplitter: SentenceSplitter;

  beforeEach(() => {
    sentenceSplitter = new SentenceSplitter({
      chunkSize: 1024,
      chunkOverlap: 20,
      tokenSizer,
    });
  });

  test("getNodesFromDocuments should return child nodes with equal but not the same metadata", () => {
    const doc = new Document({
      text: "Hello. Cat Mouse. Dog.",
      metadata: { animals: true },
      excludedLlmMetadataKeys: ["animals"],
      excludedEmbedMetadataKeys: ["animals"],
    });
    const result = sentenceSplitter.getNodesFromDocuments([doc]);
    expect(result.length).toEqual(1);
    const node = result[0]!;
    // check not the same object
    expect(node.metadata).not.toBe(doc.metadata);
    expect(node.excludedLlmMetadataKeys).not.toBe(doc.excludedLlmMetadataKeys);
    expect(node.excludedEmbedMetadataKeys).not.toBe(
      doc.excludedEmbedMetadataKeys,
    );
    // but the same content
    expect(node.metadata).toEqual(doc.metadata);
    expect(node.excludedLlmMetadataKeys).toEqual(doc.excludedLlmMetadataKeys);
    expect(node.excludedEmbedMetadataKeys).toEqual(
      doc.excludedEmbedMetadataKeys,
    );
    // check relationship
    expect(node.sourceNode?.nodeId).toBe(doc.id_);
  });

  test("split long text", async () => {
    const longSentence = "is ".repeat(9000) + ".";
    const document = new Document({ text: longSentence, id_: "1" });
    const result = sentenceSplitter.getNodesFromDocuments([document]);
    // The actual number of chunks depends on tokenizer behavior
    // With chunkSize 1024 and overlap 20, we expect multiple chunks
    expect(result.length).toBeGreaterThan(1);
    result.forEach((node) => {
      const length = tokenSizer(node.text);
      expect(length).toBeLessThanOrEqual(1024);
    });
  });
});
