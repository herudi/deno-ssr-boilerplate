/** @jsx h */
import { Component, h, Helmet, Router } from "nano-jsx";
import { tw } from "twind";
import { PageProps, RequestEvent } from "types";
import ErrorPage from "../_error.tsx";

const { Link } = Router;

class BlogDetail extends Component<PageProps> {
  static async initProps({ fetchApi, params }: RequestEvent) {
    const { data, error } = await fetchApi("/api/blog/" + params.title);
    return { data, error };
  }

  didMount() {
    window.scrollTo(0, 0);
  }

  render() {
    if (this.props.error) return <ErrorPage {...this.props.error} />;
    const route = this.props.route;
    return (
      <div>
        <Helmet>
          <title>{route.params.title}</title>
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
                {route.params.title}
              </h1>
              <p class={tw`mb-20`}>{this.props.data.body}</p>
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
}

export default BlogDetail;
