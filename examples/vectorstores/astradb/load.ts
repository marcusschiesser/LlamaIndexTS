import { AstraDBVectorStore } from "@vectorstores/astra";
import {
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import { CSVReader } from "@vectorstores/readers/csv";

const collectionName = "movie_reviews";

async function main() {
  try {
    const reader = new CSVReader(false);
    const docs = await reader.loadData("./data/movie_reviews.csv");

    const astraVS = new AstraDBVectorStore({ contentKey: "reviewtext" });
    await astraVS.createAndConnect(collectionName, {
      vector: { dimension: 1536, metric: "cosine" },
    });
    await astraVS.connect(collectionName);

    const ctx = await storageContextFromDefaults({ vectorStore: astraVS });
    const index = await VectorStoreIndex.fromDocuments(docs, {
      storageContext: ctx,
    });
  } catch (e) {
    console.error(e);
  }
}

void main();
