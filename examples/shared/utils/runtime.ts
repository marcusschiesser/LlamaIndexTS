export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

export function ensureEnv(
  name: string,
  message: string = `Missing required environment variable: ${name}`,
): string | undefined {
  const value = process.env[name];
  if (!value) {
    console.log(message);
    return undefined;
  }
  return value;
}

export function ensureOpenAIKey(): string | undefined {
  return ensureEnv(
    "OPENAI_API_KEY",
    [
      "OpenAI API key not found in environment variables.",
      'Please set OPENAI_API_KEY, e.g. `export OPENAI_API_KEY="sk-..."`',
      "Get a key at https://platform.openai.com/account/api-keys",
    ].join("\n"),
  );
}
