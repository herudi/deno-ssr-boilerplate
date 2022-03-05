## Deno SSR Boilerplate

[Nextjs](https://nextjs.org/) like, (dynamic routes page and api), boilerplate
for [Deno](https://deno.land) that uses [nanojsx](https://nanojsx.io/).

Demo => https://deno-ssr-boilerplate.deno.dev

## Features

- Support for [Deno Deploy](https://deno.com/deploy) and
  [Deno](https://deno.land).
- Dynamic routes page and api/handler.
- Tailwind out of the box.
- Hot Reloading.

## Includes

- [nanojsx](https://nanojsx.io/)
- [twind](https://twind.dev/)
- [nhttp](https://nhttp.deno.dev)
- [refresh](https://deno.land/x/refresh)
- more

## Usage

```bash
git clone https://github.com/herudi/deno-ssr-boilerplate.git
cd deno-ssr-boilerplate
```

### Run Development

```bash
deno run -A --no-check script.ts --dev
```

Open => http://localhost:8080/

### Build Production

```bash
deno run -A --no-check script.ts --build
```

### Run Production

```bash
deno run -A --no-check deploy.js
```

Generate deploy.js and ready to deploy to [Deno Deploy](https://deno.com/deploy)

### Example Code

File : /src/pages/about.tsx

```tsx
/** @jsx h */
import { h, Helmet } from "nano-jsx";
import { tw } from "twind";
import { PageProps, RequestEvent } from "types";

function About(props: PageProps) {
  return (
    <div>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <div class={tw`bg-white flex h-screen`}>
        <h1 class={tw`text-5xl text-green-600 m-auto mt-20`}>
          {props.title}
        </h1>
      </div>
    </div>
  );
}

// ssr first (optionals)
About.initProps = async (rev: RequestEvent) => {
  if (rev.isServer) {
    // don't fetch self server :). use handler instead.
    return await rev.handler("/api/about.ts");
  }
  // normal fetch if client-side
  return await (await fetch(rev.getBaseUrl() + "/api/about")).json();
};

export default About;
```

File : /src/pages/api/about.ts

```ts
import { HttpError } from "nhttp";
import { RequestEvent } from "types";

export default async function handler(rev: RequestEvent) {
  if (rev.request.method == "GET") {
    // some code here

    return { title: "Welcome About From Api" };
  }
  throw new HttpError(405, "method not allowed");
}
```

### Note

It's Fun Project, PRs Welcome.
