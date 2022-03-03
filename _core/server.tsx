/** @jsx h */

import { h } from "nano-jsx";
import { ssr } from "./deps/nano_ssr.ts";
import { NHttp } from "nhttp";
import { RequestEvent } from "./deps/types.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import { refresh } from "https://deno.land/x/refresh@1.0.0/mod.ts";
import RootApp from "./root_app.tsx";
import { genPages } from "./gen.ts";
import pages from "./pages.ts";
import apis from "./apis.ts";
import Error404 from "../src/components/error/404.tsx";
import ErrorPage from "../src/components/error/error.tsx";

import * as esbuild from "https://deno.land/x/esbuild@v0.14.22/mod.js";
import * as esbuild_import_map from "https://esm.sh/esbuild-plugin-import-map?no-check";

import map from "./../import_map.json" assert { type: "json" };

const clientScript = "/assets/hydrates/app.js";
const tt = Date.now();

const env = (Deno.args || []).includes("--dev") ? "development" : "production";
let emit: any;

const app = new NHttp<
  RequestEvent & {
    render: (
      Page: any,
      props: { path: string; initData?: any },
    ) => Record<string, any>;
  }
>({ env });

if (env === "development") {
  await genPages();
  map.imports["nano-jsx"] = map.imports["nano-jsx-client"];
  esbuild_import_map.load(map as any);
  await esbuild.build({
    jsxFactory: "h",
    jsxFragment: "Fragment",
    bundle: true,
    format: "esm",
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
    },
    entryPoints: ["./_core/hydrate.tsx"],
    outfile: "./public/hydrates/app.js",
    plugins: [esbuild_import_map.plugin()],
  });
  const midd = refresh({
    paths: "./src/pages/",
  });
  app.use((rev, next) => {
    const res = midd(rev.request);
    if (res) return res;
    return next();
  });
}
app.use("/assets", staticFiles("public"));

app.use((rev, next) => {
  rev.getBaseUrl = () => new URL(rev.request.url).origin;
  rev.isServer = true;
  rev.env = env;
  rev.pathname = rev.path;
  rev.handler = async (name) => {
    if (!name.startsWith("/")) name = "/" + name;
    return await apis.map[name](rev, next);
  };
  rev.render = (Page, props) => {
    return ssr(
      <RootApp
        isServer={true}
        initData={props.initData || {}}
        Page={Page}
        route={{
          url: rev.url,
          pathname: rev.path,
          path: props.path,
          params: rev.params,
        }}
      />,
      { clientScript, env, initData: props.initData || {}, tt },
    );
  };
  return next();
});

for (let i = 0; i < pages.length; i++) {
  const route: any = pages[i];
  app.get(route.path, async (rev) => {
    rev.getBaseUrl = () => new URL(rev.request.url).origin;
    const Page = route.page as any;
    const initData = Page.initProps ? (await Page.initProps(rev)) : {};
    return rev.render(Page, { path: route.path, initData });
  });
}

if (emit) {
  app.get(clientScript, ({ response }) => {
    response.type("application/javascript");
    return emit.files["deno:///bundle.js"];
  });
}

app.use("/api", apis.api as any);

app.on404((rev) => {
  if (rev.path.startsWith("/api/")) {
    return { status: 404, message: `route ${rev.url} not found` };
  }
  return ssr(<Error404 message={`route ${rev.url} not found`} status={404} />, {
    status: 404,
  });
});
app.onError((err, rev) => {
  const status = rev.response.status();
  if (rev.path.startsWith("/api/")) {
    return { status, message: err.message };
  }
  return ssr(
    <ErrorPage message={err.message} status={status} />,
    {
      status,
    },
  );
});

export const http = app;
