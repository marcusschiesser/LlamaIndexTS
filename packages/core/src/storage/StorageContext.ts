import { DEFAULT_NAMESPACE, Settings } from "../global/index.js";
import { ModalityType, ObjectType } from "../schema/index.js";
import type {
  BaseVectorStore,
  VectorStoreByType,
} from "../vector-store/index.js";
import { SimpleVectorStore } from "../vector-store/SimpleVectorStore.js";
import type { BaseDocumentStore } from "./doc-store/index.js";
import { SimpleDocumentStore } from "./doc-store/SimpleDocumentStore.js";
import { type BaseIndexStore, SimpleIndexStore } from "./index-store/index.js";

export interface StorageContext {
  docStore: BaseDocumentStore;
  indexStore: BaseIndexStore;
  vectorStores: VectorStoreByType;
}

type BuilderParams = {
  docStore: BaseDocumentStore;
  indexStore: BaseIndexStore;
  vectorStore: BaseVectorStore;
  vectorStores: VectorStoreByType;
  persistDir: string;
};

export async function storageContextFromDefaults({
  docStore,
  indexStore,
  vectorStore,
  vectorStores,
  persistDir,
}: Partial<BuilderParams>): Promise<StorageContext> {
  vectorStores = vectorStores ?? {};
  if (!persistDir) {
    docStore = docStore ?? new SimpleDocumentStore();
    indexStore = indexStore ?? new SimpleIndexStore();
    if (!(ModalityType.TEXT in vectorStores)) {
      vectorStores[ModalityType.TEXT] = vectorStore ?? new SimpleVectorStore();
    }
  } else {
    const embedModel = Settings.embedModel;
    docStore =
      docStore ||
      (await SimpleDocumentStore.fromPersistDir(persistDir, DEFAULT_NAMESPACE));
    indexStore =
      indexStore || (await SimpleIndexStore.fromPersistDir(persistDir));
    if (!(ObjectType.TEXT in vectorStores)) {
      vectorStores[ModalityType.TEXT] =
        vectorStore ??
        (await SimpleVectorStore.fromPersistDir(persistDir, embedModel));
    }
  }

  return {
    docStore,
    indexStore,
    vectorStores,
  };
}
