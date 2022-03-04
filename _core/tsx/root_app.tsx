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

RootApp.event = {
  onStart: (App as any).onStart,
  onEnd: (App as any).onEnd,
  onError: (App as any).onError,
};

export default RootApp;
