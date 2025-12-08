import {
  Document,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import { GEMINI_EMBEDDING_MODEL, GeminiEmbedding } from "@vectorstores/google";
import { QdrantVectorStore } from "@vectorstores/qdrant";

const embedding = new GeminiEmbedding({
  model: GEMINI_EMBEDDING_MODEL.EMBEDDING_001,
});

async function main() {
  const docs = [new Document({ text: "Lorem ipsum dolor sit amet" })];
  const vectorStore = new QdrantVectorStore({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    embedModel: embedding,
    collectionName: "gemini_test",
  });
  const storageContext = await storageContextFromDefaults({ vectorStore });
  await VectorStoreIndex.fromDocuments(docs, { storageContext });
  console.log("Inizialized vector store successfully");
}

void main().catch((err) => console.error(err));
