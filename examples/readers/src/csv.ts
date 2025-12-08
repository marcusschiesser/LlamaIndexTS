import { VectorStoreIndex } from "@vectorstores/core";
import { CSVReader } from "@vectorstores/readers/csv";

async function main() {
  // Load CSV
  const reader = new CSVReader();
  const path = "../data/titanic_train.csv";
  const documents = await reader.loadData(path);

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Retrieve from the index
  const retriever = index.asRetriever();

  const response = await retriever.retrieve({
    query: "What is the correlation between survival and age?",
  });

  // Output response
  console.log(JSON.stringify(response));
}

main().catch(console.error);
