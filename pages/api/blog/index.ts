import { HttpError, RequestEvent } from "../../../deps/server.ts";

export default async function handler(rev: RequestEvent) {
  if (rev.request.method == "GET") {
    return await (await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=10",
    )).json();
  }
  throw new HttpError(405, "method not allowed");
}
