// One-time migration: converts existing articles from the old
// sections[]/contentBlock schema to the new single "body" Portable Text field.
// Usage: npx tsx scripts/migrate-to-simple-body.ts
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

const dataDir = path.join(process.cwd(), 'scripts/migration-data');
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

let keyCounter = 0;
const key = () => `k${keyCounter++}`;

function textBlock(text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: key(),
    style,
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

function listItemBlock(text: string, listItem: 'bullet' | 'number', level = 1) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem,
    level,
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

function buildBody(data: any): any[] {
  const body: any[] = [];

  if (data.intro) body.push(textBlock(data.intro));
  if (data.warning) body.push(textBlock(data.warning, 'blockquote'));

  for (const section of data.sections ?? []) {
    if (section.heading) body.push(textBlock(section.heading, 'h2'));
    if (section.paragraph) body.push(textBlock(section.paragraph));

    const block = section.block;
    if (block?.discriminant === 'checklist' || block?.discriminant === 'steps') {
      const listType = block.discriminant === 'checklist' ? 'bullet' : 'number';
      for (const item of block.value.items ?? []) {
        body.push(listItemBlock(item, listType));
      }
    } else if (block?.discriminant === 'warning' || block?.discriminant === 'tip') {
      const prefix = block.discriminant === 'warning' ? 'Pazi: ' : 'Savjet: ';
      body.push(textBlock(prefix + block.value.text, 'blockquote'));
    } else if (block?.discriminant === 'table') {
      if (block.value.caption) body.push(textBlock(block.value.caption, 'h3'));
      for (const row of block.value.rows ?? []) {
        body.push(listItemBlock(`${row.label}: ${row.value}`, 'bullet'));
      }
    }
  }

  return body;
}

async function run() {
  console.log(`Migriram ${files.length} članaka na novu strukturu (jedno "body" polje)...`);
  const tx = client.transaction();

  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    const body = buildBody(data);

    tx.patch(`article-${slug}`, (p) =>
      p.set({ body }).unset(['sections', 'intro', 'warning'])
    );
  }

  await tx.commit();
  console.log('Gotovo! Svi članci su prebačeni na novu strukturu.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
