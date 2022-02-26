/** @jsx h */
import App from "../pages/_app.tsx";
import {
  Component,
  h,
  Helmet,
  parseParamsFromPath,
  Route,
  Switch,
} from "../deps/client.ts";
import pages from "./pages.ts";
import Error404 from "../components/error/404.tsx";

const ClientApp = ({ initData }: any) => (
  <Switch fallback={() => <Error404 />}>
    {pages.map(({ path, page }: any) => {
      const Page = page;
      return (
        <Route exact path={path}>
          {() => {
            let g_match = { status: false } as any;
            return class extends Component {
              route = {
                url: location.pathname + location.search,
                pathname: location.pathname,
                path,
              };
              getParams() {
                if (g_match.status) return g_match.params;
                const params = parseParamsFromPath(path);
                if (g_match.status === false) {
                  g_match = {
                    status: true,
                    params: params
                  };
                }
                return params;
              }
              _props = {};
              status = false;
              async didMount() {
                if (this.status && Page.initProps) {
                  if (g_match.status === false) {
                    const params = parseParamsFromPath(path);
                    g_match = {
                      status: true,
                      params: params,
                    };
                  }
                  const props = await Page.initProps({
                    isServer: false,
                    params: g_match.params,
                    pathname: location.pathname,
                    path: location.pathname,
                    url: location.pathname + location.search,
                    getBaseUrl: () => location.origin,
                  });
                  this.update(props);
                }
              }
              render(props: any) {
                const route = this.route;
                const getParams = this.getParams;
                if (props) {
                  return (
                    <App
                      Component={Page}
                      props={{ ...props, route, getParams, isServer: false }}
                    />
                  );
                }
                if ((window as any).__INIT_DATA__) {
                  this._props = initData;
                  delete (window as any).__INIT_DATA__;
                } else if (!this.status) {
                  this.status = true;
                }
                return (
                  <App
                    Component={Page}
                    props={{
                      ...this._props,
                      route,
                      getParams,
                      isServer: false,
                    }}
                  />
                );
              }
            };
          }}
        </Route>
      );
    })}
  </Switch>
);

const RootApp = (
  { Page, initData, route, getParams, timestamp, env, isServer }: any,
) => {
  if (isServer) {
    return (
      <div id="root">
        <Helmet footer>
          {env === "development" && (
            <script src="/assets/js/refresh_client.js"></script>
          )}
          {initData && (
            <script>window.__INIT_DATA__ = {JSON.stringify(initData)}</script>
          )}
          <script async src={"/assets/hydrate.js?v=" + timestamp}></script>
        </Helmet>
        <App
          Component={Page}
          props={{ ...initData, route, getParams, isServer }}
        />
      </div>
    );
  }
  return (
    <div id="root">
      <ClientApp initData={initData} />
    </div>
  );
};

export default RootApp;
