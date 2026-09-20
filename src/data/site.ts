export const siteName = 'DriveBy.hr';

export const theme = {
  light: {
    bg: '#fafaf9',
    bgSurface: '#ffffff',
    bgSurface2: '#f2f1ee',
    text: '#1c1b1a',
    textMuted: '#5b5955',
    border: '#e4e2df',
    accent: '#2563eb',
  },
  dark: {
    bg: '#15151a',
    bgSurface: '#1c1c22',
    bgSurface2: '#22222a',
    text: '#f2f1ef',
    textMuted: '#a7a5a0',
    border: '#2d2d36',
    accent: '#5b8bf5',
  },
};

export interface Category {
  slug: string;
  name: string;
  hue: number;
  intro: string;
}

export const categories: Category[] = [
  {
    slug: 'tehnicki-pregled',
    name: 'Tehnički pregled i preinake',
    hue: 20,
    intro:
      'Sve o tehničkom pregledu, homologaciji i legalnim preinakama vozila u Hrvatskoj – od ovjesa do ispuha, bez muke s inspektorima.',
  },
  {
    slug: 'odrzavanje',
    name: 'Održavanje i popravci',
    hue: 80,
    intro:
      'Redovito održavanje, kvarovi i popravci – vodiči koji štede novac u servisu i sprječavaju probleme na cesti.',
  },
  {
    slug: 'kupnja-prodaja',
    name: 'Kupnja i prodaja auta',
    hue: 140,
    intro:
      'Praktični savjeti za kupnju rabljenog vozila i uspješnu prodaju – checkliste, ugovori i procjena realne cijene.',
  },
  {
    slug: 'samostalni-popravci',
    name: 'Samostalni popravci i DIY',
    hue: 200,
    intro:
      'Vodiči korak po korak za popravke koje možeš odraditi sam u garaži – uz pravi alat, malo strpljenja i bez nepotrebnog odlaska u servis.',
  },
  {
    slug: 'oprema',
    name: 'Oprema i alati',
    hue: 260,
    intro:
      'Pregledi alata, dodatne opreme i pribora koji svakom vozaču olakšavaju održavanje i vožnju.',
  },
  {
    slug: 'novosti',
    name: 'Novosti i zakoni',
    hue: 320,
    intro:
      'Promjene u prometnim propisima, porezima i novosti iz automobilske industrije koje utječu na vozače u Hrvatskoj.',
  },
];

export const authors: Record<string, { name: string; bio: string }> = {
  'tehnicki-pregled': {
    name: 'Ivan Karburator',
    bio: 'Piše o tehničkom pregledu i preinakama već deset godina, uglavnom iz iskustva ispravljanja vlastitih grešaka.',
  },
  odrzavanje: {
    name: 'Petra Svjećica',
    bio: 'Održavanje shvaća kao prevenciju, ne kao vatrogasnu akciju. Vjeruje da svaki kvar ima zvuk koji ga najavljuje.',
  },
  'kupnja-prodaja': {
    name: 'Domagoj Kilometar',
    bio: 'Kupio i prodao više auta nego što bi trebao. Sve checkliste u ovoj kategoriji testirao je na vlastitoj koži.',
  },
  'samostalni-popravci': {
    name: 'Tomislav Ključ',
    bio: 'Garažu zove drugim domom. Vjeruje da 80% popravaka svatko može odraditi sam uz pravi alat i malo strpljenja.',
  },
  oprema: {
    name: 'Filip Alat',
    bio: 'Kupuje i testira alat prije nego ga preporuči. Garaža mu je urednija od stana.',
  },
  novosti: {
    name: 'Marta Propis',
    bio: 'Prati izmjene zakona i propisa da vozači ne moraju čitati Narodne novine.',
  },
};

export const affiliates: Record<
  string,
  { name: string; desc: string; price: string; hue: number }
> = {
  'tehnicki-pregled': {
    name: 'Set za homologaciju kotača',
    desc: 'TÜV dokumentacija + adapteri za mjerenje offseta',
    price: '39 €',
    hue: 20,
  },
  odrzavanje: {
    name: 'Sintetičko motorno ulje 5W-30, 5L',
    desc: 'ACEA C3 / API SN, za dizel i benzinske motore s DPF/FAP',
    price: '34 €',
    hue: 80,
  },
  'kupnja-prodaja': {
    name: 'Neovisna inspekcija vozila prije kupnje',
    desc: 'Pregled na 120 točaka s pisanim izvještajem',
    price: 'od 59 €',
    hue: 140,
  },
  recenzije: {
    name: 'OBD Bluetooth dijagnostički adapter',
    desc: 'Očitavanje i brisanje grešaka preko mobilne aplikacije',
    price: '24 €',
    hue: 200,
  },
  oprema: {
    name: 'Digitalni kompresor za automobil 12V',
    desc: 'LED svjetlo, automatsko isključivanje pri zadanom tlaku',
    price: '29 €',
    hue: 260,
  },
  novosti: {
    name: 'Osiguranje od pravne zaštite u prometu',
    desc: 'Pokriva troškove postupka kod prometnih prekršaja',
    price: 'od 6 €/mj',
    hue: 320,
  },
};

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function catName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}

export function catHue(slug: string): number {
  return getCategory(slug)?.hue ?? 220;
}

export function imgBg(hue: number): string {
  return `repeating-linear-gradient(115deg, oklch(0.93 0.045 ${hue}) 0px, oklch(0.93 0.045 ${hue}) 14px, oklch(0.88 0.06 ${hue}) 14px, oklch(0.88 0.06 ${hue}) 16px)`;
}

const MONTHS = ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'];

export function fmtDate(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}. ${MONTHS[parseInt(m, 10) - 1]} ${y}.`;
}
