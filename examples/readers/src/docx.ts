import { VectorStoreIndex } from "@vectorstores/core";
import { DocxReader } from "@vectorstores/readers/docx";

const FILE_PATH = "../data/stars.docx";
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
  console.log(`Test query > ${SAMPLE_QUERY}:\n`, JSON.stringify(response));
}

void main();
