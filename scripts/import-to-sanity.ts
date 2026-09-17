// Imports the existing articles into Sanity.
// Usage: SANITY_API_TOKEN=... npx tsx scripts/import-to-sanity.ts
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

// Minimal .env loader (no extra dependency needed)
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvFile();

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error('Nedostaje SANITY_API_TOKEN — provjeri da .env datoteka u ovom folderu sadrži SANITY_API_TOKEN=...');
  process.exit(1);
}

const client = createClient({
  projectId: 'mlukd3n9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const dataDir = path.join(process.cwd(), 'scripts/migration-data');
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

function toPortableText(paragraph: string) {
  if (!paragraph) return [];
  return [
    {
      _type: 'block',
      _key: 'p1',
      style: 'normal',
      children: [{ _type: 'span', _key: 's1', text: paragraph, marks: [] }],
      markDefs: [],
    },
  ];
}

function toBlock(block: any) {
  if (!block) return { blockType: 'none' };
  const type = block.discriminant;
  const value = block.value ?? {};
  if (type === 'checklist' || type === 'steps') {
    return { blockType: type, items: value.items };
  }
  if (type === 'warning' || type === 'tip') {
    return { blockType: type, text: value.text };
  }
  if (type === 'table') {
    return {
      blockType: 'table',
      caption: value.caption,
      rows: value.rows.map((r: any, i: number) => ({ _key: `row${i}`, label: r.label, value: r.value })),
    };
  }
  return { blockType: 'none' };
}

async function run() {
  const docs: { slug: string; doc: any; related: string[] }[] = [];

  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));

    const doc = {
      _id: `article-${slug}`,
      _type: 'article',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      categorySlug: data.categorySlug,
      excerpt: data.excerpt,
      readMin: data.readMin,
      published: data.published,
      ...(data.updated ? { updated: data.updated } : {}),
      ...(data.popular ? { popular: data.popular } : {}),
      ...(data.featured ? { featured: data.featured } : {}),
      intro: data.intro,
      ...(data.warning ? { warning: data.warning } : {}),
      sections: (data.sections ?? []).map((s: any, i: number) => ({
        _type: 'section',
        _key: `sec${i}`,
        heading: s.heading,
        paragraph: toPortableText(s.paragraph),
        block: { _type: 'contentBlock', ...toBlock(s.block) },
      })),
      faq: (data.faq ?? []).map((f: any, i: number) => ({ _type: 'faqItem', _key: `faq${i}`, q: f.q, a: f.a })),
    };

    docs.push({ slug, doc, related: data.related ?? [] });
  }

  console.log(`Importiram ${docs.length} članaka...`);
  const tx = client.transaction();
  for (const { doc } of docs) {
    tx.createOrReplace(doc);
  }
  await tx.commit();
  console.log('Osnovni podaci uvezeni. Povezujem "povezane članke"...');

  for (const { slug, related } of docs) {
    if (!related.length) continue;
    await client
      .patch(`article-${slug}`)
      .set({
        related: related.map((r, i) => ({
          _type: 'reference',
          _key: `rel${i}`,
          _ref: `article-${r}`,
        })),
      })
      .commit();
  }

  console.log('Gotovo! Svi članci su u Sanityju.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
