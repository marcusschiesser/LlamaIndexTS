import {
  BaseEmbedding,
  Document,
  IngestionPipeline,
  SentenceSplitter,
  VectorStoreIndex,
} from "@vectorstores/core";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { getOpenAIEmbedding } from "../utils/embedding";

// Update embed model
const embedFunc = getOpenAIEmbedding("text-embedding-3-small");

async function main() {
  // Load essay from abramov.txt in Node
  const filePath = fileURLToPath(
    new URL("../data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");

  // Create Document object with essay
  const document = new Document({ text: essay, id_: filePath });
  const pipeline = new IngestionPipeline({
    transformations: [
      new SentenceSplitter({ chunkSize: 1024, chunkOverlap: 20 }),
      new BaseEmbedding({ embedFunc }),
    ],
  });
  console.time("Pipeline Run Time");

  const nodes = await pipeline.run({ documents: [document] });

  console.timeEnd("Pipeline Run Time");

  // initialize the VectorStoreIndex from nodes
  const index = await VectorStoreIndex.init({ nodes });

  // Query the index
  const queryEngine = index.asQueryEngine();

  const { message } = await queryEngine.query({
    query: "summarize the article in three sentence",
  });

  console.log(message);
}

main().catch(console.error);
