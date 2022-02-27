/** @jsx h */
import { h } from "deps/nano_jsx.ts";
import { tw } from "deps/twind.ts";

function Error404({ message }: any) {
  return (
    <div class={tw`flex items-center justify-center w-screen h-screen`}>
      <div class={tw`px-40 py-20 bg-white rounded-md`}>
        <div class={tw`flex flex-col items-center`}>
          <h1 class={tw`font-bold text-blue-600 text-9xl`}>404</h1>
          <h6
            class={tw
              `mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`}
          >
            <span class={`text-red-500`}>Oops!</span> Page not found
          </h6>
          <p class={tw`mb-8 text-center text-gray-500 md:text-lg`}>
            {message || "not found"}
          </p>
          <a
            href="/"
            class={tw
              `px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export default Error404;
