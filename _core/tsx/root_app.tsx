/** @jsx h */

import { h } from "nano-jsx";
import App from "../../src/pages/_app.tsx";

function RootApp({ Page, initData, route, isServer }: any) {
  return (
    <App
      Component={Page}
      props={{ ...initData, route, isServer }}
    />
  );
}

RootApp.initProps = (App as any).initProps;
RootApp.event = (App as any).event || {};

export default RootApp;
