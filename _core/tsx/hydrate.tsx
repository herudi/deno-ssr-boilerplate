/** @jsx h */
import { h } from "nano-jsx";
import { env, map_pages as pages, tt } from "./../result/pages.ts";
import RootApp from "./root_app.tsx";
import ClassicRouter from "./router.tsx";

async function lazy(url: string) {
  const mod = (await import(url + "?v=" + tt)).default;
  return mod;
}

window.addEventListener("load", () => {
  const router = new ClassicRouter();
  for (let i = 0; i < pages.length; i++) {
    const obj: any = pages[i];
    router.add(obj.path, async (ctx) => {
      const Page: any = env === "development"
        ? obj.page
        : (await lazy(obj.page));
      const init = (window as any).__INIT_DATA__;
      let initData = {};
      try {
        if (!init && RootApp.event.onStart !== void 0) {
          RootApp.event.onStart(ctx);
        }
        initData = init || (Page.initProps
          ? (await Page.initProps({
            isServer: false,
            params: ctx.params,
            pathname: ctx.pathname,
            path: ctx.pathname,
            url: ctx.url,
            getBaseUrl: () => location.origin,
          }))
          : {});
        if ((window as any).__INIT_DATA__) {
          delete (window as any).__INIT_DATA__;
        }
        ctx.render(
          <RootApp
            Page={Page}
            initData={initData}
            route={{
              pathname: ctx.pathname,
              url: ctx.url,
              path: obj.path,
              params: ctx.params,
            }}
            isServer={false}
          />,
        );
        if (!init && RootApp.event.onEnd !== void 0) {
          RootApp.event.onEnd(ctx);
        }
      } catch (err) {
        if (RootApp.event.onError !== void 0) {
          RootApp.event.onError(err, ctx);
        }
      }
    });
  }
  router.resolve();
});
