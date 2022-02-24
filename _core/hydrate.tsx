/** @jsx h */
import { h, hydrate } from "../deps/client.ts";
import RootApp from "./root_app.tsx";

window.addEventListener("load", () => {
  hydrate(
    <RootApp initData={(window as any).__INIT_DATA__ || {}} />,
    document.getElementById("root"),
  );
});
