/** @jsx h */
import { h } from "nano-jsx";
import pages from "./pages.ts";
import RootApp from "./root_app.tsx";
import ClassicRouter from "./router.tsx";

window.addEventListener("load", () => {
  const router = new ClassicRouter();
  for (let i = 0; i < pages.length; i++) {
    const obj = pages[i];
    router.add(obj.path, async (ctx) => {
      const Page = obj.page as any;
      const init = (window as any).__INIT_DATA__;
      let initData = {};
      try {
        let timeout: any;
        if (!init && RootApp.event.onStart !== void 0) {
          timeout = setTimeout(() => {
            RootApp.event.onStart(ctx);
          }, 300);
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
        if (!init && RootApp.event.onEnd !== void 0) {
          if (timeout) clearTimeout(timeout);
          RootApp.event.onEnd(ctx);
        }
        ctx.render(
          <RootApp
            Page={obj.page}
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
      } catch (err) {
        if (RootApp.event.onError !== void 0) {
          RootApp.event.onError(err, ctx);
        }
      }
    });
  }
  router.resolve();
});
