import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { Document, Settings, VectorStoreIndex } from "@vectorstores/core";
import { TogetherEmbedding, TogetherLLM } from "@vectorstores/together";

// Update llm to use TogetherAI
Settings.llm = new TogetherLLM({
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
});

// Update embedModel
Settings.embedModel = new TogetherEmbedding();

async function main() {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing TOGETHER_API_KEY");
  }
  const filePath = fileURLToPath(
    new URL("../../data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");

  const document = new Document({ text: essay, id_: filePath });

  const index = await VectorStoreIndex.fromDocuments([document]);

  const queryEngine = index.asQueryEngine();

  const response = await queryEngine.query({
    query: "What did the author do in college?",
  });

  console.log(response.toString());
}

main().catch(console.error);
