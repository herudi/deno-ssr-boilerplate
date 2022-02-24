/** @jsx h */
import App from "../pages/_app.tsx";
import {
  Component,
  h,
  Helmet,
  isSSR,
  matchPath,
  Route,
  Switch,
} from "../deps/client.ts";
import pages from "./pages.ts";
import Error404 from "../components/error/404.tsx";

const RootApp = ({ Page, initData, route, timestamp, env }: any) => {
  if (isSSR()) {
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
        <App Component={Page} props={{ ...initData, route }} />
      </div>
    );
  }
  return (
    <div id="root">
      <Switch fallback={() => <Error404 />}>
        {pages.map(({ path, page }: any) => {
          const Page = page;
          return (
            <Route exact path={path}>
              {() =>
                class extends Component {
                  match = matchPath(location.pathname, { path });
                  route = {
                    params: this.match?.params || {},
                    pathname: this.match?.url || location.pathname,
                    path,
                  };
                  _props = {};
                  status = false;
                  async didMount() {
                    if (this.status && Page.initProps) {
                      const props = await Page.initProps({
                        isServer: false,
                        params: this.route.params,
                        pathname: this.route.pathname,
                        path: this.route.pathname,
                        url: this.route.pathname + location.search,
                        getBaseUrl: () => location.origin,
                      });
                      this.update(props);
                    }
                  }
                  render(props: any) {
                    const route = this.route;
                    if (props) {
                      return (
                        <App Component={Page} props={{ ...props, route }} />
                      );
                    }
                    if ((window as any).__INIT_DATA__) {
                      this._props = initData;
                      delete (window as any).__INIT_DATA__;
                    } else if (!this.status) {
                      this.status = true;
                    }
                    return (
                      <App Component={Page} props={{ ...this._props, route }} />
                    );
                  }
                }}
            </Route>
          );
        })}
      </Switch>
    </div>
  );
};

export default RootApp;
