import { VectorStoreIndex } from "@vectorstores/core";
import { WeaviateVectorStore } from "@vectorstores/weaviate";
import { formatRetrieverResponse } from "../../shared/utils/format-response";

const indexName = "MovieReviews";

async function main() {
  try {
    const query = "Get all movie titles.";
    const vectorStore = new WeaviateVectorStore({ indexName });
    const index = await VectorStoreIndex.fromVectorStore(vectorStore);
    const retriever = index.asRetriever({ similarityTopK: 20 });

    const results = await retriever.retrieve({ query });
    console.log(`Retrieved ${results.length} nodes`);
    console.log(formatRetrieverResponse(results));

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
            value: "./data/movie_reviews.csv_21",
            operator: "==",
          },
        ],
        condition: "or",
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
