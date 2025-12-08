import { ClipEmbedding } from "@vectorstores/clip";
import { ImageNode, Settings } from "@vectorstores/core";
import { OpenAIEmbedding } from "@vectorstores/openai";
import assert from "node:assert";
import { test } from "node:test";

test.beforeEach(() => {
  Settings.embedModel = new OpenAIEmbedding();
});

await test.skip("clip embedding", async (t) => {
  const major = parseInt(process.versions.node.split(".")[0] ?? "0", 10);
  if (major < 20) {
    t.skip("Skip CLIP tests on Node.js < 20");
    return;
  }
  const imageUrl = new URL(
    "../../fixtures/img/vectorstores-white.png",
    import.meta.url,
  );

  await t.test("init & get image embedding", async () => {
    const clipEmbedding = new ClipEmbedding();
    const vec = await clipEmbedding.getImageEmbedding(imageUrl);
    assert.ok(vec);
  });

  await t.test("load image document", async () => {
    const nodes = [
      new ImageNode({
        image: imageUrl,
      }),
    ];
    const clipEmbedding = new ClipEmbedding();
    const result = await clipEmbedding(nodes);
    assert.strictEqual(result.length, 1);
    assert.ok(result[0]!.embedding);
  });
});
