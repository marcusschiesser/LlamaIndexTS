import type { BaseNode } from "../../schema/index.js";
import type { BaseDocumentStore } from "../../storage/doc-store/base-document-store.js";
import type { BaseVectorStore } from "../../vector-store/index.js";
import { classify } from "./classify.js";
import { RollbackableTransformComponent } from "./rollback.js";

/**
 * Handles doc store upserts by checking hashes and ids.
 */
export class UpsertsStrategy extends RollbackableTransformComponent {
  protected docStore: BaseDocumentStore;
  protected vectorStores: BaseVectorStore[] | undefined;

  constructor(docStore: BaseDocumentStore, vectorStores?: BaseVectorStore[]) {
    super(async (nodes: BaseNode[]): Promise<BaseNode[]> => {
      const { dedupedNodes, unusedDocs } = await classify(this.docStore, nodes);
      // remove unused docs
      for (const refDocId of unusedDocs) {
        await this.docStore.deleteRefDoc(refDocId, false);
        if (this.vectorStores) {
          for (const vectorStore of this.vectorStores) {
            await vectorStore.delete(refDocId);
          }
        }
      }
      // add non-duplicate docs
      await this.docStore.addDocuments(dedupedNodes, true);
      return dedupedNodes;
    });
    this.docStore = docStore;
    this.vectorStores = vectorStores;
  }
}
