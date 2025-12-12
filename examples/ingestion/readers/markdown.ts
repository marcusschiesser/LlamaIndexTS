import { VectorStoreIndex } from "@vectorstores/core";
import { MarkdownReader } from "@vectorstores/readers/markdown";
import { fileURLToPath } from "node:url";

import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";
import { ensureOpenAIKey } from "../../shared/utils/runtime";

const FILE_PATH = fileURLToPath(
  new URL("../../shared/data/planets.md", import.meta.url),
);
const SAMPLE_QUERY = "List all planets";

async function main() {
  if (!ensureOpenAIKey()) return;
  useOpenAIEmbedding();
  // Load markdown file
  console.log("Loading data...");
  const reader = new MarkdownReader();
  const documents = await reader.loadData(FILE_PATH);

  // Create embeddings
  console.log("Creating embeddings...");
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Test retrieval
  const retriever = index.asRetriever();
  const response = await retriever.retrieve({ query: SAMPLE_QUERY });
  console.log(`Test query > ${SAMPLE_QUERY}:`);
  console.log(formatRetrieverResponse(response));
}

void main();
