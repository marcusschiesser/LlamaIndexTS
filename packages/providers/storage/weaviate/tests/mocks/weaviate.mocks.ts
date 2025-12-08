import { Settings } from "@llamaindex/core";
import { vi } from "vitest";

// Mock embedding function
export const mockEmbedFunc = vi.fn(async (texts: string[]) => {
  // Return one embedding vector per input text
  return texts.map(() => [0.1, 0.2, 0.3]);
});

// Mock weaviate collection
export const mockCollection = {
  data: {
    insertMany: vi.fn(),
  },
  config: {
    get: vi.fn(() => Promise.resolve({ properties: [] })),
  },
};

// Mock weaviate client
export const mockClient = {
  collections: {
    exists: vi.fn(() => Promise.resolve(true)),
    get: vi.fn(() => mockCollection),
    createFromSchema: vi.fn(() => Promise.resolve(mockCollection)),
  },
};

// Setup embedding function for tests
export const setupMockEmbedding = () => {
  Settings.embedFunc = mockEmbedFunc;
};
