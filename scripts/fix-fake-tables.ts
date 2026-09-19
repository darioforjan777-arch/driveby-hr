// Finds article body sections that look like a "fake table" — a run of short,
// alternating plain paragraphs (label, value, label, value...) instead of a real
// table — and converts them into proper `table` blocks.
//
// SAFE BY DEFAULT: run without --apply first to see a report of what would change,
// with no writes to Sanity. Only re-run with --apply once you've checked the report.
//
// Usage:
//   npx tsx scripts/fix-fake-tables.ts            (dry run — just prints a report)
//   npx tsx scripts/fix-fake-tables.ts --apply     (actually saves the changes)
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

const APPLY = process.argv.includes('--apply');

const client = createClient({
  projectId: 'mlukd3n9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

let keyCounter = 0;
const key = () => `tbl${Date.now().toString(36)}${keyCounter++}`;

function isPlainParagraph(b: any): boolean {
  return b && b._type === 'block' && b.style === 'normal' && !b.listItem;
}

function plainText(b: any): string {
  return (b.children ?? []).map((c: any) => c.text ?? '').join('').trim();
}

function isShortLine(text: string): boolean {
  if (!text) return false;
  const words = text.split(/\s+/).filter(Boolean);
  return words.length > 0 && words.length <= 8 && text.length <= 80;
}

function convertBody(body: any[]): { body: any[]; tables: { heading: string; rows: number }[] } {
  const out: any[] = [];
  const tables: { heading: string; rows: number }[] = [];
  let i = 0;

  while (i < body.length) {
    const block = body[i];
    if (isPlainParagraph(block) && isShortLine(plainText(block))) {
      const lines: string[] = [];
      let j = i;
      while (j < body.length && isPlainParagraph(body[j]) && isShortLine(plainText(body[j]))) {
        lines.push(plainText(body[j]));
        j++;
      }
      if (lines.length >= 4 && lines.length % 2 === 0) {
        const rows = [];
        for (let k = 2; k < lines.length; k += 2) {
          rows.push({ _key: key(), label: lines[k], value: lines[k + 1] });
        }
        const heading = out.length > 0 && out[out.length - 1]?.style === 'h2'
          ? plainText(out[out.length - 1])
          : lines[0];
        out.push({
          _type: 'table',
          _key: key(),
          headerCol1: lines[0],
          headerCol2: lines[1],
          rows,
        });
        tables.push({ heading, rows: rows.length });
        i = j;
        continue;
      }
    }
    out.push(block);
    i++;
  }

  return { body: out, tables };
}

async function run() {
  const articles: { _id: string; title: string; body: any[] }[] = await client.fetch(
    `*[_type == "article"]{ _id, title, body }`
  );

  const changes: { id: string; title: string; body: any[]; tables: { heading: string; rows: number }[] }[] = [];

  for (const a of articles) {
    if (!Array.isArray(a.body) || a.body.length === 0) continue;
    const { body, tables } = convertBody(a.body);
    if (tables.length > 0) {
      changes.push({ id: a._id, title: a.title, body, tables });
    }
  }

  if (changes.length === 0) {
    console.log('Nije pronađena nijedna "lažna tablica" u člancima. Ništa za mijenjati.');
    return;
  }

  console.log(`Pronađeno ${changes.length} članaka s "lažnim tablicama":\n`);
  for (const c of changes) {
    console.log(`- ${c.title}`);
    for (const t of c.tables) {
      console.log(`    → tablica "${t.heading}" (${t.rows} redaka)`);
    }
  }

  if (!APPLY) {
    console.log('\nOvo je bio SAMO PREGLED — ništa nije spremljeno.');
    console.log('Ako popis izgleda točno, pokreni ponovno s --apply da se promjene spreme:');
    console.log('  npx tsx scripts/fix-fake-tables.ts --apply');
    return;
  }

  console.log('\nSpremam promjene...');
  const tx = client.transaction();
  for (const c of changes) {
    tx.patch(c.id, (p) => p.set({ body: c.body }));
  }
  await tx.commit();
  console.log('Gotovo! Tablice su pretvorene u pravi format.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
