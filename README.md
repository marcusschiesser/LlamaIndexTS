<h1 align="center">vectorstores</h1>
<h3 align="center">
  Vector database framework for your AI application.
</h3>

Vectorstores provides a unified interface for connecting a vector data base to your AI application. It supports ingestion of data from various sources, and retrieval of data from the vector database.

It's a based on a fork of [LLamaIndexTS](https://github.com/run-llama/LlamaIndexTS), so you can use it as a drop-in replacement for LLamaIndexTS in your existing projects. Compared to LLamaIndexTS, vectorstores is more lightweight as it just focuses on vector databases and provides a unified interface for working with them.

## Compatibility

### Multiple JS Environment Support

vectorstores supports multiple JS environments, including:

- Node.js >= 20 ✅
- Deno ✅
- Bun ✅
- Nitro ✅
- Vercel Edge Runtime ✅ (with some limitations)
- Cloudflare Workers ✅ (with some limitations)

## Getting started

```shell
npm install @vectorstores/core
pnpm install @vectorstores/core
yarn add @vectorstores/core
```

### Setup in Node.js, Deno, Bun, TypeScript...?

See the documentation and examples in this repository.

### Adding provider packages

In most cases, you'll also need to install provider packages to use vectorstores. These are for adding file readers for ingestion or for storing documents in vector databases.

For example, to use the Weaviate vector database, you would install the following package:

```shell
npm install @vectorstores/weaviate
pnpm install @vectorstores/weaviate
yarn add @vectorstores/weaviate
```

## Contributing

Please see our [contributing guide](CONTRIBUTING.md) for more information.
