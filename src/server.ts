import { http } from "./../_core/server.tsx";

// some code here

http.listen(8080, () => {
  console.log("> running on port 8080");
});
