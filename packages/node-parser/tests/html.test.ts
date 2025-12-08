import { describe, expect, test } from "vitest";
// Note: Settings import must come first to ensure correct module initialization order
import "@vectorstores/core";
import { Document } from "@vectorstores/core";
import { HTMLNodeParser } from "@vectorstores/node-parser/html";

describe("HTMLNodeParser", () => {
  test("basic split", async () => {
    const parser = new HTMLNodeParser();
    const result = parser.getNodesFromDocuments([
      new Document({
        text: `<DOCTYPE html>
<html>
	<head>
		<title>Test</title>
	</head>
	<body>
		<p>Hello World</p>
	</body>
</html>`,
      }),
    ]);
    expect(result.length).toEqual(1);
    expect(result[0]!.getContent()).toEqual("Hello World");
  });
});
