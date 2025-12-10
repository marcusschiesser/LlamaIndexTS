<h1 align="center">vectorstores</h1>
<h3 align="center">
  Data framework for your LLM application.
</h3>

Use your own data with large language models (LLMs, OpenAI ChatGPT and others) in JS runtime environments with TypeScript support.

## What is vectorstores?

vectorstores aims to be a lightweight, easy to use set of libraries to help you integrate large language models into your applications with your own data.

## Compatibility

### Multiple JS Environment Support

vectorstores supports multiple JS environments, including:

- Node.js >= 20 ✅
- Deno ✅
- Bun ✅
- Nitro ✅
- Vercel Edge Runtime ✅ (with some limitations)
- Cloudflare Workers ✅ (with some limitations)

For now, browser support is limited due to the lack of support for [AsyncLocalStorage-like APIs](https://github.com/tc39/proposal-async-context)

### Supported LLMs:

- OpenAI LLms
- Anthropic LLms
- Groq LLMs
- Llama2, Llama3, Llama3.1 LLMs
- MistralAI LLMs
- Fireworks LLMs
- DeepSeek LLMs
- ReplicateAI LLMs
- TogetherAI LLMs
- HuggingFace LLms
- DeepInfra LLMs
- Gemini LLMs

## Getting started

```shell
npm install @vectorstores/core
pnpm install @vectorstores/core
yarn add @vectorstores/core
```

### Setup in Node.js, Deno, Bun, TypeScript...?

See the documentation and examples in this repository.

### Adding provider packages

In most cases, you'll also need to install provider packages to use vectorstores. These are for adding AI models, file readers for ingestion or storing documents, e.g. in vector databases.

For example, to use the OpenAI LLM, you would install the following package:

```shell
npm install @vectorstores/openai
pnpm install @vectorstores/openai
yarn add @vectorstores/openai
```

## Contributing

Please see our [contributing guide](CONTRIBUTING.md) for more information.
