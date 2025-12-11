import { ChromaVectorStore } from "@vectorstores/chroma";
import {
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import { CSVReader } from "@vectorstores/readers/csv";
import { formatRetrieverResponse } from "../../shared/utils/format-response";

const collectionName = "movie_reviews";

async function main() {
  const sourceFile: string = "../shared/data/movie_reviews.csv";

  try {
    console.log(`Loading data from ${sourceFile}`);
    const reader = new CSVReader(false, ", ", "\n");
    const docs = await reader.loadData(sourceFile);

    console.log("Creating ChromaDB vector store");
    const chromaVS = new ChromaVectorStore({ collectionName });
    const ctx = await storageContextFromDefaults({ vectorStore: chromaVS });

    console.log("Embedding documents and adding to index");
    const index = await VectorStoreIndex.fromDocuments(docs, {
      storageContext: ctx,
    });

    console.log("Querying index");
    const retriever = index.asRetriever();
    const response = await retriever.retrieve({
      query: "Tell me about Godfrey Cheshire's rating of La Sapienza.",
    });
    console.log(formatRetrieverResponse(response));
  } catch (e) {
    console.error(e);
  }
}

void main();
