// test runtime
import "@vectorstores/core";
import { getEncoding } from "js-tiktoken";

// @ts-expect-error EdgeRuntime is not defined in type
if (typeof EdgeRuntime === "string") {
  throw new Error("Expected to not run in EdgeRuntime");
}

// Create tokenizer from js-tiktoken
const encoding = getEncoding("cl100k_base");

export async function tokenize(str: string): Promise<string> {
  const encoded = encoding.encode(str);
  const text = encoding.decode(encoded);
  const uint8Array = new TextEncoder().encode(text);
  return new TextDecoder().decode(uint8Array);
}
