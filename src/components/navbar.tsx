/** @jsx h */
import { h, Router } from "nano-jsx";
import { tw } from "twind";

const { Link } = Router;

const active =
  "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
const in_active =
  "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

export default function Navbar({ route }: any) {
  return (
    <nav class={tw`bg-gray-800 sticky top-0 z-10`}>
      <div class={tw`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8`}>
        <div class={tw`relative flex items-center justify-between h-16`}>
          <div
            class={tw
              `flex-1 flex items-center justify-center sm:items-stretch sm:justify-start`}
          >
            <div class={tw`sm:block sm:ml-6`}>
              <div class={tw`flex space-x-4`}>
                <Link
                  class={tw`${route.pathname === "/" ? active : in_active}`}
                  to="/"
                >
                  Home
                </Link>
                <Link
                  class={tw`${
                    route.pathname.startsWith("/blog") ? active : in_active
                  }`}
                  to="/blog"
                >
                  Blog
                </Link>
                <Link
                  class={tw`${
                    route.pathname === "/about" ? active : in_active
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <a
              class={tw`${in_active}`}
              href="https://github.com/herudi/deno-ssr-boilerplate"
              target="__blank"
            >
              Github
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
