import pathToParams from "./../path_to_params.ts";
export * from "https://cdn.skypack.dev/nano-jsx@v0.0.30-dev.1?dts";
export const parseParamsFromPath = (path: string) =>
  pathToParams(path, location.pathname) || {};
export { tw } from "https://cdn.skypack.dev/twind@0.16.16";
