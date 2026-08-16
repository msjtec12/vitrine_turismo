import { MetadataRoute } from 'next';
import { mockCities, mockStores, mockProducts } from '@/lib/data/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://descubraartes.com.br';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/explorar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/promocoes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/mapa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/quero-vender`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = mockCities.map((city) => ({
    url: `${baseUrl}/cidade/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const storeRoutes: MetadataRoute.Sitemap = mockStores.map((store) => ({
    url: `${baseUrl}/loja/${store.slug}`,
    lastModified: new Date(store.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = mockProducts.map((product) => ({
    url: `${baseUrl}/produto/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...cityRoutes, ...storeRoutes, ...productRoutes];
}
