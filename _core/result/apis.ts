
import { Router } from "https://deno.land/x/nhttp@1.1.10/mod.ts";
import { RequestEvent } from "./../deps/types.ts";
import $0 from "../../src/pages/api/blog/index.ts";
import $1 from "../../src/pages/api/blog/[title].ts";
import $2 from "../../src/pages/api/sign.ts";
const api = new Router<RequestEvent>();
  api.any('/blog', $0);
  api.any('/blog/:title', $1);
  api.any('/sign', $2);
export default api;
