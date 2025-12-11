import { Document, VectorStoreIndex } from "@vectorstores/core";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { useOpenAIEmbedding } from "../shared/utils/embedding";
import { formatRetrieverResponse } from "../shared/utils/format-response";

async function main() {
  // Use OpenAI embeddings
  useOpenAIEmbedding("text-embedding-3-small");
  // Load essay from abramov.txt in Node
  const filePath = fileURLToPath(
    new URL("../shared/data/abramov.txt", import.meta.url),
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

  // Output response as a formatted table
  console.log(formatRetrieverResponse(response));
}

main().catch(console.error);
