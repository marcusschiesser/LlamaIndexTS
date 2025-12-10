import { VectorStoreIndex } from "@vectorstores/core";
import { HTMLReader } from "@vectorstores/readers/html";

async function main() {
  // Load page
  const reader = new HTMLReader();
  const documents = await reader.loadData("../data/vectorstores.html");

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Retrieve from the index
  const retriever = index.asRetriever();
  const response = await retriever.retrieve({
    query: "What can I do with vectorstores?",
  });

  // Output response
  console.log(JSON.stringify(response));
}

main().catch(console.error);
