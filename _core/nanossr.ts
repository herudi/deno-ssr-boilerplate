// from https://crux.land/nanossr@0.0.1
// update : head.join("\n") and status

export * from "https://cdn.skypack.dev/nano-jsx@v0.0.30-dev.1?dts";
export { tw } from "https://cdn.skypack.dev/twind@0.16.16";

import {
  Helmet,
  renderSSR as nanoRender,
} from "https://cdn.skypack.dev/nano-jsx@v0.0.30-dev.1?dts";
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

const html = ({ body, head, footer, styleTag }: any) => (`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join("\n    ")}
    ${styleTag}
  </head>
  <body>
    ${body}
    ${footer.join("\n    ")}
  </body>
<html>
`);

export function ssr(Component: any, options?: any, status = 200) {
  sheet(options?.tw ?? {}).reset();
  const app = nanoRender(Component, options);
  const { body, head, footer } = Helmet.SSR(app);
  const styleTag = getStyleTag(sheet());
  return new Response(
    html({ body, head, footer, styleTag }),
    { headers: { "content-type": "text/html" }, status },
  );
}
