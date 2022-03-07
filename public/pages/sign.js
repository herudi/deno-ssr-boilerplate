import{b as e,c as n,d as i,f as t}from"./chunk-XBSBNYME.js";var a={input:"appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"},r=class extends n{static async initProps(s){if(s.isServer&&s.request.method==="POST"){let{message:o}=await s.handler("/api/sign.ts");return o==="success"?s.response.redirect("/"):{message:o}}return{}}render(){return e("div",null,e(i,null,e("title",null,"Sign Page")),e("div",{class:t`min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`},e("div",{class:t`max-w-sm w-full space-y-8`},e("div",null,e("h2",{class:t`mt-6 text-center text-3xl font-extrabold text-gray-900`},"Sign Page"),e("p",{class:t`text-center`},"(Example handle form with POST)"),this.props.message&&e("div",{class:t`mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`,role:"alert"},e("strong",{class:t`font-bold`},"Error"),e("span",{class:t`block sm:inline`},this.props.message),e("span",{class:t`absolute top-0 bottom-0 right-0 px-4 py-3`},e("svg",{class:t`fill-current h-6 w-6 text-red-500`,role:"button",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},e("title",null,"Close"),e("path",{d:"M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"})))),e("form",{class:t`mt-8 space-y-6`,action:"/sign",method:"POST"},e("div",{class:t`rounded-md shadow-sm -space-y-px`},e("div",null,e("label",{class:t`sr-only`},"Username"),e("input",{name:"username",type:"text",class:t`${a.input}`,placeholder:"Username = deno",requied:!0})),e("div",null,e("label",{class:t`sr-only`},"Password"),e("input",{name:"password",type:"password",class:t`${a.input}`,placeholder:"Password = deno",requied:!0}))),e("div",null,e("button",{type:"submit",class:t`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`},"Sign in")))))))}};r.methods=["GET","POST"];var c=r;export{c as default};
