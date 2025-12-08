import { VectorStoreIndex } from "@vectorstores/core";
import { MilvusVectorStore } from "@vectorstores/milvus";

const collectionName = "movie_reviews";

async function main() {
  try {
    const milvus = new MilvusVectorStore({ collection: collectionName });

    const index = await VectorStoreIndex.fromVectorStore(milvus);

    const retriever = index.asRetriever({ similarityTopK: 20 });

    const results = await retriever.retrieve({
      query: "What is the best reviewed movie?",
    });

    console.log(JSON.stringify(results));
  } catch (e) {
    console.error(e);
  }
}

void main();
