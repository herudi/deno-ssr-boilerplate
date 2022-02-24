## Deno SSR Boilerplate

[Nextjs](https://nextjs.org/) like, (dynamic routes page and api), boilerplate
for [Deno](https://deno.land) that uses [nanojsx](https://nanojsx.io/).

Demo => https://deno-ssr-boilerplate.deno.dev

## Features

- Pure Deno Ecosystem.
- Dynamic routes page and api/handler.
- Tailwind out of the box.

## Includes

- [nanojsx](https://nanojsx.io/)
- [nanossr](https://crux.land/nanossr@0.0.1)
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
deno run -A --no-check dev.ts
```

Open => http://localhost:8080/

### Build Production

```bash
deno run -A --no-check build.ts
```

### Run Production

```bash
deno run -A --no-check server.ts
```

### Example Code

```ts
/** @jsx h */
import { h, Helmet, PageProps, RequestEvent, tw } from "../deps/client.ts";

function About(props: PageProps) {
  return (
    <div>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <div class={tw`bg-white flex h-screen`}>
        <h1 class={tw`text-5xl text-green-600 m-auto mt-20`}>
          {props.title || "loading..."}
        </h1>
      </div>
    </div>
  );
}

// ssr first
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

### Note

It's Fun Project, PRs Welcome.
