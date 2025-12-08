import { DEFAULT_CHUNK_OVERLAP, DEFAULT_CHUNK_SIZE, Settings } from "../global";

/**
 * Parameters for the SentenceSplitter
 */
export type SentenceSplitterParams = {
  /** The token chunk size for each chunk */
  chunkSize: number;
  /** The token overlap of each chunk when splitting */
  chunkOverlap: number;
  /** Default separator for splitting into words */
  separator: string;
  /** Separator between paragraphs */
  paragraphSeparator: string;
  /** Backup regex for splitting into sentences */
  secondaryChunkingRegex: string;
  /** Extra abbreviations to consider while splitting into sentences */
  extraAbbreviations: string[];
};

/**
 * Input parameters for SentenceSplitter (all optional with defaults)
 */
export type SentenceSplitterInput = Partial<SentenceSplitterParams>;

/**
 * Parse and validate SentenceSplitter parameters with defaults
 */
export function parseSentenceSplitterParams(
  params?: SentenceSplitterInput,
): SentenceSplitterParams {
  const chunkSize = params?.chunkSize ?? Settings.chunkSize ?? 1024;
  const chunkOverlap = params?.chunkOverlap ?? 200;

  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }
  if (chunkOverlap < 0) {
    throw new Error("chunkOverlap must be non-negative");
  }
  if (chunkOverlap >= chunkSize) {
    throw new Error("Chunk overlap must be less than chunk size.");
  }

  return {
    chunkSize,
    chunkOverlap,
    separator: params?.separator ?? " ",
    paragraphSeparator: params?.paragraphSeparator ?? "\n\n\n",
    secondaryChunkingRegex:
      params?.secondaryChunkingRegex ?? "[^,.;。？！]+[,.;。？！]?",
    extraAbbreviations: params?.extraAbbreviations ?? [],
  };
}

/**
 * Parameters for the SentenceWindowNodeParser
 */
export type SentenceWindowNodeParserParams = {
  /** The number of sentences on each side of a sentence to capture */
  windowSize: number;
  /** The metadata key to store the sentence window under */
  windowMetadataKey: string;
  /** The metadata key to store the original sentence in */
  originalTextMetadataKey: string;
};

/**
 * Input parameters for SentenceWindowNodeParser (all optional with defaults)
 */
export type SentenceWindowNodeParserInput =
  Partial<SentenceWindowNodeParserParams>;

/**
 * Parse and validate SentenceWindowNodeParser parameters with defaults
 */
export function parseSentenceWindowNodeParserParams(
  params?: SentenceWindowNodeParserInput,
): SentenceWindowNodeParserParams {
  const windowSize = params?.windowSize ?? 3;

  if (windowSize <= 0) {
    throw new Error("windowSize must be greater than 0");
  }

  return {
    windowSize,
    windowMetadataKey: params?.windowMetadataKey ?? "window",
    originalTextMetadataKey: params?.originalTextMetadataKey ?? "originalText",
  };
}

/**
 * Parameters for the TokenTextSplitter
 */
export type TokenTextSplitterParams = {
  /** The token chunk size for each chunk */
  chunkSize: number;
  /** The token overlap of each chunk when splitting */
  chunkOverlap: number;
  /** Default separator for splitting */
  separator: string;
  /** Backup separators to try if primary fails */
  backupSeparators: string[];
};

/**
 * Input parameters for TokenTextSplitter (all optional with defaults)
 */
export type TokenTextSplitterInput = Partial<TokenTextSplitterParams>;

/**
 * Parse and validate TokenTextSplitter parameters with defaults
 */
export function parseTokenTextSplitterParams(
  params?: TokenTextSplitterInput,
): TokenTextSplitterParams {
  const chunkSize = params?.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const chunkOverlap = params?.chunkOverlap ?? DEFAULT_CHUNK_OVERLAP;

  if (chunkSize <= 0) {
    throw new Error("chunkSize must be positive");
  }
  if (chunkOverlap < 0) {
    throw new Error("chunkOverlap must be non-negative");
  }

  return {
    chunkSize,
    chunkOverlap,
    separator: params?.separator ?? " ",
    backupSeparators: params?.backupSeparators ?? ["\n"],
  };
}
