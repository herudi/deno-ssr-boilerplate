/** @jsx h */
import { Component, h, Helmet } from "nano-jsx";
import { tw } from "twind";
import { PageProps, RequestEvent } from "types";

const style = {
  input:
    "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
};

class Sign extends Component<PageProps> {
  // apply SignPage methods GET and POST (default ["GET"]).
  static methods = ["GET", "POST"];

  static async initProps(rev: RequestEvent) {
    if (rev.isServer && rev.request.method === "POST") {
      const { data } = await rev.fetchApi("/api/sign");
      if (data.message === "success") {
        // if success will redirect to home
        return rev.response.redirect("/");
      }
      return { message: data.message };
    }
    return {};
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Sign Page</title>
        </Helmet>
        <div
          class={tw
            `min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}
        >
          <div class={tw`max-w-sm w-full space-y-8`}>
            <div>
              <h2
                class={tw
                  `mt-6 text-center text-3xl font-extrabold text-gray-900`}
              >
                Sign Page
              </h2>
              <p class={tw`text-center`}>(Example handle form with POST)</p>
              {this.props.message && (
                <div
                  class={tw
                    `mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`}
                  role="alert"
                >
                  <strong class={tw`font-bold`}>Error</strong>
                  <span class={tw`block sm:inline`}>{this.props.message}</span>
                  <span class={tw`absolute top-0 bottom-0 right-0 px-4 py-3`}>
                    <svg
                      class={tw`fill-current h-6 w-6 text-red-500`}
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </span>
                </div>
              )}
              <form class={tw`mt-8 space-y-6`} action="/sign" method="POST">
                <div class={tw`rounded-md shadow-sm -space-y-px`}>
                  <div>
                    <label class={tw`sr-only`}>Username</label>
                    <input
                      name="username"
                      type="text"
                      class={tw`${style.input}`}
                      placeholder="Username = deno"
                      requied
                    />
                  </div>
                  <div>
                    <label class={tw`sr-only`}>Password</label>
                    <input
                      name="password"
                      type="password"
                      class={tw`${style.input}`}
                      placeholder="Password = deno"
                      requied
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    class={tw
                      `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sign;
