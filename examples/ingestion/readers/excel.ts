import { ExcelReader } from "@vectorstores/excel";
import { fileURLToPath } from "node:url";

async function main() {
  // Load PDF
  const reader = new ExcelReader({
    sheetSpecifier: 0,
    concatRows: true,
    fieldSeparator: ",",
    keyValueSeparator: ":",
  });

  const filePath = fileURLToPath(
    new URL("../../shared/data/sample_excel_sheet.xls", import.meta.url),
  );
  const documents = await reader.loadData(filePath);

  for (const doc of documents) {
    console.log(doc.text);
    console.log("----");
  }
}

main().catch(console.error);
