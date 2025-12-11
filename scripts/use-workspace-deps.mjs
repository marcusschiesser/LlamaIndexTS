#!/usr/bin/env node
/**
 * Switches npm versions back to workspace:* for monorepo development.
 * Run this when contributing to the vectorstores monorepo.
 *
 * Usage:
 *   node scripts/use-workspace-deps.mjs [path/to/package.json]
 *   If no path is provided, uses ./package.json in the current directory.
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Get package.json path from argument or default to current directory
const argPath = process.argv[2];
let pkgPath;
if (argPath) {
  pkgPath = resolve(argPath);
} else {
  // Default to package.json in current working directory
  pkgPath = resolve(process.cwd(), "package.json");
}

if (!existsSync(pkgPath)) {
  console.error(`❌ Error: package.json not found at ${pkgPath}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

let changed = 0;
for (const dep in pkg.dependencies) {
  if (
    dep.startsWith("@vectorstores/") &&
    pkg.dependencies[dep] !== "workspace:*"
  ) {
    pkg.dependencies[dep] = "workspace:*";
    changed++;
  }
}

if (changed > 0) {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(
    `✅ Switched ${changed} dependencies back to workspace:* in ${pkgPath}`,
  );
  console.log("   Now run: pnpm install");
} else {
  console.log(
    `ℹ️  All @vectorstores/* dependencies already use workspace:* in ${pkgPath}`,
  );
}
