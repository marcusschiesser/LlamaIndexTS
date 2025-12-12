import { VectorStoreIndex } from "@vectorstores/core";
import { CSVReader } from "@vectorstores/readers/csv";
import { fileURLToPath } from "node:url";

import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";
import { ensureOpenAIKey } from "../../shared/utils/runtime";

async function main() {
  if (!ensureOpenAIKey()) return;
  useOpenAIEmbedding();
  // Load CSV
  const reader = new CSVReader();
  const path = fileURLToPath(
    new URL("../../shared/data/titanic_train.csv", import.meta.url),
  );
  const documents = await reader.loadData(path);

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Retrieve from the index
  const retriever = index.asRetriever();

  const response = await retriever.retrieve({
    query: "What is the correlation between survival and age?",
  });

  // Output response
  console.log(formatRetrieverResponse(response));
}

main().catch(console.error);
