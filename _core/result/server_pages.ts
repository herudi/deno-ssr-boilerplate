
import $0 from "../../src/pages/blog/index.tsx";
import $1 from "../../src/pages/blog/[title].tsx";
import $2 from "../../src/pages/index.tsx";
import $3 from "../../src/pages/sign.tsx";
export const map_pages: any = [
  { 
    path: '/blog',
    page: $0,
    methods: ($0 as any).methods
  },
  { 
    path: '/blog/:title',
    page: $1,
    methods: ($1 as any).methods
  },
  { 
    path: '/',
    page: $2,
    methods: ($2 as any).methods
  },
  { 
    path: '/sign',
    page: $3,
    methods: ($3 as any).methods
  },
];
export const tt: string = '1646808121933';
