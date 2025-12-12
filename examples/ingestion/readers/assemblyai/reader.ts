import {
  AudioTranscriptReader,
  type TranscribeParams,
} from "@vectorstores/assemblyai";
import { VectorStoreIndex } from "@vectorstores/core";
import { program } from "commander";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

import { useOpenAIEmbedding } from "../../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../../shared/utils/format-response";
import { ensureOpenAIKey, isInteractive } from "../../../shared/utils/runtime";

program
  .option("-a, --audio [string]", "URL or path of the audio file to transcribe")
  .option("-i, --transcript-id [string]", "ID of the AssemblyAI transcript")
  .action(async (options) => {
    if (!isInteractive()) {
      console.log(
        "This example is interactive. Run it in a TTY:\n" +
          "npx tsx ./ingestion/readers/assemblyai/reader.ts --audio <path-or-url>",
      );
      return;
    }

    if (!process.env.ASSEMBLYAI_API_KEY) {
      console.log("No ASSEMBLYAI_API_KEY found in environment variables.");
      return;
    }

    if (!ensureOpenAIKey()) return;
    useOpenAIEmbedding();

    const reader = new AudioTranscriptReader();
    let params: TranscribeParams | string;
    if (options.audio) {
      params = {
        audio: options.audio,
      };
    } else if (options.transcriptId) {
      params = options.transcriptId;
    } else {
      console.log("You must provide either an --audio or a --transcript-id");
      return;
    }

    const documents = await reader.loadData(params);
    console.log(documents);

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments(documents);

    // Create retriever
    const retriever = index.asRetriever();

    const rl = createInterface({ input, output });
    while (true) {
      const query = await rl.question("Ask a question: ");

      if (!query) {
        break;
      }

      const response = await retriever.retrieve({ query });

      console.log(formatRetrieverResponse(response));
    }
  });

program.parse();
