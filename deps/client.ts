// dependencies for client
import { Router } from "../_core/nanossr.ts";
import pathToParams from "./../_core/path_to_params.ts";
import { RequestEvent as BRequestEvent } from "https://deno.land/x/nhttp@1.1.9/src/request_event.ts";

export {
  Component,
  Fragment,
  h,
  Helmet,
  hydrate,
  ssr,
  Suspense,
  tw,
} from "../_core/nanossr.ts";
export type { FC } from "../_core/nanossr.ts";

export const {
  Link,
  Listener,
  matchPath,
  Route,
  Routes,
  Switch,
  to,
} = Router;

export const parseParamsFromPath = (path: string) =>
  pathToParams(path, location.pathname) || {};

export type RequestEvent = BRequestEvent & {
  getBaseUrl: () => string;
  pathname: string;
  isServer: boolean;
  handler: (targetFile: string) => Promise<any>;
};

export type RouteProps = {
  url: string;
  pathname: string;
  path: string;
  [k: string]: any;
};

export type PageProps = {
  route: RouteProps;
  getParams: () => Record<string, any>;
  isServer: boolean;
  [k: string]: any;
};

export type AppProps = {
  Component: any;
  props: PageProps;
};
