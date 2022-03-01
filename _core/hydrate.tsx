/** @jsx h */
import { h, hydrate } from "./deps/nano_jsx.ts";
import RootApp from "./root_app.tsx";

window.addEventListener("load", () => {
  hydrate(
    <RootApp />,
    document.getElementById("root"),
  );
});
