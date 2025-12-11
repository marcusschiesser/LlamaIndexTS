import { VectorStoreIndex } from "@vectorstores/core";
import { MilvusVectorStore } from "@vectorstores/milvus";
import { formatRetrieverResponse } from "../../shared/utils/format-response";

const collectionName = "movie_reviews";

async function main() {
  try {
    const milvus = new MilvusVectorStore({ collection: collectionName });

    const index = await VectorStoreIndex.fromVectorStore(milvus);

    const retriever = index.asRetriever({ similarityTopK: 20 });

    const results = await retriever.retrieve({
      query: "What is the best reviewed movie?",
    });

    console.log(formatRetrieverResponse(results));
  } catch (e) {
    console.error(e);
  }
}

void main();
