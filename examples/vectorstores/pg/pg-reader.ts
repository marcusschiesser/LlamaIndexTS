import { Document } from "@vectorstores/core";
import { PGVectorStore, SimplePostgresReader } from "@vectorstores/postgres";

import { useOpenAIEmbedding } from "../../utils/embedding";

const containerName = "vectorstores-postgres-example";
const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "test",
  user: "postgres",
  password: "postgres",
};
useOpenAIEmbedding();
async function main() {
  try {
    // Initialize PGVectorStore and add a document
    // This is just to generate test data in the DB for the SimplePostgresReader
    // Usually it's purpose is to read documents from a Postgres DB
    const vectorStore = new PGVectorStore({
      clientConfig: dbConfig,
      dimensions: 3,
      tableName: "vectorstores_vector",
    });

    // Add a test document with embedding
    await vectorStore.add([
      new Document({
        text: "This is a test document about AI technology.",
        metadata: {
          author: "Test Author",
          category: "technology",
        },
        embedding: [1, 2, 3],
      }),
    ]);
    console.log("Added document to vector store");
    // Initialize PostgresReader to read the document
    const reader = new SimplePostgresReader({ clientConfig: dbConfig });

    // Read documents using PostgresReader
    const documents = await reader.loadData({
      query: "SELECT document as content, metadata FROM vectorstores_vector",
      fields: ["content"],
      metadataFields: ["metadata"],
    });

    console.log("Read documents:");
    console.log(JSON.stringify(documents, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
