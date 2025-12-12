/**
 * This example shows how to set up a tokenizer for use with TokenTextSplitter
 */

import { TokenTextSplitter } from "@vectorstores/core";
import { getEncoding } from "js-tiktoken";

// Create a tokenizer using js-tiktoken
const encoding = getEncoding("cl100k_base");

// Set up a tokenSizer function
// This function takes text and returns the number of tokens
const tokenSizer = (text: string) => encoding.encode(text).length;

// Now you can use TokenTextSplitter which requires a tokenizer
async function main() {
  const splitter = new TokenTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
    tokenSizer,
  });

  const text =
    "This is a sample text that will be split into chunks based on token count. " +
    "The TokenTextSplitter uses the tokenSizer function we configured in Settings " +
    "to measure the length of text in tokens rather than characters.";

  const chunks = splitter.splitText(text);
  console.log("Number of chunks:", chunks.length);
  console.log("Chunks:", chunks);
}

main().catch(console.error);
