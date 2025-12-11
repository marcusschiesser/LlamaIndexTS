import { openai } from "@ai-sdk/openai";
import { Document, MetadataMode, VectorStoreIndex } from "@vectorstores/core";
import { stepCountIs, streamText, type Tool, tool } from "ai";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import { useOpenAIEmbedding } from "../shared/utils/embedding";

async function main() {
  useOpenAIEmbedding();

  const filePath = fileURLToPath(
    new URL("../shared/data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");
  const document = new Document({ text: essay, id_: filePath });

  const index = await VectorStoreIndex.fromDocuments([document]);
  console.log("Successfully created index");

  const result = streamText({
    model: openai("gpt-4o"),
    prompt: "Cost of moving cat from Russia to UK?",
    tools: {
      queryTool: vectorstores({
        index,
        description:
          "get information from your knowledge base to answer questions.", // optional description
      }),
    },
    stopWhen: stepCountIs(5),
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
}

main().catch(console.error);

function vectorstores({
  index,
  description,
}: {
  index: VectorStoreIndex;
  description?: string;
}): Tool {
  const retriever = index.asRetriever();
  return tool({
    description: description ?? "Get information about your documents.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("The query to get information about your documents."),
    }),
    execute: async ({ query }) => {
      const result = await retriever.retrieve({ query });
      const nodeContent = result.map((result) =>
        result.node.getContent(MetadataMode.LLM),
      );
      return nodeContent.length !== 0
        ? nodeContent.join("\n")
        : "No result found in documents";
    },
  });
}
