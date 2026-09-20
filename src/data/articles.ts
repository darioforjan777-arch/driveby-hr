import { sanityClient } from '../lib/sanity';
import { categories } from './site';

export interface FAQItem {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  coverImage?: any;
  readMin: number;
  published: string;
  updated?: string;
  popular?: boolean;
  featured?: boolean;
  body: any[]; // Portable Text blocks — rendered via renderPortableText()
  faq: FAQItem[];
  related: string[];
  seo?: { metaTitle?: string; metaDescription?: string };
}

const QUERY = /* groq */ `
*[_type == "article"] | order(published desc) {
  "slug": slug.current,
  categorySlug,
  title,
  excerpt,
  coverImage,
  readMin,
  published,
  updated,
  popular,
  featured,
  body,
  faq,
  "related": related[]->slug.current,
  seo
}
`;

const rawArticles: Article[] = await sanityClient.fetch(QUERY);

// Guard against a stray/old categorySlug in Sanity (e.g. a category that was
// renamed or removed in src/data/site.ts but not yet updated on the article
// in Studio) — without this, one leftover article would crash the ENTIRE
// static build. Instead we fall back to the first known category and log a
// clear warning so it shows up in the Vercel build log.
const fallbackCategorySlug = categories[0]?.slug;
const knownCategorySlugs = new Set(categories.map((c) => c.slug));
const articles: Article[] = rawArticles.map((a) => {
  if (!knownCategorySlugs.has(a.categorySlug)) {
    console.warn(
      `[upozorenje] Članak "${a.title}" (${a.slug}) ima nepoznatu kategoriju "${a.categorySlug}" — ` +
        `privremeno je prikazan pod "${fallbackCategorySlug}". Ispravi kategoriju u Sanity Studiju.`
    );
    return { ...a, categorySlug: fallbackCategorySlug ?? a.categorySlug };
  }
  return a;
});

export { articles };

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export function getFeatured(): Article {
  return articles.find((a) => a.featured) ?? articles[0];
}

export function getPopular(limit: number): Article[] {
  return articles.filter((a) => a.popular).slice(0, limit);
}

export function getLatest(limit: number): Article[] {
  return articles.slice(0, limit);
}
