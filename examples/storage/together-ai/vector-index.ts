import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { Document, Settings, VectorStoreIndex } from "@vectorstores/core";
import { TogetherEmbedding } from "@vectorstores/together";

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

  const retriever = index.asRetriever();

  const response = await retriever.retrieve({
    query: "What did the author do in college?",
  });

  console.log(JSON.stringify(response));
}

main().catch(console.error);
