/**
 * This example shows how to set up a tokenizer for use with TokenTextSplitter
 * or any component that needs token-based text measurement.
 *
 * The tokenizer is no longer built into @llamaindex/env, so you need to:
 * 1. Install js-tiktoken or gpt-tokenizer directly in your project
 * 2. Configure Settings.tokenSizer with your tokenizer
 */

import { getEncoding } from "js-tiktoken";
import { Settings, TokenTextSplitter } from "llamaindex";

// Create a tokenizer using js-tiktoken
const encoding = getEncoding("cl100k_base");

// Set up the global tokenSizer in Settings
// This function takes text and returns the number of tokens
Settings.tokenSizer = (text: string) => encoding.encode(text).length;

// Now you can use TokenTextSplitter which requires a tokenizer
async function main() {
  const splitter = new TokenTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

  const text =
    "This is a sample text that will be split into chunks based on token count. " +
    "The TokenTextSplitter uses the tokenSizer function we configured in Settings " +
    "to measure the length of text in tokens rather than characters.";

  const chunks = splitter.splitText(text);
  console.log("Number of chunks:", chunks.length);
  console.log("Chunks:", chunks);

  // You can also measure tokens directly
  console.log("\nToken counts:");
  for (const chunk of chunks) {
    const tokenCount = Settings.tokenSizer!(chunk);
    console.log(`  "${chunk.slice(0, 50)}..." - ${tokenCount} tokens`);
  }
}

main().catch(console.error);
