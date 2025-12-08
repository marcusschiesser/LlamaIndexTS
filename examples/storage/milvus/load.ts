import {
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import { MilvusVectorStore } from "@vectorstores/milvus";
import { CSVReader } from "@vectorstores/readers/csv";

const collectionName = "movie_reviews";

async function main() {
  try {
    const reader = new CSVReader(false);
    const docs = await reader.loadData("./data/movie_reviews.csv");

    const vectorStore = new MilvusVectorStore({ collection: collectionName });

    const ctx = await storageContextFromDefaults({ vectorStore });
    const index = await VectorStoreIndex.fromDocuments(docs, {
      storageContext: ctx,
    });
  } catch (e) {
    console.error(e);
  }
}

void main();
