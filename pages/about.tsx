/** @jsx h */
import { h, Helmet } from "deps/nano_jsx.ts";
import { PageProps, RequestEvent } from "deps/types.ts";
import { tw } from "deps/twind.ts";

function About(props: PageProps) {
  return (
    <div>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <div class={tw`bg-white flex h-screen`}>
        <h1 class={tw`text-5xl text-green-600 m-auto mt-20`}>
          {props.title || "loading..."}
        </h1>
      </div>
    </div>
  );
}

About.initProps = async (rev: RequestEvent) => {
  if (rev.isServer) {
    return await rev.handler("/api/about.ts");
  }
  return await (await fetch(rev.getBaseUrl() + "/api/about")).json();
};

export default About;
