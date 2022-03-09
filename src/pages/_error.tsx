/** @jsx h */
import { h, Helmet } from "nano-jsx";
import { tw } from "twind";

function ErrorPage(
  { message = "something went wrong", status = 500 }: {
    message: string;
    status: number;
  },
) {
  return (
    <div>
      <Helmet>
        <title>{status} {message}</title>
      </Helmet>
      <div class={tw`flex items-center justify-center w-screen h-screen`}>
        <div class={tw`px-40 py-20 bg-white rounded-md`}>
          <div class={tw`flex flex-col items-center`}>
            <h1 class={tw`font-bold text-blue-600 text-9xl`}>{status}</h1>
            <h6
              class={tw
                `mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`}
            >
              <span class={`text-red-500`}>Oops!</span> Error
            </h6>
            <p class={tw`mb-8 text-center text-gray-500 md:text-lg`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
