// if params void 0 is not match.
// params support wildcard : pathToParams("/noop/:slug*", "/noop/slug1/slug2");
// => { slug: ["slug1", "slug2"] }

export default function pathToParams(
  path: string | RegExp,
  pathname: string,
  def?: any,
) {
  if (def !== void 0 && def.wild !== void 0 && def.wild.length !== 0) {
    return def;
  }
  try {
    if (path instanceof RegExp) {
      if (!path.test(pathname)) return void 0;
      const params = path.exec(pathname);
      return params?.groups || {};
    }
    const str = path
      .replace(/\/$/, "")
      .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
      .replace(/(\/?)\*/g, (_, p) => `(${p}.*)?`)
      .replace(/\.(?=[\w(])/, "\\.");
    const regex = new RegExp(`^${str}/*$`);
    if (!regex.test(pathname)) return void 0;
    const arr = regex.exec(pathname);
    if (!arr) return void 0;
    const params = arr.groups || {};
    if (path.endsWith("*")) {
      if (path === "*" || path.endsWith("/*")) {
        const wild = arr.slice(-1).join("").split("/");
        wild.shift();
        return { ...params, wild };
      }
      const key = Object.keys(params).pop();
      if (key) return { ...params, [key]: arr.slice(-2).join("").split("/") };
    }
    return params;
  } catch (_e) {
    return void 0;
  }
}
