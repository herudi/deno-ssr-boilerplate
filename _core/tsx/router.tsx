/** @jsx h */

import { h, hydrate } from "nano-jsx";
import ErrorPage from "../../src/pages/_error.tsx";
import { RequestEvent } from "../deps/types.ts";

type ReqEvent = RequestEvent & {
  render: (elem: any, id?: string) => any;
};

type THandler = (
  rev: ReqEvent,
) => any;

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
    this.fallback = opts.fallback || (
      <ErrorPage message="Not Found" status={404} />
    );
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
    const { pathname, search, origin } = window.location;
    if (this.current === pathname + search) return;
    let { fn, params } = this.find(pathname);
    this.current = pathname + search;
    const _id = this.id;
    const rev = {} as ReqEvent;
    rev.pathname = pathname;
    rev.url = this.current;
    rev.path = pathname;
    rev.isServer = false;
    rev.getBaseUrl = () => origin;
    rev.params = params;
    rev.fetchApi = async (pathname, opts) => {
      try {
        const res = await fetch(origin + pathname, opts);
        if (!res.ok) throw res;
        const json = await res.json();
        return { data: json, error: void 0 };
      } catch (error) {
        const json = await error.json();
        json.message = decURI(json.message);
        return { data: void 0, error: json };
      }
    };
    rev.render = (elem, id) => {
      hydrate(elem, document.getElementById(id || _id));
    };
    if (!fn) return rev.render(<ErrorPage message="Not Found" status={404} />);
    fn(rev);
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
