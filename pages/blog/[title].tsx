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

function BlogTitle({ data, isClient }: PageProps) {
  if (isClient) {
    console.log("client");
    window.scrollTo(0, 0);
  }
  return (
    <div>
      <Helmet>
        <title>{(data || {}).title || ""}</title>
      </Helmet>
      <div class={tw`bg-white flex h-screen`}>
        <div class={tw`mx-40 px-4 pb-28 sm:mt-16 sm:px-6 md:px-8 xl:px-12`}>
          {data && (
            <div>
              <div
                class={tw
                  `relative max-w-3xl mx-auto xl:max-w-none xl:grid xl:grid-cols-[1fr_50rem] xl:gap-x-8`}
              >
                <div class={tw`text-sm sm:text-center`}>
                  January, 12 2030
                </div>
                <h1
                  class={tw
                    `col-span-full text-3xl sm:text-4xl sm:text-center xl:mb-16 font-extrabold tracking-tight`}
                >
                  {data.title}
                </h1>
              </div>
              <p class={tw`mb-20`}>{data.body}</p>
              <Link
                to={"/blog"}
                class={tw
                  `px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`}
              >
                Back
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

BlogTitle.getInitProps = async (rev: RequestEvent) => {
  if (!rev.isServer) NProgress.start();
  const data =
    await (await fetch(rev.getBaseUrl() + "/api/blog/" + rev.params.title))
      .json();
  if (!rev.isServer) NProgress.done();
  return { data: data[0] || {}, isClient: !rev.isServer };
};

export default BlogTitle;
