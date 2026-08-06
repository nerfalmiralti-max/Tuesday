import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(fileURLToPath(import.meta.url), "../../");

/** Resolve the project's "@/..." path alias to real files for node --test. */
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    let target = path.join(projectRoot, specifier.slice(2));
    if (!path.extname(target)) {
      for (const ext of [".ts", ".tsx", ".mjs", ".js"]) {
        if (existsSync(target + ext)) {
          target += ext;
          break;
        }
      }
    }
    return next(pathToFileURL(target).href, context);
  }
  return next(specifier, context);
}
