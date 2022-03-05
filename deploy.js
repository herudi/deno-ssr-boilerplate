var Tt=Object.defineProperty;var J=(t,e)=>()=>(t&&(e=t(t=0)),e);var st=(t,e)=>{for(var s in e)Tt(t,s,{get:e[s],enumerable:!0})};import{join as B,resolve as vt,toFileUrl as P}from"https://deno.land/std@0.126.0/path/mod.ts";import{walk as K}from"https://deno.land/std@0.126.0/fs/walk.ts";var Et=J(()=>{});var jt={};st(jt,{STORAGE_KEY_API:()=>Z,STORAGE_KEY_PAGE:()=>X,genPages:()=>_t,genRoutesWithRefresh:()=>ne,getListPages:()=>ae});async function ae(){let t=Deno.cwd(),e=[],s=B(t,"./src/pages"),o=P(s),r=K(s,{includeDirs:!1,includeFiles:!0,exts:["tsx","jsx","ts","js"]});for await(let a of r)if(a.isFile){let n=P(a.path).href.substring(o.href.length);n.startsWith("/_app.")||n.startsWith("/api/")||e.push("./src/pages"+n)}return e}async function $t(t,e,s){let o=e+"/src/pages",r=!1,a=!1;for(let n=0;n<t.length;n++){let l=t[n],j=(await Deno.stat(B(o,l))).mtime?.getTime();s[l]||(s[l]=j,a||(a=!0)),s[l]!==j&&(s[l]=j,r||(r=!0))}return{storage:s,status:r,new_entry:a}}function M(t){let e=t.substring(0,t.lastIndexOf("."));return e.endsWith("/index")&&(e=e.substring(0,e.lastIndexOf("/index"))),e===""&&(e="/"),e="/"+e.split("/").reduce((s,o)=>o.startsWith("[...")&&o.endsWith("]")?s+"/:"+o.slice(4,o.length-1)+"*":o.startsWith("[")&&o.endsWith("]")?s+"/:"+o.slice(1,o.length-1):o,""),e}function Q(t,e,s){return e==="page"&&s==="development"?`
${t.map((o,r)=>`import $${r} from "../../src/pages${o}";`).join(`
`)}
export const map_pages = [
  ${t.map((o,r)=>`{ 
    path: '${M(o)}',
    page: $${r}
  },`).join(`
  `)}
];
export const tt: string = '${Date.now()}';
`:e==="page"&&s==="production"?`
export const map_pages = [
  ${t.map(o=>{let r=M(o),a=o.replace(".tsx",".js").replace(".jsx",".js");return`{ 
    path: '${r}',
    page: '.${a}'
  },`}).join(`
  `)}
];
export const tt: string = '${Date.now()}';
`:`
import { Router, Handler } from "https://deno.land/x/nhttp@1.1.10/mod.ts";
import { RequestEvent } from "./../deps/types.ts";
${t.map((o,r)=>`import $${r} from "../../src/pages${o}";`).join(`
`)}
const api = new Router<RequestEvent>();
const map = {} as Record<string, Handler<RequestEvent>>;
  ${t.map((o,r)=>{let a=M(o);return`
map['${o}'] = $${r};
api.any('${a}', $${r});`}).join(`
  `)}
export default { api, map };
`}async function _t(t=!1,e="development",s=Deno.cwd()){try{s=vt(s);let o=JSON.parse(localStorage.getItem(X)||"{}"),r=JSON.parse(localStorage.getItem(Z)||"{}"),a=[],n=[],l=B(s,"./src/pages"),S=P(l),j=K(l,{includeDirs:!1,includeFiles:!0,exts:["tsx","jsx","ts","js"]});for await(let E of j)if(E.isFile){let g=P(E.path).href.substring(S.href.length);g.startsWith("/_app.")||(g.startsWith("/api/")?n.push(g):a.push(g))}let q=await $t(a,s,o),H=await $t(n,s,r);if((q.new_entry||q.status||t)&&localStorage.setItem(X,JSON.stringify(q.storage)),(H.new_entry||H.status||t)&&localStorage.setItem(Z,JSON.stringify(H.storage)),q.status||t){let E=Q(a,"page",e),g=s+"/_core/result/pages.ts";if(await Deno.writeTextFile(g,E),e==="production"){let kt=Q(a,"page","development"),Dt=s+"/_core/result/server_pages.ts";await Deno.writeTextFile(Dt,kt)}}if(H.status||t){let E=Q(n,"api",e),g=s+"/_core/result/apis.ts";await Deno.writeTextFile(g,E)}}catch(o){return console.log(o),o}}async function ne(t){return localStorage.clear(),await _t(!0,t)}var X,Z,Rt=J(()=>{Et();X="95d6aa06f620",Z="01a2929d18cf"});var Pt={};st(Pt,{map_pages:()=>ie,tt:()=>le});var ie,le,St=J(()=>{ie=[{path:"/about",page:"./about.js"},{path:"/blog",page:"./blog/index.js"},{path:"/blog/:title",page:"./blog/[title].js"},{path:"/",page:"./index.js"}],le="1646459445238"});import{h as et}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{Helmet as At,renderSSR as Ot}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{setup as Wt}from"https://cdn.skypack.dev/twind@0.16.16";import{getStyleTag as Ft,virtualSheet as Lt}from"https://cdn.skypack.dev/twind@0.16.16/sheets";import Nt from"https://cdn.skypack.dev/@twind/typography@0.0.2";var ot=null;function rt(t={}){return ot??(ot=Bt(t))}function Bt(t){let e=Lt();return Wt({...t,sheet:e,plugins:{...Nt()}}),e}var It=({body:t,attributes:e,head:s,footer:o,styleTag:r,clientScript:a,env:n,initData:l,tt:S})=>`<!DOCTYPE html>
<html ${e.html.toString()}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${s.join(`
    `)}
    ${r}
  </head>
  ${e.body.size===0?"<body>":`<body ${e.body.toString()}>`}
    <div id="root">${t}</div>
    ${l!==void 0?`<script id="__INIT_DATA__" type="application/json">${JSON.stringify(l)}<\/script>`:""}${o.join(`
    `)}${n==="development"?'<script src="/assets/js/refresh_client.js"><\/script>':""}<script type="module" src="${a+"?v="+S}"><\/script>
  </body>
<html>
`;function k(t,e={}){rt(e.tw??{}).reset();let s=Ot(t,e),{body:o,head:r,footer:a,attributes:n}=At.SSR(s),l=Ft(rt());return new Response(It({...e,body:o,head:r,footer:a,styleTag:l,attributes:n}),{headers:{"content-type":"text/html"},status:e.status||200})}import{NHttp as pe}from"https://deno.land/x/nhttp@1.1.10/mod.ts";import me from"https://deno.land/x/static_files@1.1.6/mod.ts";import{h as Ut}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{h,Helmet as Jt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{h as c,Router as Gt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as u}from"https://cdn.skypack.dev/twind@0.16.16";var{Link:U}=Gt,C="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium",D="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";function V({route:t}){return c("nav",{class:u`bg-gray-800 sticky top-0 z-10`},c("div",{class:u`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8`},c("div",{class:u`relative flex items-center justify-between h-16`},c("div",{class:u`flex-1 flex items-center justify-center sm:items-stretch sm:justify-start`},c("div",{class:u`sm:block sm:ml-6`},c("div",{class:u`flex space-x-4`},c(U,{class:u`${t.pathname==="/"?C:D}`,to:"/"},"Home"),c(U,{class:u`${t.pathname.startsWith("/blog")?C:D}`,to:"/blog"},"Blog"),c(U,{class:u`${t.pathname==="/about"?C:D}`,to:"/about"},"About")))),c("div",{class:"absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"},c("a",{class:u`${D}`,href:"https://github.com/herudi/deno-ssr-boilerplate",target:"__blank"},"Github")))))}import at from"https://esm.sh/nprogress?no-check";function T({Component:t,props:e}){return h("div",null,h(Jt,null,h("html",{lang:"en"}),h("link",{rel:"icon",href:"data:,"}),h("link",{href:"https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.css",rel:"stylesheet"})),h(V,{route:e.route}),h(t,{...e}))}var Y;T.onStart=()=>{Y=setTimeout(()=>{at.start()},300)};T.onEnd=()=>{Y&&clearTimeout(Y),at.done()};T.onError=t=>{console.error(t)};var R=T;function nt({Page:t,initData:e,route:s,isServer:o}){return Ut(R,{Component:t,props:{...e,route:s,isServer:o}})}nt.event={onStart:R.onStart,onEnd:R.onEnd,onError:R.onError};var it=nt;import{h as y,Helmet as Ct}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as A}from"https://cdn.skypack.dev/twind@0.16.16";function lt(t){return y("div",{id:"about"},y(Ct,null,y("title",null,t.title)),y("div",{class:A`bg-white flex h-screen`},y("div",{class:A`text-center mt-20 mb-10 m-auto text-gray-600`},y("h3",{class:A`text-5xl`},t.title),y("p",{class:A`text-2xl`},"This about from api/handler."))))}lt.initProps=async t=>t.isServer?await t.handler("/api/about.ts"):await(await fetch(t.getBaseUrl()+"/api/about")).json();var pt=lt;import{h as i,Helmet as Vt,Router as Yt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as p}from"https://cdn.skypack.dev/twind@0.16.16";var{Link:mt}=Yt;function ct({data:t}){return i("div",null,i(Vt,null,i("title",null,"Hello Blog Page")),i("div",{class:p`bg-white min-h-screen`},i("main",{class:p`max-w-5xl mx-auto px-4 pb-28 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl`},i("header",{class:p`pt-10 pb-9 sm:pb-16 sm:text-center`},i("h1",{class:p`mb-4 text-3xl sm:text-4xl tracking-tight font-extrabold`},"Blog"),i("p",{class:p`text-lg`},"Example blog page with dummy data")),i("div",{class:p`space-y-16`},t.map(e=>i("article",{class:p`relative flex flex-col max-w-3xl lg:ml-auto xl:max-w-none xl:w-[50rem]`},i("h3",{class:p`mb-4 text-xl tracking-tight font-bold`},i(mt,{to:"/blog/"+e.title},e.title)),i("div",{class:p`mb-6`},i("p",null,e.body)),i("div",{class:p`mt-auto flex flex-row-reverse items-center justify-end`},i("div",{class:p`text-sm leading-6 lg:absolute lg:top-0 lg:right-full lg:mr-8 lg:whitespace-nowrap`},"January, 12 2030"),i(mt,{to:"/blog/"+e.title,class:p`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Read More"))))))))}ct.initProps=async t=>{let e;return t.isServer?e=await t.handler("/api/blog/index.ts"):(e=await(await fetch(t.getBaseUrl()+"/api/blog")).json(),window.scrollTo(0,0)),{data:e}};var ut=ct;import{h as d,Helmet as zt,Router as Kt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as $}from"https://cdn.skypack.dev/twind@0.16.16";var{Link:Mt}=Kt;function dt({data:t,route:e}){return d("div",null,d(zt,null,d("title",null,e.params.title)),d("div",{class:$`bg-white flex h-screen`},d("div",{class:$`max-w-5xl mx-auto px-4 pb-28 mt-10 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl`},d("div",null,d("div",{class:$`text-sm sm:text-center`},"January, 12 2030"),d("h1",{class:$`col-span-full text-3xl sm:text-4xl sm:text-center xl:mb-16 font-extrabold tracking-tight`},e.params.title),d("p",{class:$`mb-20`},t.body),d(Mt,{to:"/blog",class:$`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Back")))))}dt.initProps=async t=>{let e;return t.isServer?e=await t.handler("/api/blog/[title].ts"):(e=await fetch(t.getBaseUrl()+"/api/blog/"+t.params.title),e=await e.json(),window.scrollTo(0,0)),{data:e[0]||{}}};var ft=dt;import{Component as Qt,h as m,Helmet as Xt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as x}from"https://cdn.skypack.dev/twind@0.16.16";var gt={button:"text-2xl px-6 py-2 text-sm font-semibold text-white bg-gray-800"},xt=class extends Qt{constructor(){super(...arguments);this.value=0}changeValue(e){this.value+=e,this.update()}render(){return m("div",null,m(Xt,null,m("title",null,"Hello Home Page")),m("div",{class:x`bg-white flex justify-center h-screen`},m("div",null,m("div",{class:x`text-center mt-20 mb-10 text-gray-600`},m("h3",{class:x`text-5xl`},"Welcome Home"),m("p",{class:x`text-2xl`},"Example Counter App")),m("div",{class:x`text-center`},m("button",{class:x`${gt.button}`,onClick:()=>this.changeValue(1)},"+"),m("span",{class:x`p-5 text-2xl text-sm font-bold text-blue-800`},this.value),m("button",{class:x`${gt.button}`,onClick:()=>this.changeValue(-1)},"-")))))}},bt=xt;var ht=[{path:"/about",page:pt},{path:"/blog",page:ut},{path:"/blog/:title",page:ft},{path:"/",page:bt}];import{Router as se}from"https://deno.land/x/nhttp@1.1.10/mod.ts";import{HttpError as Zt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function O(t){if(t.request.method=="GET")return{title:"Welcome About From Api"};throw new Zt(405,"method not allowed")}import{HttpError as te}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function W(t){if(t.request.method=="GET")return await(await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")).json();throw new te(405,"method not allowed")}import{HttpError as ee}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function F(t){if(t.request.method=="GET")return await(await fetch(`https://jsonplaceholder.typicode.com/posts?title=${t.params.title}`)).json();throw new ee(405,"method not allowed")}var L=new se,N={};N["/api/about.ts"]=O;L.any("/about",O);N["/api/blog/index.ts"]=W;L.any("/blog",W);N["/api/blog/[title].ts"]=F;L.any("/blog/:title",F);var z={api:L,map:N};import{h as b}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as w}from"https://cdn.skypack.dev/twind@0.16.16";function oe({message:t}){return b("div",{class:w`flex items-center justify-center w-screen h-screen`},b("div",{class:w`px-40 py-20 bg-white rounded-md`},b("div",{class:w`flex flex-col items-center`},b("h1",{class:w`font-bold text-blue-600 text-9xl`},"404"),b("h6",{class:w`mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`},b("span",{class:"text-red-500"},"Oops!")," Page not found"),b("p",{class:w`mb-8 text-center text-gray-500 md:text-lg`},t||"not found"),b("a",{href:"/",class:w`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Go home"))))}var yt=oe;import{h as v}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as _}from"https://cdn.skypack.dev/twind@0.16.16";function re({message:t,status:e}){return v("div",{class:_`flex items-center justify-center w-screen h-screen`},v("div",{class:_`px-40 py-20 bg-white rounded-md`},v("div",{class:_`flex flex-col items-center`},v("h1",{class:_`font-bold text-blue-600 text-9xl`},e||500),v("h6",{class:_`mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`},v("span",{class:"text-red-500"},"Oops!")," Error"),v("p",{class:_`mb-8 text-center text-gray-500 md:text-lg`},t||"something went wrong"))))}var wt=re;var qt="/assets/pages/_app.js",ce=Date.now(),I=(Deno.args||[]).includes("--dev")?"development":"production",tt,G=[],f=new pe({env:I});if(I==="development"){let{genPages:t}=await Promise.resolve().then(()=>(Rt(),jt)),{map_pages:e}=await Promise.resolve().then(()=>(St(),Pt)),{refresh:s}=await import("https://deno.land/x/refresh@1.0.0/mod.ts");G=e;try{await Deno.remove(Deno.cwd()+"/public/pages",{recursive:!0})}catch{}await t();let o={check:!1,bundle:"module",compilerOptions:{lib:["dom","dom.iterable","esnext"],jsxFactory:"h",jsxFragmentFactory:"Fragment"},importMapPath:"./import_map.json"};tt=await Deno.emit("./_core/tsx/hydrate.tsx",o);let r=s({paths:"./src/pages/"});f.use((a,n)=>{let l=r(a.request);return l||n()})}else G=ht;f.use("/assets",me("public"));f.use((t,e)=>(t.getBaseUrl=()=>new URL(t.request.url).origin,t.isServer=!0,t.env=I,t.pathname=t.path,t.handler=async s=>(s.startsWith("/")||(s="/"+s),await z.map[s](t,e)),t.render=(s,o)=>k(et(it,{isServer:!0,initData:o.initData,Page:s,route:{url:t.url,pathname:t.path,path:o.path,params:t.params}}),{clientScript:qt,env:I,initData:o.initData,tt:ce}),e()));for(let t=0;t<G.length;t++){let e=G[t];f.get(e.path,async s=>{let o=e.page,r=o.initProps?await o.initProps(s):void 0;return s.render(o,{path:e.path,initData:r})})}tt&&f.get(qt,({response:t})=>(t.type("application/javascript"),tt.files["deno:///bundle.js"]));f.use("/api",z.api);f.on404(t=>t.path.startsWith("/api/")?{status:404,message:`route ${t.url} not found`}:k(et(yt,{message:`route ${t.url} not found`,status:404}),{status:404}));f.onError((t,e)=>{let s=e.response.status();return e.path.startsWith("/api/")?{status:s,message:t.message}:k(et(wt,{message:t.message,status:s}),{status:s})});var Ht=f;Ht.listen(8080,()=>{console.log("> running on port 8080")});
