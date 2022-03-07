
import { Router, Handler } from "https://deno.land/x/nhttp@1.1.10/mod.ts";
import { RequestEvent } from "./../deps/types.ts";
import $0 from "../../src/pages/api/blog/index.ts";
import $1 from "../../src/pages/api/blog/[title].ts";
import $2 from "../../src/pages/api/sign.ts";
const api = new Router<RequestEvent>();
const map = {} as Record<string, Handler<RequestEvent> | Handler<RequestEvent>[]>;
  
map['/api/blog/index.ts'] = $0;
api.any('/blog', $0);
  
map['/api/blog/[title].ts'] = $1;
api.any('/blog/:title', $1);
  
map['/api/sign.ts'] = $2;
api.any('/sign', $2);
export default { api, map };
