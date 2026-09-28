// Popravlja tri "lažne tablice" (obični tekst red-po-red umjesto pravih table
// blokova) u članku "Priprema auta za zimu: checklista koju napraviš za jedno
// popodne" — uključujući jednu tablicu s 3 stupca koju stari fix-fake-tables.ts
// skript ne zna prepoznati (podržava samo 2 stupca).
//
// SAFE BY DEFAULT: bez --apply samo ispisuje što bi se promijenilo.
//
// Usage:
//   npx tsx scripts/fix-priprema-zimu-tables.ts            (dry run)
//   npx tsx scripts/fix-priprema-zimu-tables.ts --apply     (spremi promjene)
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
const SLUG = 'priprema-auta-za-zimu-checklista-koju-napravis-za-jedno-popodne';

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

// Zamjenjuje `count` blokova počevši od indexa `start` jednim novim blokom.
function spliceIn(body: any[], start: number, count: number, replacement: any) {
  body.splice(start, count, replacement);
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
  const changes: string[] = [];

  // --- Tablica 1: "Što / Kako provjeriti / Znak da treba djelovati" (3 stupca, 10 redaka) ---
  {
    const start = findIndex(body, ['Što', 'Kako provjeriti', 'Znak da treba djelovati']);
    if (start === -1) {
      console.log('Tablica "Checklista na jednom mjestu" nije pronađena kao obični tekst (možda je već popravljena).');
    } else {
      const rowsData = [
        ['Gume', 'Dubinomjer, DOT oznaka na boku', 'Ispod 4 mm, starije od 6-7 godina, bez oznake M+S'],
        ['Akumulator', 'Multimetar ili test u servisu', 'Ispod 12,4 V na hladnom autu, stariji od 4-5 godina'],
        ['Rashladna tekućina', 'Razina u posudi, mjerač zaštite od smrzavanja', 'Razina ispod MIN, zaštita slabija od očekivane zime'],
        ['Brisači', 'Pogled i jedan prolaz po staklu', 'Pruge, preskakanje, ispucala guma'],
        ['Tekućina za pranje', 'Pogled u posudu', 'Voda ili ljetna tekućina'],
        ['Svjetla', 'Obilazak auta s upaljenim svjetlima', 'Pregorjela žarulja, mutna stakla farova'],
        ['Tlak u gumama', 'Mjerač ili kompresor', 'Ispod vrijednosti s naljepnice na vozilu'],
        ['Kočnice', 'Zvuk i osjećaj papučice', 'Škripa, struganje, duži put papučice'],
        ['Brtve vrata', 'Pogled i dodir', 'Suhe ili ispucale gume'],
        ['Oprema u autu', 'Prtljažnik', 'Nema strugalice, rukavica, lampe, lanaca ako voziš ljetne gume'],
      ];
      const count = 3 + rowsData.length * 3;
      // Provjeri da se predviđeni broj redaka podudara sa stvarnim sadržajem prije nego što bilo što dirnemo.
      let ok = true;
      let idx = start + 3;
      for (const [c1, c2, c3] of rowsData) {
        if (
          !isPlainParagraph(body[idx]) || plainText(body[idx]) !== c1 ||
          !isPlainParagraph(body[idx + 1]) || plainText(body[idx + 1]) !== c2 ||
          !isPlainParagraph(body[idx + 2]) || plainText(body[idx + 2]) !== c3
        ) {
          ok = false;
          break;
        }
        idx += 3;
      }
      if (!ok) {
        console.error('Sadržaj tablice 1 ne odgovara očekivanom — preskačem radi sigurnosti (provjeri ručno u Studiju).');
      } else {
        const table3Block = {
          _type: 'table3',
          _key: key(),
          headerCol1: 'Što',
          headerCol2: 'Kako provjeriti',
          headerCol3: 'Znak da treba djelovati',
          rows: rowsData.map(([col1, col2, col3]) => ({ _key: key(), col1, col2, col3 })),
        };
        spliceIn(body, start, count, table3Block);
        changes.push(`Tablica "Checklista na jednom mjestu" → 3-stupčana tablica (${rowsData.length} redaka)`);
      }
    }
  }

  // --- Tablica 2: "Napon / Što znači" (2 stupca, 4 retka) ---
  {
    const start = findIndex(body, ['Napon', 'Što znači']);
    if (start === -1) {
      console.log('Tablica "Napon / Što znači" nije pronađena kao obični tekst (možda je već popravljena).');
    } else {
      const rowsData = [
        ['oko 12,6 V i više', 'Pun'],
        ['oko 12,4 V', 'Djelomično prazan'],
        ['ispod 12 V', 'Duboko prazan ili pri kraju vijeka'],
        ['13,5-14,5 V s upaljenim motorom', 'Punjenje radi'],
      ];
      const count = 2 + rowsData.length * 2;
      let ok = true;
      let idx = start + 2;
      for (const [label, value] of rowsData) {
        if (
          !isPlainParagraph(body[idx]) || plainText(body[idx]) !== label ||
          !isPlainParagraph(body[idx + 1]) || plainText(body[idx + 1]) !== value
        ) {
          ok = false;
          break;
        }
        idx += 2;
      }
      if (!ok) {
        console.error('Sadržaj tablice 2 ne odgovara očekivanom — preskačem radi sigurnosti.');
      } else {
        const tableBlock = {
          _type: 'table',
          _key: key(),
          headerCol1: 'Napon',
          headerCol2: 'Što znači',
          rows: rowsData.map(([label, value]) => ({ _key: key(), label, value })),
        };
        spliceIn(body, start, count, tableBlock);
        changes.push(`Tablica "Napon / Što znači" → 2-stupčana tablica (${rowsData.length} redaka)`);
      }
    }
  }

  // --- Tablica 3: "Kada / Što" (2 stupca, 6 redaka) ---
  {
    const start = findIndex(body, ['Kada', 'Što']);
    if (start === -1) {
      console.log('Tablica "Kad napraviti što" nije pronađena kao obični tekst (možda je već popravljena).');
    } else {
      const rowsData = [
        ['Početak listopada', 'Akumulator, rashladna tekućina, brisači, svjetla - dok ima vremena za zamjenu'],
        ['Sredina listopada', 'Dogovori termin za gume, prije nego vulkanizeri budu puni'],
        ['1. studenoga', 'Obavezna dnevna ili kratka svjetla danju (do 31. ožujka)'],
        ['Početak studenoga', 'Zimska tekućina za pranje, oprema u autu, tlak u gumama'],
        ['Do 15. studenoga', 'Zimska oprema na autu'],
        ['Tjedan dana nakon zamjene guma', 'Ponovna provjera tlaka i zategnutosti vijaka kotača'],
      ];
      const count = 2 + rowsData.length * 2;
      let ok = true;
      let idx = start + 2;
      for (const [label, value] of rowsData) {
        if (
          !isPlainParagraph(body[idx]) || plainText(body[idx]) !== label ||
          !isPlainParagraph(body[idx + 1]) || plainText(body[idx + 1]) !== value
        ) {
          ok = false;
          break;
        }
        idx += 2;
      }
      if (!ok) {
        console.error('Sadržaj tablice 3 ne odgovara očekivanom — preskačem radi sigurnosti.');
      } else {
        const tableBlock = {
          _type: 'table',
          _key: key(),
          headerCol1: 'Kada',
          headerCol2: 'Što',
          rows: rowsData.map(([label, value]) => ({ _key: key(), label, value })),
        };
        spliceIn(body, start, count, tableBlock);
        changes.push(`Tablica "Kad napraviti što" → 2-stupčana tablica (${rowsData.length} redaka)`);
      }
    }
  }

  if (changes.length === 0) {
    console.log('\nNema promjena — sve tablice su ili već ispravne ili se sadržaj ne poklapa s očekivanim.');
    return;
  }

  console.log(`\nČlanak: "${article.title}"`);
  for (const c of changes) console.log(`  → ${c}`);

  if (!APPLY) {
    console.log('\nOvo je bio SAMO PREGLED — ništa nije spremljeno.');
    console.log('Ako popis izgleda točno, pokreni ponovno s --apply da se promjene spreme:');
    console.log('  npx tsx scripts/fix-priprema-zimu-tables.ts --apply');
    return;
  }

  await client.patch(article._id).set({ body }).commit();
  console.log('\nGotovo! Tablice su spremljene u pravom formatu.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
