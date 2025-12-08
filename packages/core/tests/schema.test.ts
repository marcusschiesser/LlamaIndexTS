import { describe, expect, test } from "vitest";
// Note: Settings import must come first to ensure correct module initialization order
import "@llamaindex/core";
import { Document, ImageDocument } from "@llamaindex/core";

describe("Document", () => {
  test("initializes", () => {
    const doc = new Document({ text: "text", id_: "docId" });
    expect(doc).toBeDefined();
  });

  test("should generate different hash for different image contents", () => {
    const imageNode1 = new ImageDocument({
      id_: "image",
      image: "data:image/png;base64,sample_image_content1",
    });
    const imageNode2 = new ImageDocument({
      id_: "image",
      image: "data:image/png;base64,sample_image_content2",
    });
    expect(imageNode1.hash).not.toBe(imageNode2.hash);
  });
});
