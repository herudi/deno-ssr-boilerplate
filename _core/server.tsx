/** @jsx h */
import { h } from "nano-jsx";
import { jsx } from "./deps/tpl.ts";
import { Handler, HttpError, NHttp } from "nhttp";
import { RequestEvent } from "./deps/types.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import RootApp from "./tsx/root_app.tsx";
import { map_pages as map_server_pages } from "./result/server_pages.ts";
import apis from "./result/apis.ts";
import Error404 from "../src/components/error/404.tsx";
import ErrorPage from "../src/components/error/error.tsx";

const env = (Deno.args || []).includes("--dev") ? "development" : "production";
const clientScript = "/assets/pages/_app.js";
const tt = Date.now();
let pages: any = [];
type ReqEvent = RequestEvent & {
  render: (
    Page: any,
    props: { path: string; initData?: any },
  ) => Record<string, any>;
};

const app = new NHttp<ReqEvent>({ env });

if (env === "development") {
  try {
    await Deno.remove(Deno.cwd() + "/public/pages", { recursive: true });
  } catch (_e) { /* noop */ }
  const { genPages } = await import("./build/gen.ts");
  const { map_pages } = await import("./result/pages.ts");
  const { refresh } = await import("https://deno.land/x/refresh@1.0.0/mod.ts");
  const esbuild = await import("https://deno.land/x/esbuild@v0.14.22/mod.js");
  const es_map = await import(
    "https://esm.sh/esbuild-plugin-import-map?no-check"
  );
  const map =
    (await import("./../import_map.json", { assert: { type: "json" } }))
      .default;
  map.imports["nano-jsx"] = "https://cdn.skypack.dev/nano-jsx@v0.0.30";
  pages = map_pages;
  await genPages();
  es_map.load(map as any);
  const result = await esbuild.build({
    jsxFactory: "h",
    jsxFragment: "Fragment",
    format: "esm",
    loader: {
      ".ts": "ts",
      ".js": "js",
      ".tsx": "tsx",
    },
    write: false,
    bundle: true,
    plugins: [es_map.plugin()],
    entryPoints: ["./_core/tsx/hydrate.tsx"],
    outfile: "./public/pages/_app.js",
  });
  const source = result.outputFiles[0]?.text || "noop";
  const midd = refresh({
    paths: "./src/pages/",
  });
  app.use((rev, next) => {
    const res = midd(rev.request);
    if (res) return res;
    return next();
  });
  app.get(clientScript, ({ response }) => {
    response.type("application/javascript");
    return source;
  });
} else {
  pages = map_server_pages;
}

app.use("/assets", staticFiles("public"));

app.use((rev, next) => {
  rev.getBaseUrl = () => new URL(rev.request.url).origin;
  rev.isServer = true;
  rev.env = env;
  rev.pathname = rev.path;
  rev.handler = async (name) => {
    if (!name.startsWith("/")) name = "/" + name;
    const fns = apis.map[name];
    if (Array.isArray(fns)) {
      let i = 0;
      const ret = (err?: Error) => {
        if (err) {
          if (err instanceof Error) throw err;
          else throw new HttpError(500, String(err));
        }
        return (fns as unknown as Handler<RequestEvent>[])[i++](rev, ret);
      };
      return await ret();
    }
    return await (apis.map[name] as Handler<RequestEvent>)(rev, next);
  };
  rev.render = async (Page, props) => {
    rev.response.type("text/html; charset=utf-8");
    const rootData = RootApp.initProps ? (await RootApp.initProps(rev)) : {};
    if (rootData) {
      const data = props.initData || {};
      props.initData = { ...data, ...rootData };
    }
    return jsx(
      <RootApp
        isServer={true}
        initData={props.initData}
        Page={Page}
        route={{
          url: rev.url,
          pathname: rev.path,
          path: props.path,
          params: rev.params,
        }}
      />,
      { clientScript, env, initData: props.initData, tt },
    );
  };
  return next();
});

app.use("/api", apis.api as any);

app.on404((rev) => {
  if (rev.path.startsWith("/api/")) {
    return { status: 404, message: `route ${rev.url} not found` };
  }
  rev.response.type("text/html; charset=utf-8");
  return jsx(<Error404 message={`route ${rev.url} not found`} status={404} />);
});
app.onError((err, rev) => {
  const status = rev.response.status();
  if (rev.path.startsWith("/api/")) {
    return { status, message: err.message };
  }
  rev.response.type("text/html; charset=utf-8");
  return jsx(<ErrorPage message={err.message} status={status} />);
});

export const initApp = (routeCallback?: (app: NHttp<ReqEvent>) => any) => {
  let obj = {} as any;
  if (routeCallback) {
    routeCallback(app);
    obj = app.route;
  }
  for (let i = 0; i < pages.length; i++) {
    const route: any = pages[i];
    const methods = route.methods || ["GET"];
    for (let j = 0; j < methods.length; j++) {
      const method = methods[j];
      if (!obj[method + route.path]) {
        app.on(method, route.path, async (rev) => {
          const Page = route.page as any;
          const initData = Page.initProps
            ? (await Page.initProps(rev))
            : void 0;
          return rev.render(Page, { path: route.path, initData });
        });
      }
    }
  }
  return app;
};
