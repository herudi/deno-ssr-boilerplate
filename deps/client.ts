// dependencies for client

export {
  Component,
  Fragment,
  h,
  Helmet,
  hydrate,
  isSSR,
  ssr,
  Suspense,
  tw,
} from "../_core/nanossr.ts";
export type { FC } from "../_core/nanossr.ts";
export {
  Link,
  Listener,
  matchPath,
  parseParamsFromPath,
  Route,
  Routes,
  Switch,
  to,
} from "../_core/nano_router.ts";
import { RequestEvent as BRequestEvent } from "https://deno.land/x/nhttp@1.1.9/src/request_event.ts";
export type RequestEvent = BRequestEvent & {
  getBaseUrl: () => string;
  pathname: string;
  isServer: boolean;
  handler: (targetFile: string) => Promise<any>;
};

export type RouteProps = {
  params: Record<string, any>;
  pathname: string;
  [k: string]: any;
};

export type PageProps = {
  route: RouteProps;
  children?: any;
  [k: string]: any;
};

export type AppProps = {
  Component: any;
  props: PageProps;
};
