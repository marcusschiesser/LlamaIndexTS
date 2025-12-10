import { AstraDBVectorStore } from "@vectorstores/astra";
import { VectorStoreIndex } from "@vectorstores/core";

const collectionName = "movie_reviews";

async function main() {
  try {
    const astraVS = new AstraDBVectorStore({ contentKey: "reviewtext" });
    await astraVS.connect(collectionName);

    const index = await VectorStoreIndex.fromVectorStore(astraVS);

    const retriever = index.asRetriever({ similarityTopK: 20 });

    const results = await retriever.retrieve({
      query: 'How was "La Sapienza" reviewed?',
    });

    console.log(JSON.stringify(results));
  } catch (e) {
    console.error(e);
  }
}

void main();
