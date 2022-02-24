import { join, resolve, toFileUrl } from "./deps/dev.ts";
import {
  genRoutesWithRefresh,
  STORAGE_KEY_API,
  STORAGE_KEY_PAGE,
} from "./_core/gen.ts";
const sleep = (ms = 100) => new Promise((ok) => setTimeout(ok, ms));
await genRoutesWithRefresh();
await sleep(1000);
const CMD = Deno.build.os === "windows" ? "cmd /c " : "";
const script = CMD +
  "deno run -A --watch --no-check --unstable server.ts --dev";
const p = Deno.run({ cmd: script.split(" ") });
const pages_dir = join(resolve(Deno.cwd()), "./pages");
const url = toFileUrl(pages_dir);
const getFilePathUrl = (entry: string) =>
  toFileUrl(resolve(entry)).href.substring(url.href.length);

const watcher = Deno.watchFs("./pages/", { recursive: true });
let stts = false;
async function watch(_watch: Deno.FsWatcher) {
  for await (const { paths, kind } of _watch) {
    if (["remove", "modify"].includes(kind)) {
      if (!stts) {
        stts = true;
        (async () => {
          if (kind === "remove") {
            await genRoutesWithRefresh();
          } else if (kind === "modify") {
            let status_page = false, status_api = false;
            if (localStorage.getItem(STORAGE_KEY_PAGE)) {
              const obj = JSON.parse(
                localStorage.getItem(STORAGE_KEY_PAGE) || "{}",
              );
              for (let i = 0; i < paths.length; i++) {
                const path = getFilePathUrl(paths[i]);
                if (!obj[path]) {
                  status_page = true;
                  break;
                }
              }
            }
            if (localStorage.getItem(STORAGE_KEY_API)) {
              const obj = JSON.parse(
                localStorage.getItem(STORAGE_KEY_API) || "{}",
              );
              for (let i = 0; i < paths.length; i++) {
                const path = getFilePathUrl(paths[i]);
                if (!obj[path]) {
                  status_api = true;
                  break;
                }
              }
            }
            if (status_page || status_api) {
              await genRoutesWithRefresh();
            }
          }
          await sleep(1000);
          stts = false;
        })();
      }
    }
  }
}

await watch(watcher);

await p.status();
