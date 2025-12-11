import { Settings, TextEmbedFunc } from "@vectorstores/core";
import { OpenAI } from "openai";

const openai = new OpenAI();

/**
 * Configure Settings.embedFunc to use OpenAI embeddings.
 * @param model - The OpenAI embedding model to use (default: "text-embedding-3-small")
 */
export function useOpenAIEmbedding(
  model: string = "text-embedding-3-small",
): void {
  Settings.embedFunc = getOpenAIEmbedding(model);
}

export function getOpenAIEmbedding(
  model: string = "text-embedding-3-small",
): TextEmbedFunc {
  return async (input) => {
    const { data } = await openai.embeddings.create({
      model,
      input,
    });
    return data.map((d) => d.embedding);
  };
}
