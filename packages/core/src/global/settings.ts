import { AsyncLocalStorage, getEnv } from "@llamaindex/env";
import { BaseEmbedding } from "../embeddings";
import type { TextEmbedFunc } from "../embeddings/base";
import { type NodeParser, SentenceSplitter } from "../node-parser";
import {
  type CallbackManager,
  getCallbackManager,
  setCallbackManager,
  withCallbackManager,
} from "./settings/callback-manager";
import {
  getChunkSize,
  setChunkSize,
  withChunkSize,
} from "./settings/chunk-size";
import {
  getTokenSizer,
  setTokenSizer,
  type TokenSizer,
  withTokenSizer,
} from "./settings/tokenizer";

let _nodeParser: NodeParser | null = null;
const _nodeParserAsyncLocalStorage = new AsyncLocalStorage<NodeParser>();
let _chunkOverlap: number;
const _chunkOverlapAsyncLocalStorage = new AsyncLocalStorage<number>();
let _embedFunc: TextEmbedFunc | null = null;
const _embedFuncAsyncLocalStorage = new AsyncLocalStorage<TextEmbedFunc>();

export const Settings = {
  get embedModel() {
    return new BaseEmbedding();
  },
  get tokenSizer() {
    return getTokenSizer();
  },
  set tokenSizer(tokenSizer) {
    setTokenSizer(tokenSizer);
  },
  withTokenSizer<Result>(tokenSizer: TokenSizer, fn: () => Result): Result {
    return withTokenSizer(tokenSizer, fn);
  },
  get chunkSize(): number | undefined {
    return getChunkSize();
  },
  set chunkSize(chunkSize: number | undefined) {
    setChunkSize(chunkSize);
  },
  withChunkSize<Result>(chunkSize: number, fn: () => Result): Result {
    return withChunkSize(chunkSize, fn);
  },

  get callbackManager(): CallbackManager {
    return getCallbackManager();
  },

  set callbackManager(callbackManager: CallbackManager) {
    setCallbackManager(callbackManager);
  },

  withCallbackManager<Result>(
    callbackManager: CallbackManager,
    fn: () => Result,
  ): Result {
    return withCallbackManager(callbackManager, fn);
  },

  get nodeParser(): NodeParser {
    if (_nodeParser === null) {
      _nodeParser = new SentenceSplitter({
        chunkSize: getChunkSize(),
        chunkOverlap: _chunkOverlap,
      });
    }

    return _nodeParserAsyncLocalStorage.getStore() ?? _nodeParser;
  },

  set nodeParser(nodeParser: NodeParser) {
    _nodeParser = nodeParser;
  },

  get chunkOverlap(): number | undefined {
    return _chunkOverlapAsyncLocalStorage.getStore() ?? _chunkOverlap;
  },

  set chunkOverlap(chunkOverlap: number | undefined) {
    if (typeof chunkOverlap === "number") {
      _chunkOverlap = chunkOverlap;
    }
  },

  withChunkOverlap<Result>(chunkOverlap: number, fn: () => Result): Result {
    return _chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
  },

  get embedFunc(): TextEmbedFunc | null {
    return _embedFuncAsyncLocalStorage.getStore() ?? _embedFunc;
  },

  set embedFunc(embedFunc: TextEmbedFunc) {
    _embedFunc = embedFunc;
  },

  withEmbedFunc<Result>(embedFunc: TextEmbedFunc, fn: () => Result): Result {
    return _embedFuncAsyncLocalStorage.run(embedFunc, fn);
  },

  get debug() {
    let debug = getEnv("DEBUG");
    if (typeof window !== "undefined") {
      debug ||= window.localStorage.debug;
    }
    return (
      (Boolean(debug) && debug?.includes("llamaindex")) ||
      debug === "*" ||
      debug === "true"
    );
  },
};
