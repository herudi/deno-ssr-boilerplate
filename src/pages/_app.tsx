/** @jsx h */
import { h, Helmet } from "nano_jsx";
import { AppProps } from "types";
import { Navbar } from "../components/navbar.tsx";

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
      <Navbar {...props} />
      <Component {...props} />
    </div>
  );
}

export default App;
