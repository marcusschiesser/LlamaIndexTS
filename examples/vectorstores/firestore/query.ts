import "dotenv/config";

import { VectorStoreIndex } from "@vectorstores/core";

import { CollectionReference } from "@google-cloud/firestore";
import { FirestoreVectorStore } from "@vectorstores/firestore";

import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";

const indexName = "MovieReviews";

useOpenAIEmbedding();

async function main() {
  try {
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
    const index = await VectorStoreIndex.fromVectorStore(vectorStore);
    const retriever = index.asRetriever({ similarityTopK: 20 });

    const query = "Get all movie titles.";
    const results = await retriever.retrieve({ query });
    console.log(`Retrieved ${results.length} nodes`);
    console.log(formatRetrieverResponse(results));

    console.log("\n=====\nQuerying the index with filters");
    const retrieverWithFilters = index.asRetriever({
      similarityTopK: 20,
      filters: {
        filters: [
          {
            key: "file_name",
            value: "movie_reviews.csv",
            operator: "==",
          },
        ],
      },
    });
    const resultAfterFilter = await retrieverWithFilters.retrieve({
      query: "Get all movie titles.",
    });
    console.log(`Retrieved ${resultAfterFilter.length} nodes`);
    console.log(formatRetrieverResponse(resultAfterFilter));
  } catch (e) {
    console.error(e);
  }
}

void main();
