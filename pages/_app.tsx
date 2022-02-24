/** @jsx h */
import { Navbar } from "./../components/navbar.tsx";
import { AppProps, h, Helmet } from "../deps/client.ts";

function App({ Component, props }: AppProps) {
  return (
    <div>
      <Helmet head>
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
