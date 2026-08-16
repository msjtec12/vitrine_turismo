import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/painel/', '/admin/'],
    },
    sitemap: 'https://descubraartes.com.br/sitemap.xml',
  };
}
