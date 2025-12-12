import { XMLReader } from "@vectorstores/readers/xml";
import { fileURLToPath } from "node:url";

async function main() {
  // Load PDF
  const reader = new XMLReader({
    splitLevel: 2,
  });
  const filePath = fileURLToPath(
    new URL("../../shared/data/company.xml", import.meta.url),
  );
  const documents = await reader.loadData(filePath);

  for (const doc of documents) {
    console.log(doc.text);
    console.log("----");
  }
}

main().catch(console.error);
