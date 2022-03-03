import { RequestEvent as BRequestEvent } from "https://deno.land/x/nhttp@1.1.10/src/request_event.ts";

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
  params: Record<string, any>;
  [k: string]: any;
};

export type PageProps = {
  route: RouteProps;
  isServer: boolean;
  [k: string]: any;
};

export type AppProps = {
  Component: any;
  props: PageProps;
};
