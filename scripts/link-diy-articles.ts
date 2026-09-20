// Cross-links the 3 example "Samostalni popravci i DIY" articles as each
// other's "Povezani članci" (related), since the seed script that created
// them left that field empty.
//
// Usage: npx tsx scripts/link-diy-articles.ts
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

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
  console.error('Nedostaje SANITY_API_TOKEN — provjeri .env datoteku.');
  process.exit(1);
}

const client = createClient({
  projectId: 'mlukd3n9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const slugs = ['zamjena-akumulatora', 'zamjena-kocionih-plocica', 'zamjena-ulja-i-filtera'];

async function run() {
  console.log('Povezujem primjere DIY članaka međusobno...');
  for (const slug of slugs) {
    const others = slugs.filter((s) => s !== slug);
    await client
      .patch(`article-${slug}`)
      .set({
        related: others.map((s, i) => ({ _type: 'reference', _key: `rel${i}`, _ref: `article-${s}` })),
      })
      .commit();
    console.log(`  ✓ ${slug} → povezan s: ${others.join(', ')}`);
  }
  console.log('Gotovo!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
