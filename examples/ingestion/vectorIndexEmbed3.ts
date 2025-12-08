import { VectorStoreIndex } from "@vectorstores/core/indices";
import { Document } from "@vectorstores/core/schema";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { useOpenAIEmbedding } from "../utils/embedding";

// Update embed model
useOpenAIEmbedding("text-embedding-3-small");

async function main() {
  // Load essay from abramov.txt in Node
  const filePath = fileURLToPath(
    new URL("../data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");

  // Create Document object with essay
  const document = new Document({ text: essay, id_: filePath });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document]);

  const retriever = index.asRetriever();

  const response = await retriever.retrieve({
    query: "What did the author do in college?",
  });

  // Output response
  console.log(JSON.stringify(response));
}

main().catch(console.error);
