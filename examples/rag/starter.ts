import { Document, VectorStoreIndex } from "@vectorstores/core";
import fs from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  if (!process.env.OPENAI_API_KEY) {
    console.log("OpenAI API key not found in environment variables.");
    console.log(
      "You can get an API key at https://platform.openai.com/account/api-keys",
    );
    process.env.OPENAI_API_KEY = await rl.question(
      "Please enter your OpenAI API key: ",
    );
  }

  const filePath = fileURLToPath(
    new URL("../data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");
  const document = new Document({ text: essay, id_: filePath });

  const index = await VectorStoreIndex.fromDocuments([document]);
  const retriever = index.asRetriever();

  console.log(
    "Try asking a question about the essay stored in examples/data/abramov.txt",
    "\nExample: When did the author graduate from high school?",
    "\n==============================\n",
  );
  while (true) {
    const query = await rl.question("Query: ");
    const response = await retriever.retrieve({
      query,
    });
    console.log(JSON.stringify(response));
  }
}

main().catch(console.error);
