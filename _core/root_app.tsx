/** @jsx h */
import App from "../src/pages/_app.tsx";
import { Component, h, parseParamsFromPath, Router } from "./deps/nano_jsx.ts";
import pages from "./pages.ts";
import Error404 from "../src/components/error/404.tsx";

const { Switch, Route } = Router;

const ClientApp = () => (
  <Switch fallback={() => <Error404 />}>
    {pages.map(({ path, page }: any) => {
      const Page = page;
      return (
        <Route exact path={path}>
          {() =>
            class extends Component {
              route = {
                url: location.pathname + location.search,
                pathname: location.pathname,
                path,
              };
              init_data = (window as any).__INIT_DATA__;
              async didMount() {
                if ((window as any).__INIT_DATA__) {
                  (window as any).__INIT_DATA__ = void 0;
                }
                if (!this.init_data && Page.initProps) {
                  const props = await Page.initProps({
                    isServer: false,
                    params: parseParamsFromPath(path) || {},
                    pathname: location.pathname,
                    path: location.pathname,
                    url: location.pathname + location.search,
                    getBaseUrl: () => location.origin,
                  });
                  this.update(props);
                }
              }
              render(u_props: any) {
                const route = this.route;
                const props = u_props || this.init_data || {};
                return (
                  <App
                    Component={Page}
                    props={{ ...props, route, isServer: false }}
                  />
                );
              }
            }}
        </Route>
      );
    })}
  </Switch>
);

const RootApp = (
  { Page, initData, route, getParams, isServer }: any,
) => {
  if (isServer) {
    return (
      <div id="root">
        <App
          Component={Page}
          props={{ ...initData, route, getParams, isServer }}
        />
      </div>
    );
  }
  return (
    <div id="root">
      <ClientApp />
    </div>
  );
};

export default RootApp;
