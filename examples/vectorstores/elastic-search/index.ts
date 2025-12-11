import {
  Document,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "@vectorstores/core";
import { ElasticSearchVectorStore } from "@vectorstores/elastic-search";

import { useOpenAIEmbedding } from "../../shared/utils/embedding";
import { formatRetrieverResponse } from "../../shared/utils/format-response";

useOpenAIEmbedding();

async function main() {
  // Create sample documents
  const documents = [
    new Document({
      text: "Elastic search is a powerful search engine",
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
      text: "Elasticsearch supports various distance metrics for vector search",
      metadata: {
        source: "tech_docs",
        author: "Bob Wilson",
      },
    }),
  ];

  // Initialize ElasticSearch Vector Store
  const vectorStore = new ElasticSearchVectorStore({
    indexName: "vectorstores-demo",
    esCloudId: process.env.ES_CLOUD_ID,
    esApiKey: process.env.ES_API_KEY,
  });

  // Create storage context with the vector store
  const storageContext = await storageContextFromDefaults({
    vectorStore,
  });

  // Create and store embeddings in ElasticSearch
  const index = await VectorStoreIndex.fromDocuments(documents, {
    storageContext,
  });

  // Retrieve from the index
  const retriever = index.asRetriever();

  // Simple retrieval
  const response = await retriever.retrieve({
    query: "What is vector search?",
  });
  console.log("Basic Retrieval Response:");
  console.log(formatRetrieverResponse(response));
}

main().catch(console.error);
