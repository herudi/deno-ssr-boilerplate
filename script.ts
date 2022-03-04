import {
  genRoutesWithRefresh,
  STORAGE_KEY_API,
  STORAGE_KEY_PAGE,
} from "./_core/build/gen.ts";
import { join, resolve, toFileUrl } from "./_core/deps/dev.ts";

async function dev_server() {
  const sleep = (ms = 100) => new Promise((ok) => setTimeout(ok, ms));
  await genRoutesWithRefresh("development");
  await sleep(1000);
  const CMD = Deno.build.os === "windows" ? "cmd /c " : "";
  const script = CMD +
    "deno run -A --import-map=import_map.json --watch --no-check --unstable ./src/server.ts --dev";
  const p = Deno.run({ cmd: script.split(" ") });
  const pages_dir = join(resolve(Deno.cwd()), "./src/pages");
  const url = toFileUrl(pages_dir);
  const getFilePathUrl = (entry: string) =>
    toFileUrl(resolve(entry)).href.substring(url.href.length);

  const watcher = Deno.watchFs("./src/pages/", { recursive: true });
  let stts = false;
  async function watch(_watch: Deno.FsWatcher) {
    for await (const { paths, kind } of _watch) {
      if (["remove", "modify"].includes(kind)) {
        if (!stts) {
          stts = true;
          (async () => {
            if (kind === "remove") {
              await genRoutesWithRefresh("development");
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
                await genRoutesWithRefresh("development");
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
}

async function build() {
  console.log("Building Server Production...");

  const CMD = Deno.build.os === "windows" ? "cmd /c " : "";
  const script = CMD +
    "deno run -A --no-check --unstable ./_core/build/script.ts";
  const p = Deno.run({
    cmd: script.split(" "),
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await p.status();
  const rawOutput = await p.output();
  const rawError = await p.stderrOutput();

  if (code === 0) {
    await Deno.stdout.write(rawOutput);
  } else {
    const errorString = new TextDecoder().decode(rawError);
    console.log(errorString);
  }
  Deno.exit(code);
}

const args = (Deno.args || [])[0];

if (args === "--dev") {
  await dev_server();
} else if (args === "--build") {
  await build();
}
