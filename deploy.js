import{h as U}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{Helmet as at,renderSSR as it}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{setup as pt}from"https://cdn.skypack.dev/twind@0.16.16";import{getStyleTag as lt,virtualSheet as ct}from"https://cdn.skypack.dev/twind@0.16.16/sheets";import mt from"https://cdn.skypack.dev/@twind/typography@0.0.2";var B=null;function Y(t={}){return B??(B=ut(t))}function ut(t){let e=ct();return pt({...t,sheet:e,plugins:{...mt()}}),e}var ft=({body:t,head:e,footer:s,styleTag:r,clientScript:o,env:n,initData:a,tt:i})=>`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${e.join(`
    `)}
    ${r}
  </head>
  <body>
    <div id="root">${t}</div>
    <script>window.__INIT_DATA__ = ${JSON.stringify(a)}<\/script>${s.join(`
    `)}${n==="development"?'<script src="/assets/js/refresh_client.js"><\/script>':""}<script type="module" src="${o+"?v="+i}"><\/script>
  </body>
<html>
`;function v(t,e={}){Y(e.tw??{}).reset();let s=it(t,e),{body:r,head:o,footer:n}=at.SSR(s),a=lt(Y());return new Response(ft({...e,body:r,head:o,footer:n,styleTag:a}),{headers:{"content-type":"text/html"},status:e.status||200})}import{NHttp as vt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";import Et from"https://deno.land/x/static_files@1.1.6/mod.ts";import{refresh as $t}from"https://deno.land/x/refresh@1.0.0/mod.ts";import{h as xt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{h as x,Helmet as gt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{h as l,Router as dt}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as c}from"https://cdn.skypack.dev/twind@0.16.16";var{Link:A}=dt,W="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium",F="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";function H({route:t}){return l("nav",{class:c`bg-gray-800 sticky top-0 z-10`},l("div",{class:c`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8`},l("div",{class:c`relative flex items-center justify-between h-16`},l("div",{class:c`flex-1 flex items-center justify-center sm:items-stretch sm:justify-start`},l("div",{class:c`sm:block sm:ml-6`},l("div",{class:c`flex space-x-4`},l(A,{class:c`${t.pathname==="/"?W:F}`,to:"/"},"Home"),l(A,{class:c`${t.pathname.startsWith("/blog")?W:F}`,to:"/blog"},"Blog"),l(A,{class:c`${t.pathname==="/about"?W:F}`,to:"/about"},"About")))))))}import C from"https://esm.sh/nprogress?no-check";function E({Component:t,props:e}){return x("div",null,x(gt,{head:!0},x("link",{rel:"icon",href:"data:,"}),x("link",{href:"https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.css",rel:"stylesheet"})),x(H,{route:e.route}),x(t,{...e}))}var k;E.onStart=()=>{k=setTimeout(()=>{C.start()},300)};E.onEnd=()=>{k&&clearTimeout(k),C.done()};E.onError=t=>{console.error(t)};var b=E;function K({Page:t,initData:e,route:s,isServer:r}){return xt(b,{Component:t,props:{...e,route:s,isServer:r}})}K.event={onStart:b.onStart,onEnd:b.onEnd,onError:b.onError};var z=K;import{join as N,resolve as M,toFileUrl as I}from"https://deno.land/std@0.126.0/path/mod.ts";import{walk as Q}from"https://deno.land/std@0.126.0/fs/walk.ts";var V="95d6aa06f620",X="01a2929d18cf";async function Z(t,e,s){let r=e+"/src/pages",o=!1,n=!1;for(let a=0;a<t.length;a++){let i=t[a],y=(await Deno.stat(N(r,i))).mtime?.getTime();s[i]||(s[i]=y,n||(n=!0)),s[i]!==y&&(s[i]=y,o||(o=!0))}return{storage:s,status:o,new_entry:n}}function G(t){let e=t.substring(0,t.lastIndexOf("."));return e.endsWith("/index")&&(e=e.substring(0,e.lastIndexOf("/index"))),e===""&&(e="/"),e="/"+e.split("/").reduce((s,r)=>r.startsWith("[...")&&r.endsWith("]")?s+"/:"+r.slice(4,r.length-1)+"*":r.startsWith("[")&&r.endsWith("]")?s+"/:"+r.slice(1,r.length-1):r,""),e}function tt(t,e,s){return e==="page"&&s==="development"?`
${t.map((r,o)=>`import $${o} from "../../src/pages${r}";`).join(`
`)}
export const map_pages = [
  ${t.map((r,o)=>`{ 
    path: '${G(r)}',
    page: $${o}
  },`).join(`
  `)}
];
export const base_url: string = import.meta.url;
export const tt: string = '${Date.now()}';
export const env: string = '${s}';
`:e==="page"&&s==="production"?`
export const map_pages = [
  ${t.map(r=>{let o=G(r),n=r.replace(".tsx",".js").replace(".jsx",".js");return`{ 
    path: '${o}',
    page: '.${n}',
    _page: './public/pages${n}'
  },`}).join(`
  `)}
];
export const base_url: string = import.meta.url;
export const tt: string = '${Date.now()}';
export const env: string = '${s}';
`:`
import { Router, Handler } from "https://deno.land/x/nhttp@1.1.10/mod.ts";
import { RequestEvent } from "./../deps/types.ts";
${t.map((r,o)=>`import $${o} from "../../src/pages${r}";`).join(`
`)}
const api = new Router<RequestEvent>();
const map = {} as Record<string, Handler<RequestEvent>>;
  ${t.map((r,o)=>{let n=G(r);return`
map['${r}'] = $${o};
api.any('${n}', $${o});`}).join(`
  `)}
export default { api, map };
`}async function et(t=!1,e="development",s=Deno.cwd()){try{s=M(s);let r=JSON.parse(localStorage.getItem(V)||"{}"),o=JSON.parse(localStorage.getItem(X)||"{}"),n=[],a=[],i=N(s,"./src/pages"),J=I(i),y=Q(i,{includeDirs:!1,includeFiles:!0,exts:["tsx","jsx","ts","js"]});for await(let g of y)if(g.isFile){let m=I(g.path).href.substring(J.href.length);m.startsWith("/_app.")||(m.startsWith("/api/")?a.push(m):n.push(m))}let _=await Z(n,s,r),j=await Z(a,s,o);if((_.new_entry||_.status||t)&&localStorage.setItem(V,JSON.stringify(_.storage)),(j.new_entry||j.status||t)&&localStorage.setItem(X,JSON.stringify(j.storage)),_.status||t){let g=tt(n,"page",e),m=s+"/_core/result/pages.ts";await Deno.writeTextFile(m,g)}if(j.status||t){let g=tt(a,"api",e),m=s+"/_core/result/apis.ts";await Deno.writeTextFile(m,g)}}catch(r){return console.log(r),r}}var $=[{path:"/about",page:"./about.js",_page:"./public/pages/about.js"},{path:"/blog",page:"./blog/index.js",_page:"./public/pages/blog/index.js"},{path:"/blog/:title",page:"./blog/[title].js",_page:"./public/pages/blog/[title].js"},{path:"/",page:"./index.js",_page:"./public/pages/index.js"}],Kt=import.meta.url;import{Router as wt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";import{HttpError as ht}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function R(t){if(t.request.method=="GET")return{title:"Welcome About From Api"};throw new ht(405,"method not allowed")}import{HttpError as yt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function S(t){if(t.request.method=="GET")return await(await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")).json();throw new yt(405,"method not allowed")}import{HttpError as bt}from"https://deno.land/x/nhttp@1.1.10/mod.ts";async function D(t){if(t.request.method=="GET")return await(await fetch(`https://jsonplaceholder.typicode.com/posts?title=${t.params.title}`)).json();throw new bt(405,"method not allowed")}var q=new wt,P={};P["/api/about.ts"]=R;q.any("/about",R);P["/api/blog/index.ts"]=S;q.any("/blog",S);P["/api/blog/[title].ts"]=D;q.any("/blog/:title",D);var L={api:q,map:P};import{h as u}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as f}from"https://cdn.skypack.dev/twind@0.16.16";function _t({message:t}){return u("div",{class:f`flex items-center justify-center w-screen h-screen`},u("div",{class:f`px-40 py-20 bg-white rounded-md`},u("div",{class:f`flex flex-col items-center`},u("h1",{class:f`font-bold text-blue-600 text-9xl`},"404"),u("h6",{class:f`mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`},u("span",{class:"text-red-500"},"Oops!")," Page not found"),u("p",{class:f`mb-8 text-center text-gray-500 md:text-lg`},t||"not found"),u("a",{href:"/",class:f`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Go home"))))}var st=_t;import{h as d}from"https://deno.land/x/nano_jsx@v0.0.30/mod.ts";import{tw as h}from"https://cdn.skypack.dev/twind@0.16.16";function jt({message:t,status:e}){return d("div",{class:h`flex items-center justify-center w-screen h-screen`},d("div",{class:h`px-40 py-20 bg-white rounded-md`},d("div",{class:h`flex flex-col items-center`},d("h1",{class:h`font-bold text-blue-600 text-9xl`},e||500),d("h6",{class:h`mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`},d("span",{class:"text-red-500"},"Oops!")," Error"),d("p",{class:h`mb-8 text-center text-gray-500 md:text-lg`},t||"something went wrong"))))}var rt=jt;var ot="/assets/pages/_app.js",Rt=Date.now(),T=(Deno.args||[]).includes("--dev")?"development":"production",w,O=[],p=new vt({env:T});if(T==="development"){O=$;try{await Deno.remove(Deno.cwd()+"/public/pages",{recursive:!0})}catch{}await et();let t={check:!1,bundle:"module",compilerOptions:{lib:["dom","dom.iterable","esnext"],jsxFactory:"h",jsxFragmentFactory:"Fragment"},importMapPath:"./import_map.json"};w=await Deno.emit("./_core/tsx/hydrate.tsx",t);let e=$t({paths:"./src/pages/"});p.use((s,r)=>{let o=e(s.request);return o||r()})}else for(let t=0;t<$.length;t++){let e=$[t],s=(await import(e._page)).default;O.push({path:e.path,page:s})}p.use("/assets",Et("public"));p.use((t,e)=>(t.getBaseUrl=()=>new URL(t.request.url).origin,t.isServer=!0,t.env=T,t.pathname=t.path,t.handler=async s=>(s.startsWith("/")||(s="/"+s),await L.map[s](t,e)),t.render=(s,r)=>v(U(z,{isServer:!0,initData:r.initData||{},Page:s,route:{url:t.url,pathname:t.path,path:r.path,params:t.params}}),{clientScript:ot,env:T,initData:r.initData||{},tt:Rt}),e()));for(let t=0;t<O.length;t++){let e=O[t];p.get(e.path,async s=>{s.getBaseUrl=()=>new URL(s.request.url).origin;let r=e.page,o=r.initProps?await r.initProps(s):{};return s.render(r,{path:e.path,initData:o})})}w&&p.get(ot,({response:t})=>(t.type("application/javascript"),w.files["deno:///bundle.js"]));p.use("/api",L.api);w&&p.get("/assets/hydrates/app.js",({response:t})=>(t.type("application/javascript"),w.files["deno:///bundle.js"]));p.on404(t=>t.path.startsWith("/api/")?{status:404,message:`route ${t.url} not found`}:v(U(st,{message:`route ${t.url} not found`,status:404}),{status:404}));p.onError((t,e)=>{let s=e.response.status();return e.path.startsWith("/api/")?{status:s,message:t.message}:v(U(rt,{message:t.message,status:s}),{status:s})});var nt=p;nt.listen(8080,()=>{console.log("> running on port 8080")});
