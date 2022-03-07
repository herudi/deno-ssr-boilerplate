/** @jsx h */
import { h, Helmet } from "nano-jsx";
import { AppProps, RequestEvent } from "types";
import Navbar from "../components/navbar.tsx";

function App({ Component, props }: AppProps) {
  return (
    <div>
      <Helmet head>
        <html lang="en" />
        <link rel="icon" href="data:," />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js">
        </script>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          rel="stylesheet"
        />
      </Helmet>
      {props.route.pathname !== "/sign" && <Navbar route={props.route} />}
      <Component {...props} />
    </div>
  );
}

// example load NProgress showing if timeout > 300ms
let timeout: any;

// event run on client side only
App.event = {
  onStart(rev: RequestEvent) {
    rev.NProgress = (window as any).NProgress;

    // example use NProgress after first load.
    if (!rev.isFirst) {
      timeout = setTimeout(() => {
        rev.NProgress.start();
      }, 300);
    }
  },
  onEnd({ NProgress }: RequestEvent) {
    if (timeout) clearTimeout(timeout);
    NProgress.done();
  },
  onError(err: Error) {
    console.error(err);
  },
};

export default App;
