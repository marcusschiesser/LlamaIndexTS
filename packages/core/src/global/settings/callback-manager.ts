import { AsyncLocalStorage, CustomEvent } from "@llamaindex/env";
import type { RetrieveEndEvent, RetrieveStartEvent } from "../../retriever";
import type { TextNode } from "../../schema";
import { type EventCaller, getEventCaller } from "./event-caller";

export type ChunkingStartEvent = {
  text: string[];
};

export type ChunkingEndEvent = {
  chunks: string[];
};

export type NodeParsingStartEvent = {
  documents: TextNode[];
};

export type NodeParsingEndEvent = {
  nodes: TextNode[];
};

export interface LlamaIndexEventMaps {
  "chunking-start": ChunkingStartEvent;
  "chunking-end": ChunkingEndEvent;
  "node-parsing-start": NodeParsingStartEvent;
  "node-parsing-end": NodeParsingEndEvent;
  "retrieve-start": RetrieveStartEvent;
  "retrieve-end": RetrieveEndEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LlamaIndexCustomEvent<T = any> extends CustomEvent<T> {
  reason: EventCaller | null = null;
  private constructor(
    event: string,
    options?: CustomEventInit & {
      reason?: EventCaller | null;
    },
  ) {
    super(event, options);
    this.reason = options?.reason ?? null;
  }

  static fromEvent<Type extends keyof LlamaIndexEventMaps>(
    type: Type,
    detail: LlamaIndexEventMaps[Type],
  ) {
    return new LlamaIndexCustomEvent(type, {
      detail: detail,
      reason: getEventCaller(),
    });
  }
}

type EventHandler<Event> = (event: LlamaIndexCustomEvent<Event>) => void;

export class CallbackManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #handlers = new Map<keyof LlamaIndexEventMaps, EventHandler<any>[]>();

  on<K extends keyof LlamaIndexEventMaps>(
    event: K,
    handler: EventHandler<LlamaIndexEventMaps[K]>,
  ) {
    if (!this.#handlers.has(event)) {
      this.#handlers.set(event, []);
    }
    this.#handlers.get(event)!.push(handler);
    return this;
  }

  off<K extends keyof LlamaIndexEventMaps>(
    event: K,
    handler: EventHandler<LlamaIndexEventMaps[K]>,
  ) {
    if (!this.#handlers.has(event)) {
      return this;
    }
    const cbs = this.#handlers.get(event)!;
    const index = cbs.indexOf(handler);
    if (index > -1) {
      cbs.splice(index, 1);
    }
    return this;
  }

  dispatchEvent<K extends keyof LlamaIndexEventMaps>(
    event: K,
    detail: LlamaIndexEventMaps[K],
    sync = false,
  ) {
    const cbs = this.#handlers.get(event);
    if (!cbs) {
      return;
    }
    if (typeof queueMicrotask === "undefined") {
      console.warn(
        "queueMicrotask is not available, dispatching synchronously",
      );
      sync = true;
    }
    if (sync) {
      cbs.forEach((handler) =>
        handler(LlamaIndexCustomEvent.fromEvent(event, { ...detail })),
      );
    } else {
      queueMicrotask(() => {
        cbs.forEach((handler) =>
          handler(LlamaIndexCustomEvent.fromEvent(event, { ...detail })),
        );
      });
    }
  }
}

export const globalCallbackManager = new CallbackManager();

const callbackManagerAsyncLocalStorage =
  new AsyncLocalStorage<CallbackManager>();

let currentCallbackManager: CallbackManager = globalCallbackManager;

export function getCallbackManager(): CallbackManager {
  return callbackManagerAsyncLocalStorage.getStore() ?? currentCallbackManager;
}

export function setCallbackManager(callbackManager: CallbackManager) {
  currentCallbackManager = callbackManager;
}

export function withCallbackManager<Result>(
  callbackManager: CallbackManager,
  fn: () => Result,
): Result {
  return callbackManagerAsyncLocalStorage.run(callbackManager, fn);
}
