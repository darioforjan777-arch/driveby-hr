// Creates 3 example articles for the new "Samostalni popravci i DIY" category.
// Safe to run once — uses createOrReplace with fixed _id's so re-running just
// overwrites the same 3 example articles instead of duplicating them.
//
// Usage: npx tsx scripts/create-diy-articles.ts
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

let keyCounter = 0;
const key = () => `k${Date.now().toString(36)}${keyCounter++}`;

function p(text: string) {
  return { _type: 'block', _key: key(), style: 'normal', children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] };
}
function h2(text: string) {
  return { _type: 'block', _key: key(), style: 'h2', children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] };
}
function quote(text: string) {
  return { _type: 'block', _key: key(), style: 'blockquote', children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] };
}
function bullets(items: string[]) {
  return items.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet' as const,
    level: 1,
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
  }));
}
function numbered(items: string[]) {
  return items.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'number' as const,
    level: 1,
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
  }));
}

const articles = [
  {
    slug: 'zamjena-akumulatora',
    title: 'Kako sam zamijeniti akumulator u autu',
    excerpt: 'Prazan ili star akumulator ne mora značiti odlazak u servis — zamjena traje 15-ak minuta uz pravi redoslijed koraka.',
    readMin: 6,
    published: '2026-08-10',
    body: [
      p('Zamjena akumulatora jedan je od najjednostavnijih popravaka koje možeš odraditi sam, bez ikakvog predznanja o mehanici. Treba ti samo osnovni alat i 15-ak minuta vremena.'),
      h2('Što ti treba'),
      ...bullets([
        'Novi akumulator iste snage (Ah) i polariteta kao stari — provjeri u servisnoj knjižici ili na starom akumulatoru',
        'Ključ odgovarajuće veličine za stezaljke (najčešće 10 mm)',
        'Zaštitne rukavice i naočale',
        'Krpa i po mogućnosti sredstvo za čišćenje kontakata',
      ]),
      h2('Koraci zamjene'),
      ...numbered([
        'Ugasi motor i izvadi ključ iz kontakta, otvori haubu',
        'Prvo odspoji minus (crnu, −) stezaljku, pa tek onda plus (crvenu, +) — ovim redoslijedom izbjegavaš kratki spoj',
        'Otpusti nosač koji drži akumulator na mjestu i pažljivo ga izvadi (akumulatori su teški, pazi na leđa)',
        'Očisti kontakte i sjedište prije stavljanja novog akumulatora',
        'Postavi novi akumulator, pričvrsti nosač, pa spoji stezaljke obrnutim redoslijedom — prvo plus, pa minus',
      ]),
      quote('Nikad ne zamijeni redoslijed spajanja — pogrešan redoslijed može izazvati iskrenje kod metalnih dijelova motora.'),
      h2('Nakon zamjene'),
      p('Nakon zamjene auto će vjerojatno tražiti da ponovno upišeš kod za radio i eventualno resetiraš sat na komandnoj ploči. Ako auto ima start-stop sustav ili je noviji model s puno elektronike, ponekad je potrebno "naučiti" novi akumulator preko OBD dijagnostike u servisu — ako se na komandnoj ploči nakon par dana vožnje pojavi upozorenje vezano za akumulator, to je znak da to treba obaviti.'),
    ],
    faq: [
      { q: 'Mogu li staviti akumulator manjeg kapaciteta od originalnog?', a: 'Ne preporučuje se — manji kapacitet (Ah) može otežati paljenje, pogotovo zimi, i skratiti vijek trajanja akumulatora.' },
      { q: 'Treba li isključiti sve trošila prije zamjene?', a: 'Da, ugasi motor, svjetla i sve uređaje (radio, klimu) prije nego počneš, da spriječiš nepotreban pad napona i iskrenje.' },
    ],
  },
  {
    slug: 'zamjena-kocionih-plocica',
    title: 'Zamjena kočionih pločica u 5 koraka',
    excerpt: 'Škripa pri kočenju ne mora odmah značiti odlazak u servis — uz malo strpljenja i osnovni alat, prednje kočione pločice možeš zamijeniti i sam.',
    readMin: 8,
    published: '2026-08-24',
    body: [
      p('Zamjena kočionih pločica zahtjevnija je od zamjene akumulatora, ali uz osnovni alat i malo pažnje izvediva je i u kućnoj garaži. Ovo je vodič za prednje kočione pločice, koje se najčešće troše brže od stražnjih.'),
      quote('Kočnice su sigurnosni dio auta — ako nisi siguran u bilo koji korak, radije prepusti servisu. Ova uputa ne zamjenjuje stručni pregled kočionog sustava.'),
      h2('Što ti treba'),
      ...bullets([
        'Nove kočione pločice za tvoj model (provjeri katalog po broju šasije)',
        'Dizalica i sigurnosni stalci (nikad ne radi ispod auta na samoj dizalici)',
        'Set nasadnih ključeva i imbus ključeva',
        'Alat za pritiskanje klipa kočionog cilindra (posebna kliješta ili C-stega)',
        'Sredstvo za čišćenje kočnica (brake cleaner)',
      ]),
      h2('Koraci zamjene'),
      ...numbered([
        'Otpusti matice na kotaču dok je auto još na tlu, zatim podigni auto dizalicom i osiguraj ga stalcima',
        'Skini kotač i pronađi kočioni čeljust (subap) koji drži pločice',
        'Odvrni vodilice čeljusti i pažljivo ga skini s diska, bez rastezanja kočionog crijeva',
        'Izvadi stare pločice, očisti nosač čeljusti od prašine i hrđe sredstvom za čišćenje kočnica',
        'Pritisni klip kočionog cilindra natrag u ležište, umetni nove pločice i sastavi sve obrnutim redoslijedom',
      ]),
      h2('Nakon zamjene'),
      p('Prije prve vožnje nekoliko puta pritisni papučicu kočnice u mirovanju dok ne osjetiš normalan otpor — to namješta klipove na novu debljinu pločica. Prvih stotinjak kilometara vozi blaže i izbjegavaj nagla kočenja dok se nove pločice ne uhodaju s diskovima.'),
    ],
    faq: [
      { q: 'Kako znam da je vrijeme za zamjenu pločica?', a: 'Najčešći znakovi su škripa ili struganje pri kočenju, produženi kočioni put i osjetljiva vibracija u papučici — kod većine pločica postoji i indikator debljine koji se vidi kroz naplatak.' },
      { q: 'Trebam li zamijeniti i kočione diskove?', a: 'Ne nužno — ako su diskovi glatki i unutar minimalne debljine propisane od proizvođača, dovoljna je zamjena samo pločica. Ako su izgrebani ili deformirani, zamijeni ih zajedno s pločicama.' },
    ],
  },
  {
    slug: 'zamjena-ulja-i-filtera',
    title: 'Zamjena motornog ulja i filtera kod kuće',
    excerpt: 'Redovna zamjena ulja jedan je od najvažnijih popravaka za dug vijek motora — evo kako je odraditi sam i uštedjeti na servisu.',
    readMin: 7,
    published: '2026-09-05',
    body: [
      p('Zamjena ulja i uljnog filtera klasičan je "prvi popravak" za svakog vlasnika auta koji želi manje ovisiti o servisu. Uz kantu, ključeve i pola sata vremena, ovo je posao koji se lako nauči.'),
      h2('Što ti treba'),
      ...bullets([
        'Motorno ulje ispravne specifikacije i viskoznosti za tvoj motor (provjeri servisnu knjižicu)',
        'Novi uljni filter',
        'Ključ za ispusni čep i za uljni filter',
        'Posuda za staro ulje (min. 6-7 litara)',
        'Lijevak i krpe',
      ]),
      h2('Koraci zamjene'),
      ...numbered([
        'Ugrij motor par minuta vožnje da ulje postane rjeđe i lakše isteče, zatim ugasi motor',
        'Podigni auto ili ga postavi na rampe radi pristupa ispod motora, i pronađi ispusni čep na kadi motora',
        'Odvrni ispusni čep i pusti staro ulje da potpuno isteče u posudu',
        'Odvrni stari uljni filter, namaži brtvu novog filtera s malo svježeg ulja i navrni ga rukom do kraja',
        'Vrati ispusni čep s novom brtvom, ulij novo ulje kroz otvor za dolijevanje prema propisanoj količini',
      ]),
      quote('Staro ulje nikad ne izlij u odvod ili prirodu — odnesi ga u reciklažno dvorište ili servis koji ga preuzima besplatno.'),
      h2('Nakon zamjene'),
      p('Pokreni motor i pusti ga da radi minutu u praznom hodu, provjeri curi li ulje oko čepa i filtera, zatim ugasi motor i pričekaj par minuta da ulje slegne prije provjere razine šipkom za mjerenje ulja. Razina treba biti između oznaka min i max.'),
    ],
    faq: [
      { q: 'Koliko često treba mijenjati ulje?', a: 'Ovisi o vrsti ulja i preporuci proizvođača, ali orijentacijski svakih 10.000-15.000 km ili jednom godišnje, ovisno što prije nastupi.' },
      { q: 'Mogu li miješati različite vrste ulja?', a: 'Nije preporučljivo — drži se viskoznosti i specifikacije koju propisuje proizvođač vozila, navedene u servisnoj knjižici.' },
    ],
  },
];

async function run() {
  console.log(`Kreiram ${articles.length} primjera članaka u kategoriji "samostalni-popravci"...`);
  const tx = client.transaction();
  for (const a of articles) {
    tx.createOrReplace({
      _id: `article-${a.slug}`,
      _type: 'article',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      categorySlug: 'samostalni-popravci',
      excerpt: a.excerpt,
      readMin: a.readMin,
      published: a.published,
      popular: false,
      featured: false,
      body: a.body,
      faq: a.faq.map((f, i) => ({ _type: 'faqItem', _key: `faq${i}`, q: f.q, a: f.a })),
    });
  }
  await tx.commit();
  console.log('Gotovo! 3 primjera članka su u Sanityju (bez naslovne slike — dodaj ih ručno u Studiju ako želiš).');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
