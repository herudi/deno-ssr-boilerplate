/** @jsx h */
import { h } from "nano-jsx";
import { jsx } from "./deps/tpl.ts";
import { HttpError, NHttp } from "nhttp";
import { RequestEvent } from "./deps/types.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import RootApp from "./tsx/root_app.tsx";
import { map_pages as map_server_pages } from "./result/server_pages.ts";
import apis from "./result/apis.ts";
import ErrorPage from "../src/pages/_error.tsx";

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
    write: false,
    bundle: true,
    plugins: [es_map.plugin()],
    entryPoints: ["./_core/tsx/hydrate.tsx"],
    minify: true,
  });
  const source = result.outputFiles[0]?.contents;
  if (source) {
    app.get(clientScript, ({ response }) => {
      response.type("application/javascript");
      return source;
    });
  }
  app.get("/__REFRESH__", ({ response }) => {
    response.type("text/event-stream");
    return new ReadableStream({
      start(controller) {
        controller.enqueue(`data: reload\nretry: 100\n\n`);
      },
      cancel(err) {
        console.log(err);
      },
    }).pipeThrough(new TextEncoderStream());
  });
  app.get("/assets/js/refresh.js", ({ response }) => {
    response.type("application/javascript");
    return `let bool = false; new EventSource("/__REFRESH__").addEventListener("message", _ => {
      if (bool) location.reload();
      else bool = true;
    });`;
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
  rev.fetchApi = async (pathname) => {
    const arr = app.route["ANY"];
    let i = 0, len = arr.length, fns: any;
    while (i < len) {
      const obj = arr[i];
      if (obj.pathx.test(pathname)) {
        fns = obj.fns;
        break;
      }
      i++;
    }
    if (!fns) throw new HttpError(404, `${pathname} not found`);
    try {
      if (fns.length === 1) {
        const data = await fns[0](rev, next);
        return { data, error: void 0 };
      }
      let j = 0;
      const ret = (err?: Error) => {
        if (err) {
          if (err instanceof Error) throw err;
          else throw new HttpError(500, String(err));
        }
        return fns[j++](rev, ret);
      };
      const data = await ret();
      return { data, error: void 0 };
    } catch (error) {
      return {
        data: void 0,
        error: {
          status: error.status || 500,
          message: error.message || "Something went wrong",
        },
      };
    }
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

app.use("/api", apis as any);

app.on404((rev) => {
  throw new HttpError(404, `${rev.url} not found`);
});

app.onError((err, rev) => {
  const status = rev.response.status();
  if (rev.path.startsWith("/api/")) {
    return { status, message: err.message };
  }
  rev.response.type("text/html; charset=utf-8");
  return jsx(<ErrorPage message={err.message} status={status as number} />);
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
