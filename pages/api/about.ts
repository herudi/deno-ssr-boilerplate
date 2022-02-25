import { HttpError, RequestEvent } from "../../deps/server.ts";

export default async function handler(rev: RequestEvent) {
  if (rev.request.method == "GET") {
    return { title: "Welcome About From Api" };
  }
  throw new HttpError(405, "method not allowed");
}
