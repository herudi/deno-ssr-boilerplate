/** @jsx h */
import { h } from "nano-jsx";
import { ssr } from "./deps/nano_ssr.ts";
import { NHttp } from "nhttp";
import { RequestEvent } from "./deps/types.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import RootApp from "./tsx/root_app.tsx";
import { map_pages as map_server_pages } from "./result/server_pages.ts";
import apis from "./result/apis.ts";
import Error404 from "../src/components/error/404.tsx";
import ErrorPage from "../src/components/error/error.tsx";

const clientScript = "/assets/pages/_app.js";
const tt = Date.now();

const env = (Deno.args || []).includes("--dev") ? "development" : "production";
let emit: any;
let pages: any = [];

const app = new NHttp<RequestEvent>({ env });

if (env === "development") {
  const { genPages } = await import("./build/gen.ts");
  const { map_pages } = await import("./result/pages.ts");
  const { refresh } = await import("https://deno.land/x/refresh@1.0.0/mod.ts");
  pages = map_pages;
  try {
    await Deno.remove(Deno.cwd() + "/public/pages", { recursive: true });
  } catch (_e) { /* noop */ }
  await genPages();
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
  emit = await Deno.emit(
    `./_core/tsx/hydrate.tsx`,
    emitOptios,
  );
  const midd = refresh({
    paths: "./src/pages/",
  });
  app.use((rev, next) => {
    const res = midd(rev.request);
    if (res) return res;
    return next();
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
    return await apis.map[name](rev, next);
  };
  return next();
});

for (let i = 0; i < pages.length; i++) {
  const route: any = pages[i];
  app.get(route.path, async (rev) => {
    const Page = route.page as any;
    const initData = Page.initProps ? (await Page.initProps(rev)) : void 0;
    return ssr(
      <RootApp
        isServer={true}
        initData={initData}
        Page={Page}
        route={{
          url: rev.url,
          pathname: rev.path,
          path: route.path,
          params: rev.params,
        }}
      />,
      { clientScript, env, initData, tt },
    );
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

export default app;
