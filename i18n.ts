export default {
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home'],
    '/posts': ['posts'],
    '/add-post': ['posts'],
    '/analytics': ['analytics'],
    '/users': ['users'],
    '/settings': ['settings'],
    '/login': ['auth'],
  },
  staticsHoc: {
    '/login': 'noAuth',
  },
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  }
}
