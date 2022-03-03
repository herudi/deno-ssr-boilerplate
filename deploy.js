import{h as V}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{Helmet as jt,renderSSR as Pt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{setup as _t}from"https://cdn.skypack.dev/twind@0.16.16";import{getStyleTag as St,virtualSheet as kt}from"https://cdn.skypack.dev/twind@0.16.16/sheets";import qt from"https://cdn.skypack.dev/@twind/typography@0.0.2";var K=null;function z(t={}){return K??(K=Ht(t))}function Ht(t){let e=kt();return _t({...t,sheet:e,plugins:{...qt()}}),e}var At=({body:t,head:e,footer:s,styleTag:o,clientScript:a,env:n,initData:l,tt:c})=>`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${e.join(`
    `)}
    ${o}
  </head>
  <body>
    <div id="root">${t}</div>
    <script>window.__INIT_DATA__ = ${JSON.stringify(l)}<\/script>${s.join(`
    `)}${n==="development"?'<script src="/assets/js/refresh_client.js"><\/script>':""}<script type="${n==="development"?"module":"application/javascript"}" src="${a+"?v="+c}"><\/script>
  </body>
<html>
`;function S(t,e={}){z(e.tw??{}).reset();let s=Pt(t,e),{body:o,head:a,footer:n}=jt.SSR(s),l=St(z());return new Response(At({...e,body:o,head:a,footer:n,styleTag:l}),{headers:{"content-type":"text/html"},status:e.status||200})}import{NHttp as Qt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";import Xt from"https://deno.land/x/static_files@1.1.6/mod.ts";import{refresh as Zt}from"https://deno.land/x/refresh@1.0.0/mod.ts";import{h as Nt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{h as v,Helmet as Dt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{h as u,Router as Tt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as d}from"https://cdn.skypack.dev/twind@0.16.16";var{Link:L}=Tt,B="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium",F="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";function I({route:t}){return u("nav",{class:d`bg-gray-800 sticky top-0 z-10`},u("div",{class:d`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8`},u("div",{class:d`relative flex items-center justify-between h-16`},u("div",{class:d`flex-1 flex items-center justify-center sm:items-stretch sm:justify-start`},u("div",{class:d`sm:block sm:ml-6`},u("div",{class:d`flex space-x-4`},u(L,{class:d`${t.pathname==="/"?B:F}`,to:"/"},"Home"),u(L,{class:d`${t.pathname.startsWith("/blog")?B:F}`,to:"/blog"},"Blog"),u(L,{class:d`${t.pathname==="/about"?B:F}`,to:"/about"},"About")))))))}import M from"https://esm.sh/nprogress?no-check";function k({Component:t,props:e}){return v("div",null,v(Dt,{head:!0},v("link",{rel:"icon",href:"data:,"}),v("link",{href:"https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.css",rel:"stylesheet"})),v(I,{route:e.route}),v(t,{...e}))}k.onStart=()=>{M.start()};k.onEnd=()=>{M.done()};k.onError=t=>{alert(t.message||"Something went wrong")};var j=k;function Q({Page:t,initData:e,route:s,isServer:o}){return Nt(j,{Component:t,props:{...e,route:s,isServer:o}})}Q.event={onStart:j.onStart,onEnd:j.onEnd,onError:j.onError};var X=Q;import{join as U,resolve as Z,toFileUrl as G}from"https://deno.land/std@0.126.0/path/mod.ts";import{walk as tt}from"https://deno.land/std@0.126.0/fs/walk.ts";var et="95d6aa06f620",st="01a2929d18cf";async function ot(t,e,s){let o=e+"/src/pages",a=!1,n=!1;for(let l=0;l<t.length;l++){let c=t[l],x=(await Deno.stat(U(o,c))).mtime?.getTime();s[c]||(s[c]=x,n||(n=!0)),s[c]!==x&&(s[c]=x,a||(a=!0))}return{storage:s,status:a,new_entry:n}}function rt(t){let e=t.substring(0,t.lastIndexOf("."));return e.endsWith("/index")&&(e=e.substring(0,e.lastIndexOf("/index"))),e===""&&(e="/"),e="/"+e.split("/").reduce((s,o)=>o.startsWith("[...")&&o.endsWith("]")?s+"/:"+o.slice(4,o.length-1)+"*":o.startsWith("[")&&o.endsWith("]")?s+"/:"+o.slice(1,o.length-1):o,""),e}function at(t,e){return e==="page"?`
${t.map((s,o)=>`import $${o} from "../src/pages${s}";`).join(`
`)}
export default [
  ${t.map((s,o)=>`{ 
    path: '${rt(s)}',
    page: $${o}
  },`).join(`
  `)}
];
`:`
import { Router, Handler } from "https://deno.land/x/nhttp@1.1.10/mod.ts";
import { RequestEvent } from "./deps/types.ts";
${t.map((s,o)=>`import $${o} from "../src/pages${s}";`).join(`
`)}
const api = new Router<RequestEvent>();
const map = {} as Record<string, Handler<RequestEvent>>;
  ${t.map((s,o)=>{let a=rt(s);return`
map['${s}'] = $${o};
api.any('${a}', $${o});`}).join(`
  `)}
export default { api, map };
`}async function nt(t=!1,e=Deno.cwd()){try{e=Z(e);let s=JSON.parse(localStorage.getItem(et)||"{}"),o=JSON.parse(localStorage.getItem(st)||"{}"),a=[],n=[],l=U(e,"./src/pages"),c=G(l),Y=tt(l,{includeDirs:!1,includeFiles:!0,exts:["tsx","jsx","ts","js"]});for await(let w of Y)if(w.isFile){let g=G(w.path).href.substring(c.href.length);g.startsWith("/_app.")||(g.startsWith("/api/")?n.push(g):a.push(g))}let x=await ot(a,e,s),_=await ot(n,e,o);if((x.new_entry||x.status||t)&&localStorage.setItem(et,JSON.stringify(x.storage)),(_.new_entry||_.status||t)&&localStorage.setItem(st,JSON.stringify(_.storage)),x.status||t){let w=at(a,"page"),g=e+"/_core/pages.ts";await Deno.writeTextFile(g,w)}if(_.status||t){let w=at(n,"api"),g=e+"/_core/apis.ts";await Deno.writeTextFile(g,w)}}catch(s){return console.log(s),s}}import{h as P,Helmet as Ot}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as it}from"https://cdn.skypack.dev/twind@0.16.16";function lt(t){return P("div",{id:"about"},P(Ot,null,P("title",null,t.title)),P("div",{class:it`bg-white flex h-screen`},P("h1",{class:it`text-5xl text-green-600 m-auto mt-20`},t.title||"loading...")))}lt.initProps=async t=>t.isServer?await t.handler("/api/about.ts"):await(await fetch(t.getBaseUrl()+"/api/about")).json();var pt=lt;import{h as r,Helmet as Wt,Router as Lt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as i}from"https://cdn.skypack.dev/twind@0.16.16";var{Link:mt}=Lt;function ct({data:t}){return r("div",null,r(Wt,{head:!0},r("title",null,"Hello Blog Page")),r("div",{class:i`bg-white min-h-screen`},r("main",{class:i`max-w-5xl mx-auto px-4 pb-28 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl`},r("header",{class:i`pt-10 pb-9 sm:pb-16 sm:text-center`},r("h1",{class:i`mb-4 text-3xl sm:text-4xl tracking-tight font-extrabold`},"Blog"),r("p",{class:i`text-lg`},"Example blog page with dummy data")),r("div",{class:i`space-y-16`},t.map(e=>r("article",{class:i`relative flex flex-col max-w-3xl lg:ml-auto xl:max-w-none xl:w-[50rem]`},r("h3",{class:i`mb-4 text-xl tracking-tight font-bold`},r(mt,{to:"/blog/"+e.title},e.title)),r("div",{class:i`mb-6`},r("p",null,e.body)),r("div",{class:i`mt-auto flex flex-row-reverse items-center justify-end`},r("div",{class:i`text-sm leading-6 lg:absolute lg:top-0 lg:right-full lg:mr-8 lg:whitespace-nowrap`},"January, 12 2030"),r(mt,{to:"/blog/"+e.title,class:i`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Read More"))))))))}ct.initProps=async t=>{let e;return t.isServer?e=await t.handler("/api/blog/index.ts"):(e=await(await fetch(t.getBaseUrl()+"/api/blog")).json(),window.scrollTo(0,0)),{data:e}};var ut=ct;import{h as p,Helmet as Bt,Router as Ft}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as E}from"https://cdn.skypack.dev/twind@0.16.16";var{Link:It}=Ft;function dt({data:t,route:e}){return p("div",null,p(Bt,null,p("title",null,e.params.title)),p("div",{class:E`bg-white flex h-screen`},p("div",{class:E`max-w-5xl mx-auto px-4 pb-28 mt-10 sm:px-6 md:px-8 xl:px-12 xl:max-w-6xl`},p("div",null,p("div",{class:E`text-sm sm:text-center`},"January, 12 2030"),p("h1",{class:E`col-span-full text-3xl sm:text-4xl sm:text-center xl:mb-16 font-extrabold tracking-tight`},e.params.title),p("p",{class:E`mb-20`},t.body),p(It,{to:"/blog",class:E`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Back")))))}dt.initProps=async t=>{let e;return t.isServer?e=await t.handler("/api/blog/[title].ts"):(e=await fetch(t.getBaseUrl()+"/api/blog/"+t.params.title),e=await e.json(),window.scrollTo(0,0)),{data:e[0]||{}}};var ft=dt;import{Component as Ut,h as m,Helmet as Gt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as R}from"https://cdn.skypack.dev/twind@0.16.16";var xt={button:"text-2xl px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100"},gt=class extends Ut{value=0;changeValue(e){this.value+=e,this.update()}render(){return m("div",null,m(Gt,null,m("title",null,"Hello Home")),m("div",{class:R`bg-white flex justify-center h-screen`},m("div",null,m("h3",{class:R`text-5xl text-center mt-20 mb-20 text-gray-600`},"Counter App"),m("div",{class:R`text-center`},m("button",{class:R`${xt.button}`,onClick:()=>this.changeValue(1)},"+"),m("span",{class:R`p-5 text-2xl text-sm font-semibold text-blue-800`},this.value),m("button",{class:R`${xt.button}`,onClick:()=>this.changeValue(-1)},"-")))))}},bt=gt;var J=[{path:"/about",page:pt},{path:"/blog",page:ut},{path:"/blog/:title",page:ft},{path:"/",page:bt}];import{Router as Yt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";import{HttpError as Jt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function q(t){if(t.request.method=="GET")return{title:"Welcome About From Api"};throw new Jt(405,"method not allowed")}import{HttpError as Ct}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function H(t){if(t.request.method=="GET")return await(await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")).json();throw new Ct(405,"method not allowed")}import{HttpError as Vt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function A(t){if(t.request.method=="GET")return await(await fetch(`https://jsonplaceholder.typicode.com/posts?title=${t.params.title}`)).json();throw new Vt(405,"method not allowed")}var T=new Yt,D={};D["/api/about.ts"]=q;T.any("/about",q);D["/api/blog/index.ts"]=H;T.any("/blog",H);D["/api/blog/[title].ts"]=A;T.any("/blog/:title",A);var C={api:T,map:D};import{h as b}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as h}from"https://cdn.skypack.dev/twind@0.16.16";function Kt({message:t}){return b("div",{class:h`flex items-center justify-center w-screen h-screen`},b("div",{class:h`px-40 py-20 bg-white rounded-md`},b("div",{class:h`flex flex-col items-center`},b("h1",{class:h`font-bold text-blue-600 text-9xl`},"404"),b("h6",{class:h`mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`},b("span",{class:"text-red-500"},"Oops!")," Page not found"),b("p",{class:h`mb-8 text-center text-gray-500 md:text-lg`},t||"not found"),b("a",{href:"/",class:h`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Go home"))))}var ht=Kt;import{h as y}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as $}from"https://cdn.skypack.dev/twind@0.16.16";function zt({message:t,status:e}){return y("div",{class:$`flex items-center justify-center w-screen h-screen`},y("div",{class:$`px-40 py-20 bg-white rounded-md`},y("div",{class:$`flex flex-col items-center`},y("h1",{class:$`font-bold text-blue-600 text-9xl`},e||500),y("h6",{class:$`mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`},y("span",{class:"text-red-500"},"Oops!")," Error"),y("p",{class:$`mb-8 text-center text-gray-500 md:text-lg`},t||"something went wrong"))))}var yt=zt;import*as Et from"https://deno.land/x/esbuild@v0.14.22/mod.js";import*as W from"https://esm.sh/esbuild-plugin-import-map?no-check";var Mt={"nano-jsx":"https://deno.land/x/nano_jsx@v0.0.30/mod.ts","nano-jsx-client":"https://cdn.skypack.dev/nano-jsx@v0.0.30",twind:"https://cdn.skypack.dev/twind@0.16.16",nhttp:"https://deno.land/x/nhttp@1.1.10/mod.ts",types:"./_core/deps/types.ts"},N={imports:Mt};var Rt="/assets/hydrates/app.js",te=Date.now(),O=(Deno.args||[]).includes("--dev")?"development":"production",vt,f=new Qt({env:O});if(O==="development"){await nt(),N.imports["nano-jsx"]=N.imports["nano-jsx-client"],W.load(N),await Et.build({jsxFactory:"h",jsxFragment:"Fragment",bundle:!0,format:"esm",loader:{".ts":"ts",".tsx":"tsx"},entryPoints:["./_core/hydrate.tsx"],outfile:"./public/hydrates/app.js",plugins:[W.plugin()]});let t=Zt({paths:"./src/pages/"});f.use((e,s)=>{let o=t(e.request);return o||s()})}f.use("/assets",Xt("public"));f.use((t,e)=>(t.getBaseUrl=()=>new URL(t.request.url).origin,t.isServer=!0,t.env=O,t.pathname=t.path,t.handler=async s=>(s.startsWith("/")||(s="/"+s),await C.map[s](t,e)),t.render=(s,o)=>S(V(X,{isServer:!0,initData:o.initData||{},Page:s,route:{url:t.url,pathname:t.path,path:o.path,params:t.params}}),{clientScript:Rt,env:O,initData:o.initData||{},tt:te}),e()));for(let t=0;t<J.length;t++){let e=J[t];f.get(e.path,async s=>{s.getBaseUrl=()=>new URL(s.request.url).origin;let o=e.page,a=o.initProps?await o.initProps(s):{};return s.render(o,{path:e.path,initData:a})})}vt&&f.get(Rt,({response:t})=>(t.type("application/javascript"),vt.files["deno:///bundle.js"]));f.use("/api",C.api);f.on404(t=>t.path.startsWith("/api/")?{status:404,message:`route ${t.url} not found`}:S(V(ht,{message:`route ${t.url} not found`,status:404}),{status:404}));f.onError((t,e)=>{let s=e.response.status();return e.path.startsWith("/api/")?{status:s,message:t.message}:S(V(yt,{message:t.message,status:s}),{status:s})});var $t=f;$t.listen(8080,()=>{console.log("> running on port 8080")});
