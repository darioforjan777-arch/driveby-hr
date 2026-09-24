// Briše 3 stara članka koja su ostala pod ukinutom kategorijom "recenzije"
// (renault-clio-4-pouzdanost, skoda-octavia-3-2-0-tdi-iskustva, vw-golf-7-16-tdi-prednosti-mane).
// Ti su članci nakon ukidanja kategorije u kodu i dalje bili objavljeni u Sanityju
// i automatski su padali pod prvu dostupnu kategoriju (Tehnički pregled i preinake),
// zbog čega ih je Google i dalje indeksirao.
//
// Usage: npx tsx scripts/delete-old-review-articles.ts
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

const slugsToDelete = [
  'renault-clio-4-pouzdanost',
  'skoda-octavia-3-2-0-tdi-iskustva',
  'vw-golf-7-16-tdi-prednosti-mane',
];

async function main() {
  for (const slug of slugsToDelete) {
    const id = `article-${slug}`;
    try {
      const existing = await client.fetch(`*[_id == $id][0]{title}`, { id });
      if (!existing) {
        console.log(`Preskačem "${id}" — ne postoji (možda je već obrisan).`);
        continue;
      }
      await client.delete(id);
      console.log(`Obrisano: "${existing.title}" (${id})`);
    } catch (e) {
      console.error(`Greška kod brisanja "${id}":`, e);
    }
  }
  console.log('\nGotovo. Napomena: stranice ovih članaka na webu će nakon idućeg builda vraćati 404.');
  console.log('Preporuka: u Google Search Console pod "Uklanjanja" zatraži privremeno uklanjanje tih URL-ova iz indeksa:');
  for (const slug of slugsToDelete) {
    console.log(`  - https://drivebyhr.com/clanak/${slug}/`);
  }
}

main();
