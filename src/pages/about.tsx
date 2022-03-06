/** @jsx h */
import { h, Helmet } from "nano-jsx";
import { tw } from "twind";
import { PageProps, RequestEvent } from "types";

function About(props: PageProps) {
  return (
    <div>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <div class={tw`bg-white flex h-screen`}>
        <div class={tw`text-center mt-20 mb-10 m-auto text-gray-600`}>
          <h3 class={tw`text-5xl`}>
            {props.title}
          </h3>
          <p class={tw`text-2xl`}>This about from api/handler.</p>
        </div>
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
