import { VectorStoreIndex } from "@vectorstores/core";
import { MilvusVectorStore } from "@vectorstores/milvus";

const collectionName = "movie_reviews";

async function main() {
  try {
    const milvus = new MilvusVectorStore({ collection: collectionName });
    const index = await VectorStoreIndex.fromVectorStore(milvus);

    console.log("\n=====\nQuerying the index with filters");
    const retrieverWithFilters = index.asRetriever({
      similarityTopK: 20,
      filters: {
        filters: [
          {
            key: "document_id",
            value: "./data/movie_reviews.csv_37",
            operator: "==",
          },
          {
            key: "document_id",
            value: "./data/movie_reviews.csv_37",
            operator: "!=",
          },
        ],
        condition: "or",
      },
    });
    const resultAfterFilter = await retrieverWithFilters.retrieve({
      query: "Get all movie titles.",
    });
    console.log(`Retrieved ${resultAfterFilter.length} nodes`);
    console.log(JSON.stringify(resultAfterFilter));
  } catch (e) {
    console.error(e);
  }
}

void main();
