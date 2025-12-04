import { Settings } from "../global";
import type { MessageContentDetail } from "../llms";
import { type BaseNode, MetadataMode, TransformComponent } from "../schema";
import { extractSingleText } from "../utils";
import { SimilarityType, similarity } from "./utils.js";

// move to settings
const DEFAULT_EMBED_BATCH_SIZE = 10;
type EmbedFunc<T> = (values: T[]) => Promise<Array<number[]>>;
export type TextEmbedFunc = EmbedFunc<string>;

export class BaseEmbedding extends TransformComponent<Promise<BaseNode[]>> {
  embedBatchSize = DEFAULT_EMBED_BATCH_SIZE;

  public constructor(transformFn?: (nodes: BaseNode[]) => Promise<BaseNode[]>) {
    if (transformFn) {
      super(transformFn);
    } else {
      super(async (nodes: BaseNode[]): Promise<BaseNode[]> => {
        const texts = nodes.map((node) => node.getContent(MetadataMode.EMBED));

        const embeddings = await this.getTextEmbeddingsBatch(texts);

        for (let i = 0; i < nodes.length; i++) {
          nodes[i]!.embedding = embeddings[i];
        }

        return nodes;
      });
    }
  }

  similarity(
    embedding1: number[],
    embedding2: number[],
    mode: SimilarityType = SimilarityType.DEFAULT,
  ): number {
    return similarity(embedding1, embedding2, mode);
  }

  async getTextEmbedding(text: string): Promise<number[]> {
    const embeddings = await this.getTextEmbeddings([text]);
    if (!embeddings[0]) {
      throw new Error("No embedding returned by embeddings function");
    }
    return embeddings[0];
  }

  async getQueryEmbedding(
    query: MessageContentDetail,
  ): Promise<number[] | null> {
    const text = extractSingleText(query);
    if (text) {
      return await this.getTextEmbedding(text);
    }
    return null;
  }

  /**
   * @param texts
   */
  getTextEmbeddings = async (texts: string[]): Promise<Array<number[]>> => {
    if (!Settings.embedFunc) {
      throw new Error(
        "Can't run embeddings without specifying an embed functions using Settings.embedFunc",
      );
    }
    return await Settings.embedFunc(texts);
  };

  /**
   * Get embeddings for a batch of texts
   * @param texts
   * @param options
   */
  async getTextEmbeddingsBatch(texts: string[]): Promise<Array<number[]>> {
    return await batchEmbeddings(
      texts,
      this.getTextEmbeddings,
      this.embedBatchSize,
    );
  }
}

export async function batchEmbeddings<T>(
  values: T[],
  embedFunc: EmbedFunc<T>,
  chunkSize: number,
): Promise<Array<number[]>> {
  const resultEmbeddings: Array<number[]> = [];

  const queue: T[] = values;

  const curBatch: T[] = [];

  for (let i = 0; i < queue.length; i++) {
    curBatch.push(queue[i]!);
    if (i === queue.length - 1 || curBatch.length === chunkSize) {
      const embeddings = await embedFunc(curBatch);

      resultEmbeddings.push(...embeddings);

      curBatch.length = 0;
    }
  }

  return resultEmbeddings;
}
