import { VectorStoreIndex } from "@vectorstores/core";
import { DocxReader } from "@vectorstores/readers/docx";
import { fileURLToPath } from "node:url";

import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";
import { ensureOpenAIKey } from "../../shared/utils/runtime";

const FILE_PATH = fileURLToPath(
  new URL("../../shared/data/stars.docx", import.meta.url),
);
const SAMPLE_QUERY = "Information about Zodiac";

async function main() {
  if (!ensureOpenAIKey()) return;
  useOpenAIEmbedding();
  // Load docx file
  console.log("Loading data...");
  const reader = new DocxReader();
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
