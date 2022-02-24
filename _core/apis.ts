
import ptp from "./path_to_params.ts";
import { HttpApi } from "../deps/server.ts";
import $0 from "../pages/api/about.ts";
import $1 from "../pages/api/blog/index.ts";
import $2 from "../pages/api/blog/[title].ts";
const api = new HttpApi();
  api.any('/about', $0 as any);
  api.any('/blog', $1 as any);
  api.any('/blog/:title', $2 as any);
export default api;
