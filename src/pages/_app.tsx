/** @jsx h */
import { h, Helmet } from "nano-jsx";
import { AppProps } from "types";
import Navbar from "../components/navbar.tsx";
import NProgress from "https://esm.sh/nprogress?no-check";

function App({ Component, props }: AppProps) {
  return (
    <div>
      <Helmet head>
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

App.onStart = () => {
  NProgress.start();
};

App.onEnd = () => {
  NProgress.done();
};

App.onError = (err: Error) => {
  alert(err.message || "Something went wrong");
};

export default App;
