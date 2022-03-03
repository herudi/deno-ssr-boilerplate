
import { Router, Handler } from "https://deno.land/x/nhttp@1.1.10/mod.ts";
import { RequestEvent } from "./deps/types.ts";
import $0 from "../src/pages/api/about.ts";
import $1 from "../src/pages/api/blog/index.ts";
import $2 from "../src/pages/api/blog/[title].ts";
const api = new Router<RequestEvent>();
const map = {} as Record<string, Handler<RequestEvent>>;
  
map['/api/about.ts'] = $0;
api.any('/about', $0);
  
map['/api/blog/index.ts'] = $1;
api.any('/blog', $1);
  
map['/api/blog/[title].ts'] = $2;
api.any('/blog/:title', $2);
export default { api, map };
