import { initApp } from "../_core/server.tsx";

initApp().listen(8080, () => {
  console.log("> Running on http://localhost:8080");
});

// example custom route
// initApp((app) => {
//   app.get("/blog", async (rev) => {
//     return rev.render(BlogPage, {
//       path: "/blog",
//       initData: { key: "value" }
//     })
//   })
// }).listen(8080, () => {
//   console.log("> Running on http://localhost:8080");
// });
