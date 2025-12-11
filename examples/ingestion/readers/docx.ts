import { VectorStoreIndex } from "@vectorstores/core";
import { DocxReader } from "@vectorstores/readers/docx";

import { formatRetrieverResponse } from "../../shared/utils/format-response";

const FILE_PATH = "../shared/data/stars.docx";
const SAMPLE_QUERY = "Information about Zodiac";

async function main() {
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
