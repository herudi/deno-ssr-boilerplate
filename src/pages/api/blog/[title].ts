import { HttpError } from "nhttp";
import { RequestEvent } from "types";

export default async function handler(rev: RequestEvent) {
  if (rev.request.method == "GET") {
    return await (await fetch(
      `https://jsonplaceholder.typicode.com/posts?title=${rev.params.title}`,
    )).json();
  }
  throw new HttpError(405, "method not allowed");
}