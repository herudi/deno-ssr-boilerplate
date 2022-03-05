/** @jsx h */
import { h } from "nano-jsx";
import { map_pages as pages, tt } from "./../result/pages.ts";
import RootApp from "./root_app.tsx";
import ClassicRouter from "./router.tsx";

async function lazy(url: string) {
  const mod = (await import(url + "?v=" + tt)).default;
  return mod;
}
let first = true;
window.addEventListener("load", () => {
  let init: any = document.getElementById("__INIT_DATA__");
  if (init) init = JSON.parse(init.textContent || "{}");
  const router = new ClassicRouter();
  for (let i = 0; i < pages.length; i++) {
    const obj: any = pages[i];
    router.add(obj.path, async (rev) => {
      rev.isFirst = first;
      try {
        if (RootApp.event.onStart !== void 0) {
          await RootApp.event.onStart(rev);
        }
        const Page: any = typeof obj.page === "string"
          ? (await lazy(obj.page))
          : obj.page;
        const initData = first
          ? init || {}
          : (Page.initProps
            ? (await Page.initProps({
              isServer: false,
              isFirst: rev.isFirst,
              params: rev.params,
              pathname: rev.pathname,
              path: rev.pathname,
              url: rev.url,
              getBaseUrl: () => location.origin,
            }))
            : {});
        rev.hydrate(
          <RootApp
            Page={Page}
            initData={initData}
            route={{
              pathname: rev.pathname,
              url: rev.url,
              path: obj.path,
              params: rev.params,
            }}
            isServer={false}
          />,
        );
        if (RootApp.event.onEnd !== void 0) {
          RootApp.event.onEnd(rev);
        }
      } catch (err) {
        if (RootApp.event.onError !== void 0) {
          RootApp.event.onError(err, rev);
        }
      }
      first = false;
    });
  }
  router.resolve();
});
