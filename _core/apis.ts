
import { Router, Handler } from "deps/nhttp.ts";
import $0 from "../pages/api/about.ts";
import $1 from "../pages/api/blog/index.ts";
import $2 from "../pages/api/blog/[title].ts";
const api = new Router();
const map = {} as Record<string, Handler>;
  
map['/api/about.ts'] = $0;
api.any('/about', $0);
  
map['/api/blog/index.ts'] = $1;
api.any('/blog', $1);
  
map['/api/blog/[title].ts'] = $2;
api.any('/blog/:title', $2);
export default { api, map };
