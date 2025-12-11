/**
 * Remark plugin that transforms ```package-install code blocks
 * into tabbed code blocks showing npm, pnpm, yarn, and bun commands.
 */

import { visit } from "unist-util-visit";

/**
 * Converts npm commands to pnpm equivalents
 */
function convertNpmToPnpm(command) {
  return command
    .replace(/^npm i(?:nstall)?\s+-D\s+/gm, "pnpm add -D ")
    .replace(/^npm i(?:nstall)?\s+--save-dev\s+/gm, "pnpm add -D ")
    .replace(/^npm i(?:nstall)?\s+/gm, "pnpm add ")
    .replace(/^npm init\b/gm, "pnpm init")
    .replace(/^npm run\s+/gm, "pnpm ")
    .replace(/^npx\s+/gm, "pnpm dlx ");
}

function convertNpmToYarn(command) {
  return command
    .replace(/^npm i(?:nstall)?\s+-D\s+/gm, "yarn add -D ")
    .replace(/^npm i(?:nstall)?\s+--save-dev\s+/gm, "yarn add -D ")
    .replace(/^npm i(?:nstall)?\s+/gm, "yarn add ")
    .replace(/^npm init\b/gm, "yarn init")
    .replace(/^npm run\s+/gm, "yarn ")
    .replace(/^npx\s+/gm, "yarn dlx ");
}

function convertNpmToBun(command) {
  return command
    .replace(/^npm i(?:nstall)?\s+-D\s+/gm, "bun add -D ")
    .replace(/^npm i(?:nstall)?\s+--save-dev\s+/gm, "bun add -D ")
    .replace(/^npm i(?:nstall)?\s+/gm, "bun add ")
    .replace(/^npm init\b/gm, "bun init")
    .replace(/^npm run\s+/gm, "bun run ")
    .replace(/^npx\s+/gm, "bunx ");
}

export default function remarkPackageInstall() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "package-install") {
        return;
      }

      const npmCode = node.value;
      const pnpmCode = convertNpmToPnpm(npmCode);
      const yarnCode = convertNpmToYarn(npmCode);
      const bunCode = convertNpmToBun(npmCode);

      // Create MDX JSX element for Tabs
      const tabsNode = {
        type: "mdxJsxFlowElement",
        name: "Tabs",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "syncKey",
            value: "package-manager",
          },
        ],
        children: [
          {
            type: "mdxJsxFlowElement",
            name: "TabItem",
            attributes: [
              { type: "mdxJsxAttribute", name: "label", value: "npm" },
              { type: "mdxJsxAttribute", name: "icon", value: "seti:npm" },
            ],
            children: [
              { type: "code", lang: "bash", value: npmCode },
            ],
          },
          {
            type: "mdxJsxFlowElement",
            name: "TabItem",
            attributes: [
              { type: "mdxJsxAttribute", name: "label", value: "pnpm" },
              { type: "mdxJsxAttribute", name: "icon", value: "pnpm" },
            ],
            children: [
              { type: "code", lang: "bash", value: pnpmCode },
            ],
          },
          {
            type: "mdxJsxFlowElement",
            name: "TabItem",
            attributes: [
              { type: "mdxJsxAttribute", name: "label", value: "yarn" },
              { type: "mdxJsxAttribute", name: "icon", value: "seti:yarn" },
            ],
            children: [
              { type: "code", lang: "bash", value: yarnCode },
            ],
          },
          {
            type: "mdxJsxFlowElement",
            name: "TabItem",
            attributes: [
              { type: "mdxJsxAttribute", name: "label", value: "bun" },
              { type: "mdxJsxAttribute", name: "icon", value: "bun" },
            ],
            children: [
              { type: "code", lang: "bash", value: bunCode },
            ],
          },
        ],
      };

      // Replace the code node with the tabs node
      parent.children.splice(index, 1, tabsNode);
    });
  };
}

