
export const map_pages = [
  { 
    path: '/about',
    page: './about.js',
    _page: '/public/pages/about.js'
  },
  { 
    path: '/blog',
    page: './blog/index.js',
    _page: '/public/pages/blog/index.js'
  },
  { 
    path: '/blog/:title',
    page: './blog/[title].js',
    _page: '/public/pages/blog/[title].js'
  },
  { 
    path: '/',
    page: './index.js',
    _page: '/public/pages/index.js'
  },
];
export const tt: string = '1646382683585';
export const env: string = 'production';
