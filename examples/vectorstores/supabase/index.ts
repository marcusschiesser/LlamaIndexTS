import {
  Document,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import { SupabaseVectorStore } from "@vectorstores/supabase";

import { useOpenAIEmbedding } from "../../shared/utils/embedding";

async function main() {
  useOpenAIEmbedding();
  // Create sample documents
  const documents = [
    new Document({
      text: "Supbase is a powerful Database engine",
      metadata: {
        source: "tech_docs",
        author: "John Doe",
      },
    }),
    new Document({
      text: "Vector search enables semantic similarity search",
      metadata: {
        source: "research_paper",
        author: "Jane Smith",
      },
    }),
    new Document({
      text: "Supbase vector store supports various distance metrics for vector search",
      metadata: {
        source: "tech_docs",
        author: "Bob Wilson",
      },
    }),
  ];

  // Initialize Supabase Vector Store
  const vectorStore = new SupabaseVectorStore({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    table: "document",
  });

  // await vectorStore.delete("fc079c38-2af4-4782-96e4-955c28608fcf");

  // Create storage context with the vector store
  const storageContext = await storageContextFromDefaults({
    vectorStore,
  });

  // Create and store embeddings in Supabase
  const index = await VectorStoreIndex.fromDocuments(documents, {
    storageContext,
  });

  // Retrieve from the index
  const retriever = index.asRetriever();

  // Simple retrieval
  const response = await retriever.retrieve({
    query: "What is vector search?",
  });
  console.log("Basic Retrieval Response:", JSON.stringify(response));
}

main().catch(console.error);
