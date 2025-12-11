import { CollectionReference } from "@google-cloud/firestore";
import { CSVReader } from "@vectorstores/readers/csv";
import "dotenv/config";

import {
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";

import { FirestoreVectorStore } from "@vectorstores/firestore";

import { useOpenAIEmbedding } from "../../utils/embedding";

const indexName = "MovieReviews";

useOpenAIEmbedding();

async function main() {
  try {
    const reader = new CSVReader(false);
    const docs = await reader.loadData("./data/movie_reviews.csv");

    const vectorStore = new FirestoreVectorStore({
      clientOptions: {
        credentials: JSON.parse(process.env.GCP_CREDENTIALS!),
        projectId: process.env.GCP_PROJECT_ID!,
        databaseId: process.env.FIRESTORE_DB!,
        ignoreUndefinedProperties: true,
      },
      collectionName: indexName,
      customCollectionReference: (rootCollection: CollectionReference) => {
        return rootCollection.doc("accountId-123").collection("vectors");
      },
    });

    const storageContext = await storageContextFromDefaults({ vectorStore });

    await VectorStoreIndex.fromDocuments(docs, { storageContext });
  } catch (e) {
    console.error(e);
  }
}

void main();
