import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  Document,
  MetadataMode,
  NodeWithScore,
  Settings,
  VectorStoreIndex,
} from "@vectorstores/core";
import { openai } from "@vectorstores/openai";

import { useOpenAIEmbedding } from "../utils/embedding";

Settings.llm = openai({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
});
useOpenAIEmbedding();

async function main() {
  // Load essay from abramov.txt in Node
  const filePath = fileURLToPath(
    new URL("../data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");

  // Create Document object with essay
  const document = new Document({ text: essay, id_: filePath });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document]);

  // Query the index
  const queryEngine = index.asQueryEngine();
  const { message, sourceNodes } = await queryEngine.query({
    query: "What did the author do in college?",
  });

  // Output response with sources
  console.log(message.content);

  if (sourceNodes) {
    sourceNodes.forEach((source: NodeWithScore, index: number) => {
      console.log(
        `\n${index}: Score: ${source.score} - ${source.node.getContent(MetadataMode.NONE).substring(0, 50)}...\n`,
      );
    });
  }
}

main().catch(console.error);
