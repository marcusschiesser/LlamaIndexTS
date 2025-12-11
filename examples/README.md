# vectorstores Examples

This package contains several examples of how to use vectorstores.

Most examples will use OpenAI by default, so be sure to set your API key.

## Installation

```shell
npm install
```

## Running Examples

```shell
# export your API key
export OPENAI_API_KEY="sk-..."

# Run a basic ingestion example
npx tsx ./ingestion/llamaindex.ts

# Or try the interactive retrieval example
npx tsx ./retrieval/starter.ts
```

## Recommended Starter Examples

### Ingestion & Indexing:

- [Basic Vector Indexing](./ingestion/llamaindex.ts) - Create a vector index from documents and retrieve
- [Ingestion Pipeline](./ingestion/pipeline.ts) - Use IngestionPipeline for custom transformations
- [Vercel Vector Store](./vercel/vector-store.ts) - Vector store integration with Vercel AI SDK

### Retrieval:

- [Basic Retrieval](./retrieval/starter.ts) - Interactive retrieval example
- [Text Splitting](./retrieval/split.ts) - How to split text into chunks
- [Sentence Window Retrieval](./retrieval/sentenceWindow.ts) - Advanced retrieval with sentence windows
- [Markdown Node Parser](./retrieval/nodeParser/MarkdownNodeParser.ts) - Parse markdown documents
- [Cohere Reranker](./retrieval/rerankers/CohereReranker.ts) - Improve retrieval with reranking

### Multimodal:

- [Multimodal Load](./retrieval/multimodal/load.ts) - Load multimodal documents
- [Multimodal Retrieve](./retrieval/multimodal/retrieve.ts) - Retrieve images and text
- [Multimodal Storage](./retrieval/multimodal/storage.ts) - Set up storage for multimodal data

### Vector Stores:

- [vectorstores](./vectorstores/): Examples with various vector stores (AstraDB, ChromaDB, MongoDB, Pinecone, Qdrant, Weaviate, and more)
- [readers](./ingestion/readers/): Examples of how to use the various readers (CSV, PDF, Markdown, Notion, Discord, and more)

## Contributing

If you're contributing to vectorstores and want to make the examples work in the monorepo:

```shell
# From the repository root
pnpm install
pnpm build

# Switch examples to use workspace packages
cd examples
pnpm run use-workspace
pnpm install

# When done, switch back to npm versions before committing
pnpm run use-npm
```
