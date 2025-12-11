#!/usr/bin/env node
/**
 * Switches workspace:* dependencies to npm versions for standalone usage.
 * Run this before `npm install` when not developing in the monorepo.
 *
 * Usage:
 *   node scripts/use-npm-deps.mjs [path/to/package.json]
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
  if (pkg.dependencies[dep] === "workspace:*") {
    pkg.dependencies[dep] = "latest";
    changed++;
  }
}

if (changed > 0) {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(
    `✅ Switched ${changed} dependencies from workspace:* to latest in ${pkgPath}`,
  );
  console.log("   Now run: npm install");
} else {
  console.log(
    `ℹ️  No workspace:* dependencies found in ${pkgPath} - already using npm versions`,
  );
}
