import {
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import { CSVReader } from "@vectorstores/readers/csv";
import { WeaviateVectorStore } from "@vectorstores/weaviate";

const indexName = "MovieReviews";

async function main() {
  try {
    const reader = new CSVReader(false);
    const docs = await reader.loadData("./data/movie_reviews.csv");
    const vectorStore = new WeaviateVectorStore({ indexName });
    const storageContext = await storageContextFromDefaults({ vectorStore });
    await VectorStoreIndex.fromDocuments(docs, { storageContext });
    console.log("Successfully loaded data into Weaviate");
  } catch (e) {
    console.error(e);
  }
}

void main();
