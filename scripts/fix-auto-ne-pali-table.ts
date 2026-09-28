// Popravlja "lažnu tablicu" (obični tekst red-po-red) u članku "Auto ne pali
// na hladnoći: uzroci i što napraviti?" — "Što se događa / Najčešći uzrok",
// 2 stupca, 7 redaka. Koristi postojeći (najstariji) "table" tip koji je već
// podržan i u Studiju i na webu.
//
// SAFE BY DEFAULT: bez --apply samo ispisuje što bi se promijenilo.
//
// Usage:
//   npx tsx scripts/fix-auto-ne-pali-table.ts            (dry run)
//   npx tsx scripts/fix-auto-ne-pali-table.ts --apply     (spremi promjene)
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
const SLUG = 'auto-ne-pali-na-hladnoci-uzroci-i-sto-napraviti';

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
// Normalizira navodnike, crtice i razmake da usporedba ne pukne zbog
// "pametnih" navodnika, en/em crtica i sl. koje je Sanity/browser mogao unijeti
// drugačije nego što smo ih mi ručno prepisali.
function normalize(s: string): string {
  return s
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function findIndex(body: any[], headerSeq: string[]): number {
  for (let i = 0; i <= body.length - headerSeq.length; i++) {
    let match = true;
    for (let j = 0; j < headerSeq.length; j++) {
      if (!isPlainParagraph(body[i + j]) || normalize(plainText(body[i + j])) !== normalize(headerSeq[j])) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
}

async function main() {
  const article: { _id: string; title: string; body: any[] } | null = await client.fetch(
    `*[_type == "article" && slug.current == $slug][0]{ _id, title, body }`,
    { slug: SLUG }
  );

  if (!article) {
    console.error(`Nije pronađen članak sa slugom "${SLUG}".`);
    process.exit(1);
  }

  const body = [...article.body];

  const rowsData = [
    ['Tišina, ploča se ne pali ili jedva svijetli', 'Potpuno prazan akumulator ili labava stezaljka'],
    ['Brzi klik-klik-klik', 'Akumulator ima dovoljno za elektroniku, ali ne i za anlaser'],
    ['Anlaser se vrti sporo, "teško"', 'Slab akumulator, gusto ulje, jaka hladnoća'],
    ['Anlaser se vrti normalno, motor ne "uhvati"', 'Gorivo ili paljenje - kod dizela grijači ili zgusnuto gorivo'],
    ['Motor upali pa se ugasi', 'Gorivo, senzor ili imobilizator'],
    ['Jedan jak klik, ništa dalje', 'Anlaser ili njegov relej'],
    ['Lampica imobilizatora treperi', 'Ključ nije prepoznat - baterija u ključu ili sam ključ'],
  ];

  const start = findIndex(body, ['Što se događa', 'Najčešći uzrok']);
  if (start === -1) {
    console.log('Tablica "Što se događa / Najčešći uzrok" nije pronađena kao obični tekst (možda je već popravljena).');
    return;
  }

  const count = 2 + rowsData.length * 2;
  let ok = true;
  let idx = start + 2;
  const actualRowsData: [string, string][] = [];
  for (const [label, value] of rowsData) {
    const actualLabel = isPlainParagraph(body[idx]) ? plainText(body[idx]) : undefined;
    const actualValue = isPlainParagraph(body[idx + 1]) ? plainText(body[idx + 1]) : undefined;
    if (
      actualLabel === undefined || normalize(actualLabel) !== normalize(label) ||
      actualValue === undefined || normalize(actualValue) !== normalize(value)
    ) {
      ok = false;
      console.error('Neslaganje na retku:');
      console.error(`  očekivano: [${JSON.stringify(label)}, ${JSON.stringify(value)}]`);
      console.error(`  stvarno:   [${JSON.stringify(actualLabel)}, ${JSON.stringify(actualValue)}]`);
      break;
    }
    actualRowsData.push([actualLabel, actualValue]);
    idx += 2;
  }

  if (!ok) {
    console.error('\nSadržaj tablice ne odgovara očekivanom — preskačem radi sigurnosti (provjeri ručno u Studiju).');
    return;
  }

  const tableBlock = {
    _type: 'table',
    _key: key(),
    headerCol1: 'Što se događa',
    headerCol2: 'Najčešći uzrok',
    // Koristimo stvarni tekst iz Sanityja (actualRowsData), ne ručno prepisani
    // rowsData, da se sačuva izvorna interpunkcija/navodnici bez izmjena.
    rows: actualRowsData.map(([label, value]) => ({ _key: key(), label, value })),
  };

  body.splice(start, count, tableBlock);

  console.log(`\nČlanak: "${article.title}"`);
  console.log(`  → Tablica "Što se događa / Najčešći uzrok" → 2-stupčana tablica (${rowsData.length} redaka)`);

  if (!APPLY) {
    console.log('\nOvo je bio SAMO PREGLED — ništa nije spremljeno.');
    console.log('Ako popis izgleda točno, pokreni ponovno s --apply da se promjene spreme:');
    console.log('  npx tsx scripts/fix-auto-ne-pali-table.ts --apply');
    return;
  }

  await client.patch(article._id).set({ body }).commit();
  console.log('\nGotovo! Tablica je spremljena u pravom formatu.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
