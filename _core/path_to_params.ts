// if params void 0 is not match.
// params support wildcard : pathToParams("/noop/:slug*", "/noop/slug1/slug2");
// => { slug: ["slug1", "slug2"] }

function wildcard(path: string | undefined, wild: boolean, match: any) {
  const params = match.groups || {};
  if (!wild) return params;
  if (!path) return params;
  if (path.indexOf("*") !== -1) {
    match.shift();
    const wild = match.filter((el: any) => el !== void 0).filter((
      el: string,
    ) => el.startsWith("/")).join("").split("/");
    wild.shift();
    const ret = { ...params, wild: wild.filter((el: string) => el !== "") };
    if (path === "*" || path.indexOf("/*") !== -1) return ret;
    let wn = path.split("/").find((el: string) =>
      el.startsWith(":") && el.endsWith("*")
    );
    if (!wn) return ret;
    wn = wn.slice(1, -1);
    ret[wn] = [ret[wn]].concat(ret.wild).filter((el) => el !== "");
    delete ret.wild;
    return ret;
  }
  return params;
}

function decURI(str: string) {
  try {
    return decodeURI(str);
  } catch (_e) {
    return str;
  }
}

export default function pathToParams(
  path: string | RegExp,
  pathname: string,
) {
  try {
    pathname = decURI(pathname);
    if (path instanceof RegExp) {
      if (!path.test(pathname)) return void 0;
      const params = path.exec(pathname);
      return params?.groups || {};
    }
    let wild = false;
    const str = path
      .replace(/\/$/, "")
      .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
      .replace(/(\/?)\*/g, (_, p) => {
        wild = true;
        return `(${p}.*)?`;
      })
      .replace(/\.(?=[\w(])/, "\\.");
    const regex = new RegExp(`^${str}/*$`);
    if (!regex.test(pathname)) return void 0;
    const match = regex.exec(pathname);
    if (!match) return void 0;
    return wildcard(path, wild, match);
  } catch (_e) {
    return void 0;
  }
}
