import { VectorStoreIndex } from "@vectorstores/core";
import { PDFReader } from "@vectorstores/readers/pdf";

import { useOpenAIEmbedding } from "../../../utils/embedding";

async function main() {
  useOpenAIEmbedding();
  // Load PDF
  const reader = new PDFReader();
  const documents = await reader.loadData("../data/brk-2022.pdf");

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Retrieve from the index
  const retriever = index.asRetriever();
  const response = await retriever.retrieve({
    query: "What mistakes did Warren E. Buffett make?",
  });

  // Output response
  console.log(JSON.stringify(response));
}

main().catch(console.error);
