/** @jsx h */
import { h, tw } from "nano_jsx";

export default function Loading() {
  return (
    <div class={tw`bg-white min-h-screen`}>
      <h1 class={tw`text-center mt-20 mb-4 text-3xl sm:text-4xl`}>
        Loading...
      </h1>
    </div>
  );
}
