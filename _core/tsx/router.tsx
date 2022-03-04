/** @jsx h */

import { h, hydrate } from "nano-jsx";
import Error404 from "../../src/components/error/404.tsx";

type TContext = {
  pathname: string;
  params: Record<string, any>;
  path: string;
  url: string;
  render: (elem: any, id?: string) => any;
};
type THandler = (ctx: TContext) => any;

function wildcard(path: string, wild: boolean, match: any) {
  const params = match.groups || {};
  if (!wild) return params;
  if (path.indexOf("*") !== -1) {
    match.shift();
    const wild = match.filter((el: any) => el !== void 0).filter((
      el: string,
    ) => el.startsWith("/")).join("").split("/");
    wild.shift();
    const ret = { ...params, wild: wild.filter((el: string) => el !== "") };
    if (path === "*" || path.indexOf("/*") !== -1) return ret;
    let wn = path.split("/").find((el: string) =>
      el.startsWith(":") && el.endsWith("*")
    );
    if (!wn) return ret;
    wn = wn.slice(1, -1);
    ret[wn] = [ret[wn]].concat(ret.wild).filter((el) => el !== "");
    delete ret.wild;
    return ret;
  }
  return params;
}

function decURI(str: string) {
  try {
    return decodeURI(str);
  } catch (_e) {
    return str;
  }
}

type TRouter = {
  id?: string;
  fallback?: any;
};

export default class ClassicRouter {
  routes: { path: string; regex: RegExp; wild: boolean; fn: THandler }[] = [];
  current: string | undefined;
  id: string;
  fallback: any;
  constructor(opts: TRouter = {}) {
    this.id = opts.id || "root";
    this.fallback = opts.fallback || <Error404 />;
  }

  add(path: string, fn: THandler) {
    let wild = false;
    const str = path
      .replace(/\/$/, "")
      .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
      .replace(/(\/?)\*/g, (_, p) => {
        wild = true;
        return `(${p}.*)?`;
      })
      .replace(/\.(?=[\w(])/, "\\.");
    const regex = new RegExp(`^${str}/*$`);
    this.routes.push({ path, fn, regex, wild });
    return this;
  }

  find(pathname: string) {
    let fn: any, params = {}, j = 0, el, arr = this.routes, len = arr.length;
    pathname = decURI(pathname);
    while (j < len) {
      el = arr[j];
      if (el.regex.test(pathname)) {
        const match = el.regex.exec(pathname);
        fn = el.fn;
        params = wildcard(el.path, el.wild, match);
        break;
      }
      j++;
    }
    return { fn, params };
  }

  handle() {
    const { pathname, search } = window.location;
    if (this.current === pathname + search) return;
    let { fn, params } = this.find(pathname);
    this.current = pathname + search;
    const _id = this.id;
    const ctx = {
      pathname,
      url: this.current,
      path: pathname,
      search,
      params,
      render(elem, id) {
        hydrate(elem, document.getElementById(id || _id));
      },
    } as TContext;
    if (!fn) return ctx.render(<Error404 />);
    fn(ctx);
  }

  resolve() {
    const handle = () => this.handle();
    handle();
    window.addEventListener("pushstate", (e: any) => {
      e.preventDefault();
      handle();
    });
    window.addEventListener("replacestate", (e: any) => {
      e.preventDefault();
      handle();
    });
    window.addEventListener("popstate", () => {
      handle();
    });
  }
}
