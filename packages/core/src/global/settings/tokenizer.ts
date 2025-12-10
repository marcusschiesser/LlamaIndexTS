import { AsyncLocalStorage } from "@vectorstores/env";

export type TokenSizer = (text: string) => number;

const tokenSizerAsyncLocalStorage = new AsyncLocalStorage<TokenSizer>();
let globalTokenSizer: TokenSizer | null = null;

export function getTokenSizer(): TokenSizer | null {
  return tokenSizerAsyncLocalStorage.getStore() ?? globalTokenSizer;
}

export function setTokenSizer(tokenSizer: TokenSizer | undefined) {
  if (tokenSizer !== undefined) {
    globalTokenSizer = tokenSizer;
  }
}

export function withTokenSizer<Result>(
  tokenSizer: TokenSizer,
  fn: () => Result,
): Result {
  return tokenSizerAsyncLocalStorage.run(tokenSizer, fn);
}
