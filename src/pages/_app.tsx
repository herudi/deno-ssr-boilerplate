/** @jsx h */
import { h, Helmet } from "nano-jsx";
import { AppProps, RequestEvent } from "types";
import Navbar from "../components/navbar.tsx";

function App({ Component, props }: AppProps) {
  return (
    <div>
      <Helmet>
        <html lang="en" />
        <link rel="icon" href="data:," />
        <link
          href="https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.css"
          rel="stylesheet"
        />
      </Helmet>
      <Navbar route={props.route} />
      <Component {...props} />
    </div>
  );
}

// example load NProgress showing if timeout > 300ms
let timeout: any;

App.onStart = async (rev: RequestEvent) => {
  // example dynamic import. cause for client side only.
  const NProgress = (await import("https://esm.sh/nprogress?no-check")).default;
  rev.NProgress = NProgress;

  // don't use NProgress in first load.
  if (!rev.isFirst) {
    timeout = setTimeout(() => {
      NProgress.start();
    }, 300);
  }
};

App.onEnd = ({ NProgress }: RequestEvent) => {
  if (timeout) clearTimeout(timeout);
  NProgress.done();
};

App.onError = (err: Error) => {
  console.error(err);
};

// onStart, onEnd and onError run on client side only
export default App;
