import { VectorStoreIndex } from "@vectorstores/core";
import { MarkdownReader } from "@vectorstores/readers/markdown";

async function main() {
  // Load Markdown file
  const reader = new MarkdownReader();
  const documents = await reader.loadData("../README.md");

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Retrieve from the index
  const retriever = index.asRetriever();

  const response = await retriever.retrieve({
    query: "What does the example code do?",
  });

  // Output response
  console.log(JSON.stringify(response));
}

main().catch(console.error);
