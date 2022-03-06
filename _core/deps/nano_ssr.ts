// from https://crux.land/nanossr@0.0.1
// update : head.join("\n"), hydrate and more.

import { Helmet, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.30/mod.ts";
import { setup } from "https://cdn.skypack.dev/twind@0.16.16";
import {
  getStyleTag,
  virtualSheet,
} from "https://cdn.skypack.dev/twind@0.16.16/sheets";
import typography from "https://cdn.skypack.dev/@twind/typography@0.0.2";

let SHEET_SINGLETON: any = null;
function sheet(twOptions = {}) {
  return SHEET_SINGLETON ?? (SHEET_SINGLETON = setupSheet(twOptions));
}

// Setup TW sheet singleton
function setupSheet(twOptions: Record<string, any>) {
  const sheet = virtualSheet();
  setup({ ...twOptions, sheet, plugins: { ...typography() } });
  return sheet;
}

const html = (
  { body, attributes, head, footer, styleTag, clientScript, env, initData, tt }:
    any,
) => (`<!DOCTYPE html>
<html ${attributes.html.toString()}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join("\n    ")}
    ${styleTag}
  </head>
  ${
  attributes.body.size === 0 ? "<body>" : `<body ${attributes.body.toString()}>`
}
    <div id="root">${body}</div>
    ${
  initData !== void 0
    ? `<script id="__INIT_DATA__" type="application/json">${
      JSON.stringify(initData)
    }</script>`
    : ""
}${footer.join("\n    ")}${
  env === "development"
    ? '<script src="/assets/js/refresh_client.js"></script>'
    : ""
}${
  clientScript
    ? `<script type="module" src="${clientScript + "?v=" + tt}"></script>`
    : ""
}
  </body>
<html>
`);

export function ssr(Component: any, opts: Record<string, any> = {}) {
  sheet(opts.tw ?? {}).reset();
  const app = renderSSR(Component, opts);
  const { body, head, footer, attributes } = Helmet.SSR(app);
  const styleTag = getStyleTag(sheet());
  return new Response(
    html({ ...opts, body, head, footer, styleTag, attributes }),
    { headers: { "content-type": "text/html" }, status: opts.status || 200 },
  );
}
