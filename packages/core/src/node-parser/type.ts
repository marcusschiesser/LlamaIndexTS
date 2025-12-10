import type { TokenSizer } from "../global/settings/tokenizer";

export type SplitterParams = {
  tokenSizer?: TokenSizer | undefined;
};

export type PartialWithUndefined<T> = {
  [P in keyof T]?: T[P] | undefined;
};
