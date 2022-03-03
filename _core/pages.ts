
import $0 from "../src/pages/about.tsx";
import $1 from "../src/pages/blog/index.tsx";
import $2 from "../src/pages/blog/[title].tsx";
import $3 from "../src/pages/index.tsx";
export default [
  { 
    path: '/about',
    page: $0
  },
  { 
    path: '/blog',
    page: $1
  },
  { 
    path: '/blog/:title',
    page: $2
  },
  { 
    path: '/',
    page: $3
  },
];
