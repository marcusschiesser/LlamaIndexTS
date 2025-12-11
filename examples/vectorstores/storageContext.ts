import {
  Document,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import essay from "../shared/data/essay";
import { formatRetrieverResponse } from "../shared/utils/format-response";

async function main() {
  // Create Document object with essay
  const document = new Document({ text: essay, id_: "essay" });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  // persist the vector store automatically with the storage context
  const storageContext = await storageContextFromDefaults({
    persistDir: "./storage",
  });
  const index = await VectorStoreIndex.fromDocuments([document], {
    storageContext,
  });

  // Retrieve from the index
  const retriever = index.asRetriever();
  const response = await retriever.retrieve({
    query: "What did the author do in college?",
  });

  // Output response
  console.log(formatRetrieverResponse(response));

  // load the index
  const secondStorageContext = await storageContextFromDefaults({
    persistDir: "./storage",
  });
  const loadedIndex = await VectorStoreIndex.init({
    storageContext: secondStorageContext,
  });
  const loadedRetriever = loadedIndex.asRetriever();
  const loadedResponse = await loadedRetriever.retrieve({
    query: "What did the author do growing up?",
  });
  console.log(formatRetrieverResponse(loadedResponse));
}

main().catch(console.error);
