// from https://crux.land/nanossr@0.0.1
// update : nano_jsx@v0.0.29 and head.join("\n")

export * from "https://deno.land/x/nano_jsx@v0.0.29/mod.ts";
export { tw } from "https://cdn.skypack.dev/twind@0.16.16";

import {
  Helmet,
  renderSSR as nanoRender,
} from "https://deno.land/x/nano_jsx@v0.0.29/mod.ts";
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

const html = ({ body, head, footer, styleTag, attributes }: any) => (`
<!DOCTYPE html>
<html ${attributes.html.toString()}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join("\n")}
    ${styleTag}
  </head>
  <body>
    ${body}
    ${footer.join("\n")}
  </body>
<html>
`);

export function ssr(render: CallableFunction, options?: any, status = 200) {
  sheet(options?.tw ?? {}).reset();
  const app = nanoRender(render(), options);
  const { body, head, footer, attributes } = Helmet.SSR(app);
  const styleTag = getStyleTag(sheet());
  return new Response(
    html({ body, head, footer, styleTag, attributes }),
    { headers: { "content-type": "text/html" }, status },
  );
}
