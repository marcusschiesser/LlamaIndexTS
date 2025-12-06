import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { SentenceSplitter } from "llamaindex";

async function main() {
  const filePath = fileURLToPath(
    new URL("../data/abramov.txt", import.meta.url),
  );
  const essay = await fs.readFile(filePath, "utf-8");

  const textSplitter = new SentenceSplitter();

  const chunks = textSplitter.splitText(essay);

  console.log(chunks);
}

void main();
