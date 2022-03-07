import{a as R,b as t,d as j,e as k,f as l}from"./chunk-XBSBNYME.js";var x=[{path:"/blog",page:"./blog/index.js"},{path:"/blog/:title",page:"./blog/[title].js"},{path:"/",page:"./index.js"},{path:"/sign",page:"./sign.js"}],P="1646661258114";var{Link:v}=k,y="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium",c="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";function h({route:r}){return t("nav",{class:l`bg-gray-800 sticky top-0 z-10`},t("div",{class:l`max-w-7xl mx-auto px-2 sm:px-6 lg:px-8`},t("div",{class:l`relative flex items-center justify-between h-16`},t("div",{class:l`flex-1 flex items-center justify-center sm:items-stretch sm:justify-start`},t("div",{class:l`sm:block sm:ml-6`},t("div",{class:l`flex space-x-4`},t(v,{class:l`${r.pathname==="/"?y:c}`,to:"/"},"Home"),t(v,{class:l`${r.pathname.startsWith("/blog")?y:c}`,to:"/blog"},"Blog"),t(v,{class:l`${r.pathname==="/sign"?y:c}`,to:"/sign"},"Sign Form")))),t("div",{class:"absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"},t("a",{class:l`${c}`,href:"https://github.com/herudi/deno-ssr-boilerplate",target:"__blank"},"Github")))))}function _({Component:r,props:e}){return t("div",null,t(j,{head:!0},t("html",{lang:"en"}),t("link",{rel:"icon",href:"data:,"}),t("script",{src:"https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js"}),t("link",{href:"https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css",rel:"stylesheet"})),e.route.pathname!=="/sign"&&t(h,{route:e.route}),t(r,{...e}))}var w;_.event={onStart(r){r.NProgress=window.NProgress,r.isFirst||(w=setTimeout(()=>{r.NProgress.start()},300))},onEnd({NProgress:r}){w&&clearTimeout(w),r.done()},onError(r){console.error(r)}};var m=_;function b({Page:r,initData:e,route:i,isServer:o}){return t(m,{Component:r,props:{...e,route:i,isServer:o}})}b.initProps=m.initProps;b.event=m.event||{};var p=b;function $({message:r}){return t("div",{class:l`flex items-center justify-center w-screen h-screen`},t("div",{class:l`px-40 py-20 bg-white rounded-md`},t("div",{class:l`flex flex-col items-center`},t("h1",{class:l`font-bold text-blue-600 text-9xl`},"404"),t("h6",{class:l`mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl`},t("span",{class:"text-red-500"},"Oops!")," Page not found"),t("p",{class:l`mb-8 text-center text-gray-500 md:text-lg`},r||"not found"),t("a",{href:"/",class:l`px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100`},"Go home"))))}var E=$;function T(r,e,i){let o=i.groups||{};if(!e)return o;if(r.indexOf("*")!==-1){i.shift();let a=i.filter(d=>d!==void 0).filter(d=>d.startsWith("/")).join("").split("/");a.shift();let n={...o,wild:a.filter(d=>d!=="")};if(r==="*"||r.indexOf("/*")!==-1)return n;let s=r.split("/").find(d=>d.startsWith(":")&&d.endsWith("*"));return s&&(s=s.slice(1,-1),n[s]=[n[s]].concat(n.wild).filter(d=>d!==""),delete n.wild),n}return o}function q(r){try{return decodeURI(r)}catch{return r}}var f=class{constructor(e={}){this.routes=[];this.id=e.id||"root",this.fallback=e.fallback||t(E,null)}add(e,i){let o=!1,a=e.replace(/\/$/,"").replace(/:(\w+)(\?)?(\.)?/g,"$2(?<$1>[^/]+)$2$3").replace(/(\/?)\*/g,(s,d)=>(o=!0,`(${d}.*)?`)).replace(/\.(?=[\w(])/,"\\."),n=new RegExp(`^${a}/*$`);return this.routes.push({path:e,fn:i,regex:n,wild:o}),this}find(e){let i,o={},a=0,n,s=this.routes,d=s.length;for(e=q(e);a<d;){if(n=s[a],n.regex.test(e)){let g=n.regex.exec(e);i=n.fn,o=T(n.path,n.wild,g);break}a++}return{fn:i,params:o}}handle(){let{pathname:e,search:i}=window.location;if(this.current===e+i)return;let{fn:o,params:a}=this.find(e);this.current=e+i;let n=this.id,s={};if(s.pathname=e,s.url=this.current,s.path=e,s.isServer=!1,s.getBaseUrl=()=>location.origin,s.params=a,s.render=(d,g)=>{R(d,document.getElementById(g||n))},!o)return s.render(t(E,null));o(s)}resolve(){let e=()=>this.handle();e(),window.addEventListener("pushstate",i=>{i.preventDefault(),e()}),window.addEventListener("replacestate",i=>{i.preventDefault(),e()}),window.addEventListener("popstate",()=>{e()})}};async function A(r){return(await import(r+"?v="+P)).default}var u=!0;window.addEventListener("load",()=>{let r=document.getElementById("__INIT_DATA__");r&&(r=JSON.parse(r.textContent||"{}"));let e=new f;for(let i=0;i<x.length;i++){let o=x[i];e.add(o.path,async a=>{a.isFirst=u;try{let n={};u||(n=p.initProps?await p.initProps(a):{}),p.event.onStart!==void 0&&await p.event.onStart(a);let s=typeof o.page=="string"?await A(o.page):o.page,d=u?r||{}:s.initProps?await s.initProps(a):{};a.render(t(p,{Page:s,initData:{...d,...n},route:{pathname:a.pathname,url:a.url,path:o.path,params:a.params},isServer:!1})),p.event.onEnd!==void 0&&p.event.onEnd(a)}catch(n){p.event.onError!==void 0&&p.event.onError(n,a)}u=!1})}e.resolve()});
