import { VectorStoreIndex } from "@vectorstores/core";
import { HTMLReader } from "@vectorstores/readers/html";
import { fileURLToPath } from "node:url";

import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";
import { ensureOpenAIKey } from "../../shared/utils/runtime";

async function main() {
  if (!ensureOpenAIKey()) return;
  useOpenAIEmbedding();
  // Load page
  const reader = new HTMLReader();
  const filePath = fileURLToPath(
    new URL("../../shared/data/vectorstores.html", import.meta.url),
  );
  const documents = await reader.loadData(filePath);

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Retrieve from the index
  const retriever = index.asRetriever();
  const response = await retriever.retrieve({
    query: "What can I do with vectorstores?",
  });

  // Output response
  console.log(formatRetrieverResponse(response));
}

main().catch(console.error);
