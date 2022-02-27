import * as esbuild from "https://deno.land/x/esbuild@v0.14.22/mod.js";
import * as esbuild_import_map from "https://esm.sh/esbuild-plugin-import-map?no-check";
import { genRoutesWithRefresh } from "./gen.ts";
import map from "./../import_map.json" assert { type: "json" };

esbuild_import_map.load(map as any);

try {
  const error = await genRoutesWithRefresh();
  if (error) {
    throw error;
  }
  await esbuild.build({
    jsxFactory: "h",
    jsxFragment: "Fragment",
    bundle: true,
    format: "esm",
    target: ["esnext"],
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
    },
    treeShaking: true,
    minify: true,
    entryPoints: ["./src/server.ts"],
    outfile: "./server.js",
    plugins: [esbuild_import_map.plugin()],
    logLevel: "silent",
  });
  const emitOptios: Deno.EmitOptions = {
    check: false,
    bundle: "module",
    compilerOptions: {
      lib: ["dom", "dom.iterable", "esnext"],
      jsxFactory: "h",
      jsxFragmentFactory: "Fragment",
    },
    importMapPath: "./import_map.json",
  };
  const emit = await Deno.emit(
    `./_core/hydrate.tsx`,
    emitOptios,
  );
  const script = (await esbuild.transform(emit.files["deno:///bundle.js"], {
    loader: "js",
    minify: true,
    treeShaking: true,
  })).code;
  await Deno.writeTextFile(Deno.cwd() + "/public/hydrate.js", script);
  console.log("Success Build !!");
  console.log("Run Production: deno run -A --no-check server.js");
  esbuild.stop();
} catch (error) {
  console.log(error.message);
  esbuild.stop();
}
