import { Settings } from "../global/settings.js";
import { runTransformations } from "../ingestion/IngestionPipeline.js";
import { SentenceSplitter } from "../node-parser/index.js";
import type { BaseRetriever } from "../retriever/index.js";
import type { BaseNode, Document } from "../schema/node.js";
import type { BaseDocumentStore } from "../storage/doc-store/base-document-store.js";
import type { BaseIndexStore } from "../storage/index-store/index.js";
import type { StorageContext } from "../storage/StorageContext.js";

export interface BaseIndexInit<T> {
  storageContext: StorageContext;
  docStore: BaseDocumentStore;
  indexStore?: BaseIndexStore | undefined;
  indexStruct: T;
}

/**
 * Indexes are the data structure that we store our nodes and embeddings in so
 * they can be retrieved for our queries.
 */
export abstract class BaseIndex<T> {
  storageContext: StorageContext;
  docStore: BaseDocumentStore;
  indexStore?: BaseIndexStore | undefined;
  indexStruct: T;

  constructor(init: BaseIndexInit<T>) {
    this.storageContext = init.storageContext;
    this.docStore = init.docStore;
    this.indexStore = init.indexStore;
    this.indexStruct = init.indexStruct;
  }

  /**
   * Create a new retriever from the index.
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract asRetriever(options?: any): BaseRetriever;

  /**
   * Insert a document into the index.
   * @param document
   */
  async insert(document: Document) {
    const nodeParser =
      Settings.nodeParser ??
      new SentenceSplitter({
        chunkSize: Settings.chunkSize,
        chunkOverlap: Settings.chunkOverlap,
      });
    const nodes = await runTransformations([document], [nodeParser]);
    await this.insertNodes(nodes);
    await this.docStore.setDocumentHash(document.id_, document.hash);
  }

  abstract insertNodes(nodes: BaseNode[]): Promise<void>;
  abstract deleteRefDoc(
    refDocId: string,
    deleteFromDocStore?: boolean,
  ): Promise<void>;

  /**
   * Alias for asRetriever
   * @param options
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retriever(options?: any): BaseRetriever {
    return this.asRetriever(options);
  }
}
