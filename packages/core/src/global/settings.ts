import { AsyncLocalStorage, getEnv } from "@llamaindex/env";
import type { Tokenizer } from "@llamaindex/env/tokenizers";
import type { BaseEmbedding } from "../embeddings";
import type { LLM } from "../llms";
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
  getEmbeddedModel,
  setEmbeddedModel,
  withEmbeddedModel,
} from "./settings/embedModel";
import { getLLM, setLLM, withLLM } from "./settings/llm";
import {
  getTokenizer,
  setTokenizer,
  withTokenizer,
} from "./settings/tokenizer";

let _nodeParser: NodeParser | null = null;
let _chunkOverlap: number;
const _nodeParserAsyncLocalStorage = new AsyncLocalStorage<NodeParser>();
const _chunkOverlapAsyncLocalStorage = new AsyncLocalStorage<number>();

export const Settings = {
  get llm() {
    return getLLM();
  },
  set llm(llm) {
    setLLM(llm);
  },
  withLLM<Result>(llm: LLM, fn: () => Result): Result {
    return withLLM(llm, fn);
  },
  get embedModel() {
    return getEmbeddedModel();
  },
  set embedModel(embedModel) {
    setEmbeddedModel(embedModel);
  },
  withEmbedModel<Result>(embedModel: BaseEmbedding, fn: () => Result): Result {
    return withEmbeddedModel(embedModel, fn);
  },
  get tokenizer() {
    return getTokenizer();
  },
  set tokenizer(tokenizer) {
    setTokenizer(tokenizer);
  },
  withTokenizer<Result>(tokenizer: Tokenizer, fn: () => Result): Result {
    return withTokenizer(tokenizer, fn);
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

    return _nodeParserAsyncLocalStorage.getStore() ?? this.nodeParser;
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
