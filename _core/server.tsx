/** @jsx h */

import { h, ssr } from "../deps/client.ts";
import { NHttp, RequestEvent } from "../deps/server.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import { refresh } from "https://deno.land/x/refresh@1.0.0/mod.ts";
import RootApp from "./root_app.tsx";
import { genPages } from "./gen.ts";
import pages from "./pages.ts";
import apis from "./apis.ts";
import Error404 from "../components/error/404.tsx";
import ErrorPage from "../components/error/error.tsx";
import pathToParams from "./path_to_params.ts";

const timestamp = new Date().getTime();

const env = (Deno.args || []).includes("--dev") ? "development" : "production";
let emit: any;

const app = new NHttp<
  RequestEvent & {
    getBaseUrl: () => string;
    render: (
      Page: any,
      props: { path: string; initData?: any },
    ) => Record<string, any>;
    env: string;
  }
>({ env });

if (env === "development") {
  try {
    await Deno.remove(Deno.cwd() + "/public/hydrate.js");
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
  };
  emit = await Deno.emit(
    `./_core/hydrate.tsx`,
    emitOptios,
  );
  const midd = refresh({
    paths: "./pages/",
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
  rev.render = (Page, props) => {
    rev.params = pathToParams(props.path, rev.path, rev.params);
    return ssr(() => (
      <RootApp
        env={env}
        timestamp={timestamp}
        initData={props.initData || {}}
        Page={Page}
        route={{
          params: rev.params,
          pathname: rev.path,
          path: props.path,
        }}
      />
    ));
  };
  return next();
});

for (let i = 0; i < pages.length; i++) {
  const route: any = pages[i];
  app.get(route.path, async (rev) => {
    rev.params = pathToParams(route.path, rev.path, rev.params);
    rev.getBaseUrl = () => new URL(rev.request.url).origin;
    const Page = route.page as any;
    const initData = Page.getInitProps ? (await Page.getInitProps(rev)) : {};
    return ssr(() => (
      <RootApp
        env={env}
        timestamp={timestamp}
        initData={initData}
        Page={Page}
        route={{
          params: rev.params,
          pathname: rev.path,
          path: route.path,
        }}
      />
    ));
  });
}

if (emit) {
  app.get("/assets/hydrate.js", ({ response }) => {
    response.type("application/javascript");
    return emit.files["deno:///bundle.js"];
  });
}

app.use("/api", apis as any);

app.on404((rev) => {
  if (rev.path.startsWith("/api/")) {
    return { status: 404, message: `route ${rev.url} not found` };
  }
  return ssr(() => <Error404 message={`route ${rev.url} not found`} />);
});
app.onError((err, rev) => {
  const status = rev.response.status();
  if (rev.path.startsWith("/api/")) {
    return { status, message: err.message };
  }
  return ssr(() => <ErrorPage message={err.message} status={status} />);
});

export const http = app;
