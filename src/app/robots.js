export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/order/'],
    },
    sitemap: 'https://reskindev.com/sitemap.xml',
  }
}
