import { register } from "node:module";

// Registers the "@/..." resolver so node --test can import the TypeScript source.
register("./alias-hooks.mjs", import.meta.url);
