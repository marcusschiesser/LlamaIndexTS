import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { Anthropic } from "@vectorstores/anthropic";
import {
  Document,
  Settings,
  VectorStoreIndex,
  getResponseSynthesizer,
} from "@vectorstores/core";

// Update llm to use Anthropic
Settings.llm = new Anthropic();

async function main() {
  // Load essay from abramov.txt in Node
  const filePath = fileURLToPath(
    new URL("../data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");

  // Create Document object with essay
  const document = new Document({ text: essay, id_: filePath });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const responseSynthesizer = getResponseSynthesizer("compact");

  const index = await VectorStoreIndex.fromDocuments([document]);

  // Query the index
  const queryEngine = index.asQueryEngine({ responseSynthesizer });
  const response = await queryEngine.query({
    query: "What did the author do in college?",
  });

  // Output response
  console.log(response.toString());
}

main().catch(console.error);
