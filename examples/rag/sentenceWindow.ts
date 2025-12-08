/**
 * This example demonstrates using Settings.embedFunc with @huggingface/transformers
 * to create embeddings for a sentence window retrieval system.
 */

import {
  pipeline,
  type FeatureExtractionPipeline,
} from "@huggingface/transformers";
import {
  Document,
  MetadataReplacementPostProcessor,
  SentenceWindowNodeParser,
  Settings,
  VectorStoreIndex,
} from "llamaindex";

import essay from "../data/essay";

// Initialize the embedding pipeline using @huggingface/transformers
let embedder: FeatureExtractionPipeline | null = null;

async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      dtype: "fp32",
    });
  }
  return embedder;
}

// Set up the global embedFunc in Settings using @huggingface/transformers
Settings.embedFunc = async (texts: string[]): Promise<number[][]> => {
  const pipe = await getEmbedder();
  const embeddings: number[][] = [];

  for (const text of texts) {
    const output = await pipe(text, { pooling: "mean", normalize: true });
    embeddings.push(Array.from(output.data as Float32Array));
  }

  return embeddings;
};

// Update node parser
Settings.nodeParser = new SentenceWindowNodeParser({
  windowSize: 3,
  windowMetadataKey: "window",
  originalTextMetadataKey: "original_text",
});

async function main() {
  const document = new Document({ text: essay, id_: "essay" });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document], {
    logProgress: true,
  });

  // Query the index
  const queryEngine = index.asQueryEngine({
    nodePostprocessors: [new MetadataReplacementPostProcessor("window")],
  });

  const response = await queryEngine.query({
    query: "What did the author do in college?",
  });

  // Output response
  console.log(response.toString());
}

main().catch(console.error);
