// Dinamička sitemap.xml — generira se pri svakom buildu iz stvarnih podataka (Sanity).
// Sadrži sve stranice, kategorije i članke, uključujući <image:image> unose za
// naslovne i sve slike unutar teksta članka, te <lastmod> po stvarnom datumu
// objave/ažuriranja. Nove/izmijenjene stranice automatski se pojave ovdje na
// idućem buildu — ništa nije potrebno ručno održavati.
import type { APIRoute } from 'astro';
import { articles } from '../data/articles';
import { categories } from '../data/site';
import { urlForImage } from '../lib/sanity';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface SitemapImage {
  loc: string;
  caption?: string;
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  images?: SitemapImage[];
}

export const GET: APIRoute = ({ site }) => {
  const siteUrl = (site?.toString() ?? '').replace(/\/$/, '');
  const buildDate = new Date().toISOString().slice(0, 10);

  const latestArticleDate =
    articles
      .map((a) => a.updated || a.published)
      .filter(Boolean)
      .sort()
      .reverse()[0] ?? buildDate;

  const urls: SitemapUrl[] = [];

  // Naslovnica
  urls.push({ loc: `${siteUrl}/`, lastmod: latestArticleDate, changefreq: 'daily', priority: '1.0' });

  // Statične stranice
  for (const path of ['o-stranici', 'kontakt', 'privatnost', 'kolacici']) {
    urls.push({ loc: `${siteUrl}/${path}/`, lastmod: buildDate, changefreq: 'monthly', priority: '0.4' });
  }

  // Kategorije
  for (const cat of categories) {
    const inCat = articles.filter((a) => a.categorySlug === cat.slug);
    const catLastmod =
      inCat
        .map((a) => a.updated || a.published)
        .filter(Boolean)
        .sort()
        .reverse()[0] ?? buildDate;
    urls.push({
      loc: `${siteUrl}/kategorija/${cat.slug}/`,
      lastmod: catLastmod,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // Članci — s lastmod i svim slikama (naslovna + slike unutar tijela teksta)
  for (const a of articles) {
    const images: SitemapImage[] = [];
    if (a.coverImage) {
      images.push({
        loc: urlForImage(a.coverImage).width(1200).url(),
        caption: a.title,
      });
    }
    for (const block of a.body ?? []) {
      if (block?._type === 'image' && block.asset) {
        images.push({
          loc: urlForImage(block).width(1200).url(),
          caption: block.alt || a.title,
        });
      }
    }
    urls.push({
      loc: `${siteUrl}/clanak/${a.slug}/`,
      lastmod: a.updated || a.published || buildDate,
      changefreq: 'monthly',
      priority: '0.9',
      images,
    });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}${u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>\n` : ''}${u.priority ? `    <priority>${u.priority}</priority>\n` : ''}${(u.images ?? [])
      .map(
        (img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
${img.caption ? `      <image:caption>${escapeXml(img.caption)}</image:caption>\n` : ''}    </image:image>
`
      )
      .join('')}  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
