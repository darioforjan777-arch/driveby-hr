import { sanityClient } from '../lib/sanity';

export interface Block {
  blockType: 'none' | 'checklist' | 'steps' | 'warning' | 'tip' | 'table' | undefined;
  items?: string[];
  text?: string;
  caption?: string;
  rows?: { label: string; value: string }[];
}

export interface Section {
  heading: string;
  paragraph: any[]; // Portable Text blocks — rendered via renderPortableText()
  block?: Block;
}

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
  intro: string;
  warning?: string;
  sections: Section[];
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
  intro,
  warning,
  sections,
  faq,
  "related": related[]->slug.current,
  seo
}
`;

const articles: Article[] = await sanityClient.fetch(QUERY);

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
