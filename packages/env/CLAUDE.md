# @vectorstores/env Package

This package provides environment-specific compatibility layers for different JavaScript runtimes. It's a critical component that enables vectorstores to work across Node.js, Deno, Bun, browser, Vercel Edge Runtime, and Cloudflare Workers.

## Package Overview

**Purpose**: Environment wrapper that provides unified APIs across all supported JavaScript runtimes
**Main exports**:

- `.` - Main environment APIs (fs, crypto, path, AsyncLocalStorage, etc.)

## Development Commands

**Build and test this package:**

- `pnpm build` - Build the package using bunchee
- `pnpm dev` - Build in watch mode
- `pnpm test` - Run tests with vitest

**From workspace root:**

- `turbo run build --filter="@vectorstores/env"` - Build this specific package
- `turbo run test --filter="@vectorstores/env"` - Test this specific package

## Runtime Support

The package uses conditional exports to provide runtime-specific implementations:

### Node.js Environment (`index.ts`)

- Full Node.js built-in modules (fs, crypto, streams, etc.)
- AsyncLocalStorage for context management
- Native filesystem operations
- Crypto utilities (createHash, randomUUID)

### Browser Environment (`index.browser.ts`)

- Web polyfills for browser compatibility
- Limited to browser-safe APIs
- Web-compatible base64 utilities

### Cloudflare Workers (`index.workerd.ts`)

- Minimal polyfills for Workers environment
- Environment variable access via `INTERNAL_ENV`
- No filesystem access

### Vercel Edge Runtime (`index.edge-light.ts`)

- Edge-compatible polyfills
- Non-Node.js AsyncLocalStorage implementation

## Key Components

### Async Local Storage (`src/als/`)

- `index.node.ts` - Native Node.js AsyncLocalStorage
- `index.non-node.ts` - Polyfill for non-Node environments
- `index.web.ts` - Web-compatible implementation
- `index.workerd.ts` - Cloudflare Workers implementation

### File System (`src/fs/`)

- `node.ts` - Node.js fs module wrapper
- `memory.ts` - In-memory filesystem for testing
- `memfs/` - Memory filesystem implementation

### Utilities (`src/utils/`)

- `base64.ts` - Base64 encoding/decoding utilities
- `shared.ts` - Shared utility classes
- `index.ts` - Environment detection and configuration

## Tokenizers and Transformers (Removed)

The `./tokenizers` and `./multi-model` sub-packages have been removed from this package.

**For tokenization**, install `js-tiktoken` or `gpt-tokenizer` directly and use `Settings.tokenSizer`:

```typescript
import { getEncoding } from "js-tiktoken";
import { Settings } from "@vectorstores/core";

const encoding = getEncoding("cl100k_base");
Settings.tokenSizer = (text) => encoding.encode(text).length;
```

**For embeddings**, use `Settings.embedFunc` or install embedding packages like `@vectorstores/huggingface` or `@vectorstores/clip`.

## Architecture Patterns

### Conditional Exports

The package.json uses conditional exports to map different entry points based on runtime:

```json
"exports": {
  ".": {
    "node": "./dist/index.js",
    "workerd": "./dist/index.workerd.js",
    "edge-light": "./dist/index.edge-light.js",
    "browser": "./dist/index.browser.js"
  }
}
```

### Polyfill Strategy

- Each runtime gets only the APIs it can support
- Graceful degradation for missing functionality
- Common interface across all environments

### Dependency Management

- Core dependencies: `pathe`, `@aws-crypto/sha256-js`
- Runtime detection determines which implementations to use

## Testing

- Tests in `tests/` directory use Vitest
- `memfs.test.ts` - Memory filesystem tests
- Always run `pnpm build` before testing as tests depend on build artifacts

## Usage Notes

- This package is typically imported by other vectorstores packages, not directly by users
- Provides the runtime abstraction layer that makes vectorstores framework runtime-agnostic
- When adding new environment-specific functionality, ensure all supported runtimes have appropriate implementations or polyfills
- Use environment detection utilities to handle runtime differences gracefully
