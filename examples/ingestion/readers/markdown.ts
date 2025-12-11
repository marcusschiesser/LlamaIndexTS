import { VectorStoreIndex } from "@vectorstores/core";
import { MarkdownReader } from "@vectorstores/readers/markdown";

const FILE_PATH = "../shared/data/planets.md";
const SAMPLE_QUERY = "List all planets";

async function main() {
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
  console.log(`Test query > ${SAMPLE_QUERY}:\n`, JSON.stringify(response));
}

void main();
