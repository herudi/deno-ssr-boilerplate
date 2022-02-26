import { join, resolve, toFileUrl, walk } from "../deps/dev.ts";

export const STORAGE_KEY_PAGE = "95d6aa06f620";
export const STORAGE_KEY_API = "01a2929d18cf";

async function checkStat(arr: string[], dir: string, storage: any) {
  const base = dir + "/pages";
  let status = false, new_entry = false;
  for (let i = 0; i < arr.length; i++) {
    const filename = arr[i];
    const stat = await Deno.stat(join(base, filename));
    const mtime = stat.mtime?.getTime();
    if (!storage[filename]) {
      storage[filename] = mtime;
      if (!new_entry) {
        new_entry = true;
      }
    }
    if (storage[filename] !== mtime) {
      storage[filename] = mtime;
      if (!status) {
        status = true;
      }
    }
  }
  return { storage, status, new_entry };
}

function genPath(el: string) {
  let path = el.substring(0, el.lastIndexOf("."));
  if (path.endsWith("/index")) {
    path = path.substring(0, path.lastIndexOf("/index"));
  }
  if (path === "") path = "/";
  path = "/" + path.split("/").reduce((curr, val) => {
    if (val.startsWith("[...") && val.endsWith("]")) {
      return curr + "/:" + val.slice(4, val.length - 1) + "*";
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      return curr + "/:" + val.slice(1, val.length - 1);
    }
    return val;
  }, "");
  return path;
}

function genRoutes(arr: string[], target: string) {
  if (target === "page") {
    return `
${arr.map((el, i) => `import $${i} from "../pages${el}";`).join("\n")}
export default [
  ${
      arr.map((el, i) => {
        const path = genPath(el);
        return `{ 
    path: '${path}',
    page: $${i}
  },`;
      }).join("\n  ")
    }
];
`;
  }
  return `
import { HttpApi } from "../deps/server.ts";
import { Handler } from "../deps/server.ts";
${arr.map((el, i) => `import $${i} from "../pages${el}";`).join("\n")}
const api = new HttpApi();
const map = {} as Record<string, Handler>;
  ${
    arr.map((el, i) => {
      const path = genPath(el);
      return `
map['${el}'] = $${i};
api.any('${path}', $${i});`;
    }).join("\n  ")
  }
export default { api, map };
`;
}

export async function genPages(refresh = false, dir: string = Deno.cwd()) {
  try {
    dir = resolve(dir);
    const curr_stat_page = JSON.parse(
      localStorage.getItem(STORAGE_KEY_PAGE) || "{}",
    );
    const curr_stat_api = JSON.parse(
      localStorage.getItem(STORAGE_KEY_API) || "{}",
    );
    const page_list = [];
    const api_list = [];
    const pages_dir = join(dir, "./pages");
    const url = toFileUrl(pages_dir);
    const it = walk(pages_dir, {
      includeDirs: false,
      includeFiles: true,
      exts: ["tsx", "jsx", "ts", "js"],
    });
    for await (const entry of it) {
      if (entry.isFile) {
        const file = toFileUrl(entry.path).href.substring(url.href.length);
        if (!file.startsWith("/_app.")) {
          if (file.startsWith("/api/")) {
            api_list.push(file);
          } else {
            page_list.push(file);
          }
        }
      }
    }
    const stat_page = await checkStat(page_list, dir, curr_stat_page);
    const stat_api = await checkStat(api_list, dir, curr_stat_api);

    // check page storage
    if (stat_page.new_entry || stat_page.status || refresh) {
      localStorage.setItem(STORAGE_KEY_PAGE, JSON.stringify(stat_page.storage));
    }

    // check api storage
    if (stat_api.new_entry || stat_api.status || refresh) {
      localStorage.setItem(STORAGE_KEY_API, JSON.stringify(stat_api.storage));
    }

    // save pages.ts
    if (stat_page.status || refresh) {
      const str_file = genRoutes(page_list, "page");
      const path = dir + "/_core/pages.ts";
      await Deno.writeTextFile(path, str_file);
    }

    // save apis.ts
    if (stat_api.status || refresh) {
      const str_file = genRoutes(api_list, "api");
      const path = dir + "/_core/apis.ts";
      await Deno.writeTextFile(path, str_file);
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function genRoutesWithRefresh() {
  localStorage.clear();
  return await genPages(true);
}
