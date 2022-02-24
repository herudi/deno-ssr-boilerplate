/** @jsx h */
import { h, Helmet, PageProps, RequestEvent, tw } from "../deps/client.ts";

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

About.getInitProps = async (rev: RequestEvent) => {
  return await (await fetch(rev.getBaseUrl() + "/api/about")).json();
};

export default About;
