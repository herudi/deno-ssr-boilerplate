/** @jsx h */
import { h, Helmet, tw } from "../deps/client.ts";

function Home() {
  return (
    <div>
      <Helmet>
        <title>Hello Home</title>
      </Helmet>
      <div class={tw`bg-white flex h-screen`}>
        <h1 class={tw`text-5xl m-auto mt-20 text-blue-600`}>
          Hello Home Page
        </h1>
      </div>
    </div>
  );
}

export default Home;
