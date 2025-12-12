import { AstraDBVectorStore } from "@vectorstores/astra";
import { VectorStoreIndex } from "@vectorstores/core";
import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";
import { ensureOpenAIKey } from "../../shared/utils/runtime";

const collectionName = "movie_reviews";

async function main() {
  try {
    if (!ensureOpenAIKey()) return;
    useOpenAIEmbedding();

    const astraVS = new AstraDBVectorStore({ contentKey: "reviewtext" });
    await astraVS.connect(collectionName);

    const index = await VectorStoreIndex.fromVectorStore(astraVS);

    const retriever = index.asRetriever({ similarityTopK: 20 });

    const results = await retriever.retrieve({
      query: 'How was "La Sapienza" reviewed?',
    });

    console.log(formatRetrieverResponse(results));
  } catch (e) {
    console.error(e);
  }
}

void main();
