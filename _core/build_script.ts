import * as esbuild from "https://deno.land/x/esbuild@v0.14.22/mod.js";
import { genRoutesWithRefresh } from "./gen.ts";

try {
  const error = await genRoutesWithRefresh();
  if (error) {
    throw error;
  }
  const emitOptios: Deno.EmitOptions = {
    check: false,
    bundle: "module",
    compilerOptions: {
      lib: ["dom", "dom.iterable", "esnext"],
      jsxFactory: "h",
      jsxFragmentFactory: "Fragment",
    },
  };
  const emit = await Deno.emit(
    `./_core/hydrate.tsx`,
    emitOptios,
  );
  const script = (await esbuild.transform(emit.files["deno:///bundle.js"], {
    loader: "js",
    minify: true,
  })).code;
  await Deno.writeTextFile(Deno.cwd() + "/public/hydrate.js", script);
  console.log("success build !!");
  console.log("run production: deno run -A --no-check server.ts");
  esbuild.stop();
} catch (error) {
  console.log(error);
}
