import pathToParams from "./../path_to_params.ts";
export * from "https://deno.land/x/nano_jsx@v0.0.30/mod.ts";
export const parseParamsFromPath = (path: string) =>
  pathToParams(path, location.pathname) || {};
export { tw } from "https://cdn.skypack.dev/twind@0.16.16";
