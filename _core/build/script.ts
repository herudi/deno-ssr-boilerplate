import * as esbuild from "https://deno.land/x/esbuild@v0.14.22/mod.js";
import * as esbuild_import_map from "https://esm.sh/esbuild-plugin-import-map?no-check";
import { genRoutesWithRefresh, getListPages } from "./gen.ts";
import map from "./../../import_map.json" assert { type: "json" };

const import_for_prod = esbuild_import_map;
esbuild_import_map.load(map as any);

const listFiles = await getListPages();

try {
  await Deno.remove(Deno.cwd() + "/public/pages", { recursive: true });
} catch (_e) { /* noop */ }

const config: any = {
  jsxFactory: "h",
  jsxFragment: "Fragment",
  format: "esm",
  loader: {
    ".ts": "ts",
    ".js": "js",
    ".tsx": "tsx",
  },
  treeShaking: true,
  minify: true,
  logLevel: "silent",
};

try {
  const error = await genRoutesWithRefresh("production");
  if (error) {
    throw error;
  }
  await esbuild.build({
    ...config,
    bundle: true,
    entryPoints: ["./src/server.ts"],
    outfile: "./deploy.js",
    plugins: [esbuild_import_map.plugin()],
  });
  map.imports["nano-jsx"] = map.imports["nano-jsx-client"];
  import_for_prod.load(map as any);
  await esbuild.build({
    ...config,
    bundle: true,
    target: "es6",
    splitting: true,
    outdir: "./public/pages",
    write: true,
    entryPoints: listFiles,
    plugins: [import_for_prod.plugin()],
  });
  await esbuild.build({
    ...config,
    target: "es6",
    bundle: true,
    plugins: [import_for_prod.plugin()],
    entryPoints: ["./_core/tsx/hydrate.tsx"],
    outfile: "./public/pages/_app.js",
  });
  console.log("Success Build !!");
  console.log("Run Production: deno run -A deploy.js");
  esbuild.stop();
} catch (error) {
  console.log(error.message);
  esbuild.stop();
}
