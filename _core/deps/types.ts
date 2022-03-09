import { RequestEvent as BRequestEvent } from "https://deno.land/x/nhttp@1.1.10/src/request_event.ts";

export type RequestEvent = BRequestEvent & {
  getBaseUrl: () => string;
  pathname: string;
  isServer: boolean;
  isFirst: boolean;
  /**
   * Fetch data from internal API.
   * @example
   * const { data, error } = await fetchApi("/api/home");
   */
  fetchApi: (pathname: string, options?: RequestInit) => Promise<any>;
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
