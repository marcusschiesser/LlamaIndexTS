export const _ = {
  isObject(value?: unknown): value is object {
    const type = typeof value;
    return value != null && (type === "object" || type === "function");
  },
  isNil(value?: unknown): boolean {
    return value == null;
  },
  values(_obj: unknown): Array<unknown> {
    throw new Error("not implemented");
  },
};

export default _;
