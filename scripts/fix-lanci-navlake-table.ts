// Popravlja "lažnu tablicu" (obični tekst red-po-red) u članku "Lanci i
// tekstilne navlake za snijeg: što je legalno u Hrvatskoj" — usporedba u 4
// stupca (naziv retka + 3 vrste proizvoda), koju stariji table/table3 tipovi
// ne mogu prikazati. Koristi novi fleksibilni "flexTable" tip.
//
// SAFE BY DEFAULT: bez --apply samo ispisuje što bi se promijenilo.
//
// Usage:
//   npx tsx scripts/fix-lanci-navlake-table.ts            (dry run)
//   npx tsx scripts/fix-lanci-navlake-table.ts --apply     (spremi promjene)
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
const SLUG = 'lanci-i-tekstilne-navlake-za-snijeg-sto-je-legalno-u-hrvatskoj';

const client = createClient({
  projectId: 'mlukd3n9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

let keyCounter = 0;
const key = () => `flx${Date.now().toString(36)}${keyCounter++}`;

function isPlainParagraph(b: any): boolean {
  return b && b._type === 'block' && b.style === 'normal' && !b.listItem;
}
function plainText(b: any): string {
  return (b.children ?? []).map((c: any) => c.text ?? '').join('').trim();
}

function findIndex(body: any[], headerSeq: string[]): number {
  for (let i = 0; i <= body.length - headerSeq.length; i++) {
    let match = true;
    for (let j = 0; j < headerSeq.length; j++) {
      if (!isPlainParagraph(body[i + j]) || plainText(body[i + j]) !== headerSeq[j]) {
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

  const dataHeaders = ['Čelični lanci', 'Kompozitni lanci (mreže)', 'Tekstilne navlake (čarape)'];
  const rowsData = [
    ['Prianjanje na dubokom snijegu i ledu', 'Najbolje', 'Vrlo dobro', 'Dobro na utabanom snijegu, slabije na ledu'],
    ['Montaža', 'Najzahtjevnija', 'Srednja', 'Najlakša'],
    ['Težina i prostor', 'Najteži', 'Srednje', 'Lagane, malo mjesta'],
    ['Vožnja po suhom asfaltu', 'Ne', 'Ne', 'Ne - brzo se troše'],
    ['Trajnost', 'Najveća', 'Dobra', 'Najmanja'],
    ['Za koga', 'Česta vožnja kroz gorje, dubok snijeg', 'Kompromis između lakoće i učinka', 'Povremena upotreba, niski auti, hitni slučaj'],
  ];

  const start = findIndex(body, dataHeaders);
  if (start === -1) {
    console.log('Tablica "Tri vrste proizvoda" nije pronađena kao obični tekst (možda je već popravljena).');
    return;
  }

  const count = dataHeaders.length + rowsData.length * 4;
  let ok = true;
  let idx = start + dataHeaders.length;
  for (const [c0, c1, c2, c3] of rowsData) {
    if (
      !isPlainParagraph(body[idx]) || plainText(body[idx]) !== c0 ||
      !isPlainParagraph(body[idx + 1]) || plainText(body[idx + 1]) !== c1 ||
      !isPlainParagraph(body[idx + 2]) || plainText(body[idx + 2]) !== c2 ||
      !isPlainParagraph(body[idx + 3]) || plainText(body[idx + 3]) !== c3
    ) {
      ok = false;
      break;
    }
    idx += 4;
  }

  if (!ok) {
    console.error('Sadržaj tablice ne odgovara očekivanom — preskačem radi sigurnosti (provjeri ručno u Studiju).');
    return;
  }

  const flexTableBlock = {
    _type: 'flexTable',
    _key: key(),
    headers: ['', ...dataHeaders],
    rows: rowsData.map((cells) => ({ _key: key(), cells })),
  };

  body.splice(start, count, flexTableBlock);

  console.log(`\nČlanak: "${article.title}"`);
  console.log(`  → Tablica "Tri vrste proizvoda" → fleksibilna tablica (4 stupca, ${rowsData.length} redaka)`);

  if (!APPLY) {
    console.log('\nOvo je bio SAMO PREGLED — ništa nije spremljeno.');
    console.log('Ako popis izgleda točno, pokreni ponovno s --apply da se promjene spreme:');
    console.log('  npx tsx scripts/fix-lanci-navlake-table.ts --apply');
    return;
  }

  await client.patch(article._id).set({ body }).commit();
  console.log('\nGotovo! Tablica je spremljena u pravom formatu.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
