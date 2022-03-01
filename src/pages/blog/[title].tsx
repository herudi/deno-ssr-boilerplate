/** @jsx h */
import { h, Helmet, Router, tw } from "nano_jsx";
import { PageProps, RequestEvent } from "types";
import NProgress from "https://esm.sh/nprogress?no-check";
import Loading from "../../components/loading.tsx";

const { Link } = Router;

function BlogDetail({ data, params }: PageProps) {
  if (!data) return <Loading />;
  return (
    <div>
      <Helmet>
        <title>{params.title}</title>
      </Helmet>
      <div class={tw`bg-white flex h-screen`}>
        <div
          class={tw
            `max-w-5xl mx-auto px-4 pb-28 mt-10 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl`}
        >
          <div>
            <div class={tw`text-sm sm:text-center`}>
              January, 12 2030
            </div>
            <h1
              class={tw
                `col-span-full text-3xl sm:text-4xl sm:text-center xl:mb-16 font-extrabold tracking-tight`}
            >
              {params.title}
            </h1>
            <p class={tw`mb-20`}>{data.body}</p>
            <Link
              to={"/blog"}
              class={tw
                `px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`}
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

BlogDetail.initProps = async (rev: RequestEvent) => {
  let data;
  if (rev.isServer) {
    data = await rev.handler("/api/blog/[title].ts");
  } else {
    NProgress.start();
    data = await fetch(rev.getBaseUrl() + "/api/blog/" + rev.params.title);
    data = await data.json();
    NProgress.done();
    window.scrollTo(0, 0);
  }
  return { data: data[0] || {}, params: rev.params };
};

export default BlogDetail;