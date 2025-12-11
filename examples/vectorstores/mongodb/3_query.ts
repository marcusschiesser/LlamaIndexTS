import { VectorStoreIndex } from "@vectorstores/core";
import { MongoDBAtlasVectorSearch } from "@vectorstores/mongodb";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { formatRetrieverResponse } from "../../shared/utils/format-response";

// Load environment variables from local .env file
dotenv.config();

async function query() {
  const client = new MongoClient(process.env.MONGODB_URI!);

  const store = new MongoDBAtlasVectorSearch({
    mongodbClient: client,
    dbName: process.env.MONGODB_DATABASE!,
    collectionName: process.env.MONGODB_VECTORS!,
    indexName: process.env.MONGODB_VECTOR_INDEX!,
    indexedMetadataFields: ["content_type"],
  });

  const index = await VectorStoreIndex.fromVectorStore(store);

  const retriever = index.asRetriever({
    similarityTopK: 20,
    filters: {
      filters: [
        {
          key: "content_type",
          value: "story", // try "tweet" or "post" to see the difference
          operator: "==",
        },
      ],
    },
  });
  const result = await retriever.retrieve({
    query: "What does author receive when he was 11 years old?", // Isaac Asimov's "Foundation" for Christmas
  });
  console.log(formatRetrieverResponse(result));
  await client.close();
}

void query();
