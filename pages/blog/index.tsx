/** @jsx h */
import {
  h,
  Helmet,
  Link,
  PageProps,
  RequestEvent,
  tw,
} from "../../deps/client.ts";
import NProgress from "https://esm.sh/nprogress?no-check";

function Blog(props: PageProps) {
  if (props.isClient) {
    window.scrollTo(0, 0);
  }
  return (
    <div>
      <Helmet head>
        <title>Hello Blog Page</title>
      </Helmet>
      <div class={tw`bg-white min-h-screen`}>
        <main
          class={tw
            `max-w-5xl mx-auto px-4 pb-28 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl`}
        >
          <header class={tw`pt-10 pb-9 sm:pb-16 sm:text-center`}>
            <h1
              class={tw
                `mb-4 text-3xl sm:text-4xl tracking-tight font-extrabold`}
            >
              Blog
            </h1>
            <p class={tw`text-lg`}>
              Example blog page with dummy data
            </p>
          </header>
          <div class={tw`space-y-16`}>
            {props.data &&
              props.data.map((el: any) => (
                <article
                  class={tw
                    `relative flex flex-col max-w-3xl lg:ml-auto xl:max-w-none xl:w-[50rem]`}
                >
                  <h3 class={tw`mb-4 text-xl tracking-tight font-bold`}>
                    <Link to={"/blog/" + el.title}>{el.title}</Link>
                  </h3>
                  <div class={tw`mb-6`}>
                    <p>{el.body}</p>
                  </div>
                  <div
                    class={tw
                      `mt-auto flex flex-row-reverse items-center justify-end`}
                  >
                    <div
                      class={tw
                        `text-sm leading-6 lg:absolute lg:top-0 lg:right-full lg:mr-8 lg:whitespace-nowrap`}
                    >
                      January, 12 2030
                    </div>
                    <Link
                      to={"/blog/" + el.title}
                      class={tw
                        `px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`}
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

Blog.getInitProps = async (rev: RequestEvent) => {
  if (!rev.isServer) NProgress.start();
console.log(rev.getBaseUrl() + "/api/blog");
  const data = await (await fetch(rev.getBaseUrl() + "/api/blog")).json();
  if (!rev.isServer) NProgress.done();
  return { data, isClient: !rev.isServer };
};

export default Blog;
