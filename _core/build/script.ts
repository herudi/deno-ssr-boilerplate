import * as esbuild from "https://deno.land/x/esbuild@v0.14.22/mod.js";
import * as esbuild_import_map from "https://esm.sh/esbuild-plugin-import-map?no-check";
import { genRoutesWithRefresh, getListPages } from "./gen.ts";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.4.0/mod.ts";
import map from "./../../import_map.json" assert { type: "json" };

esbuild_import_map.load(map as any);

const listFiles = await getListPages();

const obj = {} as any;

for (let i = 0; i < listFiles.length; i++) {
  const name = listFiles[i];
  const _name = name.replace("./src/pages/", "").replace(/\.[^.]+$/, "");
  obj[_name] = name;
}

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
  await esbuild.build({
    ...config,
    bundle: true,
    plugins: [denoPlugin({
      importMapFile: "./import_map.json",
    })],
    entryPoints: {
      "_app": "./_core/tsx/hydrate.tsx",
      ...obj,
    },
    splitting: true,
    outdir: "./public/pages",
  });
  console.log("Success Build !!");
  console.log("Run Production: deno run -A deploy.js");
  esbuild.stop();
} catch (error) {
  console.log(error.message);
  esbuild.stop();
}
