/**
 * This example shows how to set up embeddings using Settings.embedFunc
 * with @huggingface/transformers directly.
 *
 * Previously, @vectorstores/env provided transformer utilities, but now you need to:
 * 1. Install @huggingface/transformers directly in your project
 * 2. Configure Settings.embedFunc with your embedding function
 */

import {
  type FeatureExtractionPipeline,
  pipeline,
} from "@huggingface/transformers";
import { Document, Settings, VectorStoreIndex } from "@vectorstores/core";

// Initialize the embedding pipeline lazily
let embedder: FeatureExtractionPipeline | null = null;

async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedder) {
    console.log("Loading embedding model...");
    const result = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        dtype: "fp32",
      },
    );
    embedder = result as FeatureExtractionPipeline;
    console.log("Embedding model loaded!");
  }
  return embedder;
}

// Set up the global embedFunc in Settings
// This function takes an array of texts and returns an array of embedding vectors
Settings.embedFunc = async (texts: string[]): Promise<number[][]> => {
  const pipe = await getEmbedder();
  const embeddings: number[][] = [];

  for (const text of texts) {
    const output = await pipe(text, { pooling: "mean", normalize: true });
    embeddings.push(Array.from(output.data as Float32Array));
  }

  return embeddings;
};

async function main() {
  // Create some sample documents
  const documents = [
    new Document({
      text: "The quick brown fox jumps over the lazy dog.",
      id_: "doc1",
    }),
    new Document({
      text: "Machine learning is a subset of artificial intelligence.",
      id_: "doc2",
    }),
    new Document({
      text: "Natural language processing enables computers to understand text.",
      id_: "doc3",
    }),
  ];

  console.log("Creating vector index with custom embeddings...");

  // Create a vector index - it will use Settings.embedFunc automatically
  const index = await VectorStoreIndex.fromDocuments(documents, {
    logProgress: true,
  });

  console.log("\nRetrieving from the index...");

  // Retrieve from the index
  const retriever = index.asRetriever();
  const response = await retriever.retrieve({
    query: "What is machine learning?",
  });

  console.log("\nResponse:", JSON.stringify(response));

  // You can also use the embedding function directly
  console.log("\nDirect embedding example:");
  const embeddings = await Settings.embedFunc!(["Hello, world!"]);
  console.log(`Embedding dimension: ${embeddings[0]?.length}`);
}

main().catch(console.error);
