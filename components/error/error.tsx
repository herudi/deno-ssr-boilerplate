/** @jsx h */
import { h } from "deps/nano_jsx.ts";
import { tw } from "deps/twind.ts";

function ErrorPage({ message, status }: any) {
  return (
    <div class={tw`flex items-center justify-center w-screen h-screen`}>
      <div class={tw`px-40 py-20 bg-white rounded-md`}>
        <div class={tw`flex flex-col items-center`}>
          <h1 class={tw`font-bold text-blue-600 text-9xl`}>{status || 500}</h1>
          <h6
            class={tw
              `mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`}
          >
            <span class={`text-red-500`}>Oops!</span> Error
          </h6>
          <p class={tw`mb-8 text-center text-gray-500 md:text-lg`}>
            {message || "something went wrong"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
