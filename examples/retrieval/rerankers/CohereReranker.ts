import { CohereRerank } from "@vectorstores/cohere";
import { Document, VectorStoreIndex } from "@vectorstores/core";

import essay from "../../shared/data/essay";

async function main() {
  const document = new Document({ text: essay, id_: "essay" });

  const index = await VectorStoreIndex.fromDocuments([document]);

  const cohereRerank = new CohereRerank({
    apiKey: "<COHERE_API_KEY>",
    topN: 5,
  });

  const retriever = index.asRetriever({
    similarityTopK: 5,
  });

  const query = "What did the author do growing up?";

  // Retrieve nodes
  const nodes = await retriever.retrieve({ query });

  // Apply Cohere reranking
  const rerankedNodes = await cohereRerank.postprocessNodes(nodes, query);

  // cohere response
  console.log("With Cohere reranking:", JSON.stringify(rerankedNodes));

  // response without cohere
  console.log("Without Cohere reranking:", JSON.stringify(nodes));
}

main().catch(console.error);
