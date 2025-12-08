# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Next.js Node Runtime example package.

## Package Overview

The `@vectorstores/next-node-runtime-test` package is an end-to-end test example that demonstrates vectorstores integration with Next.js running on the Node.js runtime. This example validates that vectorstores packages work correctly in a Next.js App Router environment with server-side rendering and server actions.

## Development Commands

From this directory:

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the Next.js application
- `npm run start` - Start production server

From the e2e root directory:

- `pnpm e2e` - Run all e2e tests including this example

## Application Structure

### Configuration Files

- `next.config.mjs` - Next.js configuration with vectorstores integration using `withVectorstores()`
- `tsconfig.json` - TypeScript configuration for Next.js with App Router
- `package.json` - Dependencies including `@vectorstores/core`, `@vectorstores/huggingface`, and `@vectorstores/readers`

### Source Structure

**App Router Pages:**

- `src/app/page.tsx` - Home page that demonstrates tokenizer usage with `runtime = "nodejs"`
- `src/app/layout.tsx` - Root layout component with Inter font

**API Routes:**

- `src/app/api/openai/route.ts` - POST endpoint that calls OpenAI server action

**Server Actions:**

- `src/actions/openai.ts` - Server action demonstrating full vectorstores workflow with OpenAI agent

**Utilities:**

- `src/utils/tokenizer.ts` - Runtime validation and tokenization example

## Key Features Demonstrated

### 1. Runtime Validation (`src/utils/tokenizer.ts`)

Tests that the application runs in Node.js runtime (not Edge):

```typescript
// @ts-expect-error EdgeRuntime is not defined in type
if (typeof EdgeRuntime === "string") {
  throw new Error("Expected to not run in EdgeRuntime");
}
```

Uses js-tiktoken for tokenization:

```typescript
import { getEncoding } from "js-tiktoken";

const encoding = getEncoding("cl100k_base");
```

### 2. OpenAI Agent Integration (`src/actions/openai.ts`)

Demonstrates a complete vectorstores workflow:

- **LLM Configuration**: OpenAI GPT-4o with API key management
- **Embedding Model**: HuggingFace BAAI/bge-small-en-v1.5 embeddings
- **Document Loading**: SimpleDirectoryReader for local file processing
- **Vector Index**: VectorStoreIndex creation from documents
- **Tool Integration**: Query engine as a tool for the agent
- **Agent Creation**: OpenAIAgent with tools for conversational AI
- **Callback Handling**: Event listeners for tool calls and results

### 3. Next.js Integration

- **Server Actions**: "use server" directive for server-side vectorstores operations
- **API Routes**: RESTful endpoint for external integration
- **App Router**: Modern Next.js routing with TypeScript support
- **vectorstores Plugin**: `withVectorstores()` wrapper for proper bundling

## Dependencies

**Core vectorstores:**

- `@vectorstores/core` - Main vectorstores package
- `@vectorstores/huggingface` - HuggingFace embedding models
- `@vectorstores/readers` - Document readers including SimpleDirectoryReader

**Next.js Stack:**

- `next@^15.3.0` - Next.js framework
- `react@19.0.0` & `react-dom@19.0.0` - React runtime
- `typescript@^5.7.3` - TypeScript support

## Testing Purpose

This example serves as an integration test for:

1. **Node.js Runtime Compatibility**: Ensures vectorstores works in Next.js Node.js runtime
2. **Server Actions**: Validates server-side vectorstores operations
3. **Document Processing**: Tests file reading and vector indexing
4. **Agent Workflows**: Validates OpenAI agent with tool integration
5. **Bundling**: Ensures proper webpack bundling with `withVectorstores()`
6. **API Integration**: Tests REST API endpoints with vectorstores backend

## Environment Variables

- `NEXT_PUBLIC_OPENAI_KEY` - OpenAI API key (falls back to "FAKE_KEY_TO_PASS_TESTS" for testing)

## Development Notes

- **Runtime Enforcement**: Explicitly sets `runtime = "nodejs"` in page components
- **Error Handling**: Comprehensive try-catch in server actions
- **Callback Management**: Event listeners for debugging tool interactions
- **Testing Compatibility**: Fake API key fallback for automated testing
- **Bundle Optimization**: Uses `withVectorstores()` for proper webpack configuration
- **Type Safety**: Full TypeScript support with Next.js type definitions

## Common Workflows

1. **Local Development**: `npm run dev` to start development server with hot reload
2. **Production Testing**: `npm run build && npm run start` to test production build
3. **Integration Testing**: Run from e2e root with `pnpm e2e` for automated validation
4. **Agent Testing**: POST to `/api/openai` endpoint with query payload for agent responses
