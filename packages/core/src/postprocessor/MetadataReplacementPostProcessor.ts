import type { NodeWithScore } from "../schema";
import { MetadataMode } from "../schema";
import type { BaseNodePostprocessor } from "./type";

export class MetadataReplacementPostProcessor implements BaseNodePostprocessor {
  targetMetadataKey: string;

  constructor(targetMetadataKey: string) {
    this.targetMetadataKey = targetMetadataKey;
  }

  async postprocessNodes(nodes: NodeWithScore[]): Promise<NodeWithScore[]> {
    for (const n of nodes) {
      n.node.setContent(
        n.node.metadata[this.targetMetadataKey] ??
          n.node.getContent(MetadataMode.NONE),
      );
    }

    return nodes;
  }
}
