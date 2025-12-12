import { CohereRerank } from "@vectorstores/cohere";
import { Document, VectorStoreIndex } from "@vectorstores/core";

import essay from "../../shared/data/essay";
import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";
import { ensureEnv, ensureOpenAIKey } from "../../shared/utils/runtime";

async function main() {
  if (!ensureOpenAIKey()) return;
  const cohereApiKey = ensureEnv(
    "COHERE_API_KEY",
    [
      "Cohere API key not found in environment variables.",
      'Please set COHERE_API_KEY, e.g. `export COHERE_API_KEY="..."`',
      "Get a key at https://dashboard.cohere.com/api-keys",
    ].join("\n"),
  );
  if (!cohereApiKey) return;

  const cohereModel = process.env.COHERE_RERANK_MODEL ?? "rerank-v3.5";

  useOpenAIEmbedding();

  const document = new Document({ text: essay, id_: "essay" });

  const index = await VectorStoreIndex.fromDocuments([document]);

  const cohereRerank = new CohereRerank({
    apiKey: cohereApiKey,
    topN: 5,
    model: cohereModel,
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
  console.log("With Cohere reranking:");
  console.log(formatRetrieverResponse(rerankedNodes));

  // response without cohere
  console.log("Without Cohere reranking:");
  console.log(formatRetrieverResponse(nodes));
}

main().catch(console.error);
