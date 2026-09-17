export type Block =
  | { type: 'checklist'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'warning'; text: string }
  | { type: 'tip'; text: string }
  | { type: 'table'; caption: string; rows: [string, string][] };

export interface Section {
  heading: string;
  paragraph: string;
  block?: Block;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  readMin: number;
  published: string;
  updated?: string;
  popular?: boolean;
  featured?: boolean;
  intro: string;
  warning?: string;
  sections: Section[];
  faq: FAQItem[];
  related: string[];
}

export const articles: Article[] = [
  {
    slug: 'legalizacija-preinaka-tehnicki-pregled',
    categorySlug: 'tehnicki-pregled',
    title: 'Kako legalizirati preinake na tehničkom pregledu',
    excerpt:
      'Koje preinake prolaze tehnički pregled u Hrvatskoj i kako ih pravilno prijaviti bez gubitka vremena.',
    readMin: 7,
    published: '2026-02-11',
    updated: '2026-06-02',
    popular: true,
    intro:
      'Preinaka koja nije prijavljena znači da vozilo, formalno, ne postoji u obliku u kojem ga vozite. Evo kako to riješiti bez iznenađenja na tehničkom.',
    warning:
      'Neprijavljena preinaka koja utječe na sigurnost može poništiti osiguranje u slučaju štete.',
    sections: [
      {
        heading: 'Koje preinake treba prijaviti',
        paragraph:
          'Svaka promjena koja utječe na sigurnost, emisije ili identifikacijske podatke vozila – ovjes, kotači, ispuh, snaga motora – mora se prijaviti i homologirati prije tehničkog pregleda.',
        block: {
          type: 'checklist',
          items: [
            'Promjena visine ovjesa',
            'Druga dimenzija kotača od tvorničke',
            'Zamjena ispušnog sustava',
            'Chip tuning s promjenom snage',
            'Ugradnja LPG/CNG uređaja',
          ],
        },
      },
      {
        heading: 'Postupak korak po korak',
        paragraph: 'Homologacija ide preko ovlaštene stanice, a ne preko stanice za tehnički pregled.',
        block: {
          type: 'steps',
          items: [
            'Odaberi ovlaštenu homologacijsku kuću',
            'Dostavi dokumentaciju proizvođača dijela',
            'Obavi tehnički pregled preinake',
            'Preuzmi rješenje i upiši promjenu u prometnu',
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Može li se preinaka legalizirati nakon što je već ugrađena?',
        a: 'Da, dokle god dio ima homologacijsku dokumentaciju i vozilo prođe kontrolni pregled.',
      },
      {
        q: 'Što ako preinaku ne prijavim?',
        a: 'Na redovnom tehničkom pregledu vozilo se ne ovjerava, a u slučaju nesreće osiguranje može odbiti isplatu.',
      },
    ],
    related: ['zamjena-naplatka-prijava', 'homologacija-lpg-koraci'],
  },
  {
    slug: 'zamjena-naplatka-prijava',
    categorySlug: 'tehnicki-pregled',
    title: 'Zamjena naplatka: kada je prijava obavezna',
    excerpt: 'Nisu sve alu felge isto – razmak, offset i nosivost odlučuju treba li ih prijaviti.',
    readMin: 5,
    published: '2026-01-20',
    intro:
      'Nova felga koja "lijepo pristaje" na oko ne znači da je legalna. Provjerite tri broja prije nego ih naručite.',
    sections: [
      {
        heading: 'Tri broja koja moraš znati',
        paragraph:
          'Dimenzija, offset (ET) i nosivost felge moraju odgovarati tvorničkim tolerancijama proizvođača vozila ili imati homologacijsku potvrdu.',
        block: {
          type: 'table',
          caption: 'Dozvoljene razlike od tvorničkih vrijednosti',
          rows: [
            ['Promjer felge', '± 1 cal uz odgovarajuću gumu'],
            ['Offset (ET)', 'prema TÜV izvještaju proizvođača felge'],
            ['Nosivost', 'mora biti ≥ od tvorničke po osovini'],
          ],
        },
      },
      {
        heading: 'Kad je potrebna homologacija',
        paragraph:
          'Ako felge nisu na tvorničkoj listi opreme za taj model, treba TÜV izvještaj koji dokazuje sukladnost.',
        block: {
          type: 'tip',
          text: 'Zatraži TÜV izvještaj od prodavača felgi prije kupnje – bez njega homologacija staje na prvom koraku.',
        },
      },
    ],
    faq: [
      {
        q: 'Trebam li prijaviti felge iste dimenzije kao tvorničke?',
        a: 'Ne, ako su identične dimenzije, offseta i nosivosti kao originalna oprema.',
      },
    ],
    related: ['legalizacija-preinaka-tehnicki-pregled', 'zimske-gume-dimenzije'],
  },
  {
    slug: 'homologacija-lpg-koraci',
    categorySlug: 'tehnicki-pregled',
    title: 'Homologacija LPG uređaja: koraci i troškovi',
    excerpt: 'Ugradnja plina jeftinija je od punjenja benzina, ali papirologija ima svoju cijenu i rokove.',
    readMin: 6,
    published: '2025-11-04',
    updated: '2026-03-15',
    intro:
      'LPG uređaj mora ugraditi ovlašteni serviser, a homologacija je obavezan korak prije prvog tehničkog pregleda nakon ugradnje.',
    sections: [
      {
        heading: 'Troškovi ugradnje i homologacije',
        paragraph: 'Cijena ovisi o veličini spremnika i broju cilindara motora.',
        block: {
          type: 'table',
          caption: 'Prosječni troškovi (2026.)',
          rows: [
            ['Ugradnja LPG kompleta', '650 – 950 EUR'],
            ['Homologacijski pregled', '80 – 120 EUR'],
            ['Upis u prometnu dozvolu', '25 EUR'],
          ],
        },
      },
      {
        heading: 'Redovna kontrola spremnika',
        paragraph:
          'Plinski spremnik ima rok valjanosti koji se kontrolira periodično, neovisno o tehničkom pregledu vozila.',
        block: {
          type: 'warning',
          text: 'Istekla kontrola plinskog spremnika povlači zabranu daljnje vožnje na plin dok se ne obavi ponovna ispitna kontrola.',
        },
      },
    ],
    faq: [
      {
        q: 'Utječe li LPG na garanciju vozila?',
        a: 'Ovlaštena ugradnja sama po sebi ne poništava garanciju, ali kvar izravno uzrokovan ugradnjom može biti izuzet.',
      },
    ],
    related: ['legalizacija-preinaka-tehnicki-pregled', 'kako-odabrati-motorno-ulje'],
  },
  {
    slug: 'kako-odabrati-motorno-ulje',
    categorySlug: 'odrzavanje',
    title: 'Kako odabrati pravo motorno ulje',
    excerpt: 'Viskoznost, norma i interval zamjene – tri podatka koja rješavaju 90% pitanja o ulju.',
    readMin: 6,
    published: '2026-03-02',
    popular: true,
    intro:
      'Pogrešno ulje ne uništava motor odmah, ali ubrzava trošenje. Evo kako čitati specifikaciju u servisnoj knjižici.',
    sections: [
      {
        heading: 'Što znače brojevi i norme',
        paragraph:
          'Oznaka poput 5W-30 govori o viskoznosti na hladno i na radnoj temperaturi, dok norme (ACEA, API) govore je li ulje kompatibilno s tvojim motorom.',
        block: {
          type: 'checklist',
          items: [
            'Provjeri preporučenu viskoznost u servisnoj knjižici',
            'Provjeri ACEA/API normu, ne samo viskoznost',
            'Za dizel s DPF filterom koristi Low SAPS ulje',
            'Ne mijenjaj interval zamjene "na oko"',
          ],
        },
      },
      {
        heading: 'Kada se ulje mijenja ranije',
        paragraph:
          'Kratke vožnje po gradu i stalno gušenje u gužvi skraćuju stvarni vijek ulja u odnosu na tvornički interval.',
        block: {
          type: 'tip',
          text: 'Ako većinom vozite kratke relacije po gradu, mijenjajte ulje na donjoj granici tvorničkog intervala, ne na gornjoj.',
        },
      },
    ],
    faq: [
      {
        q: 'Mogu li miješati sintetičko i polusintetičko ulje?',
        a: 'U nuždi da, ali dugoročno drži se jedne vrste kako bi svojstva ulja ostala dosljedna.',
      },
      {
        q: 'Utječe li krivo ulje na garanciju?',
        a: 'Da – servisna knjižica bilježi vrstu ulja, a korištenje neodgovarajuće specifikacije može biti razlog odbijanja reklamacije.',
      },
    ],
    related: ['zvukovi-kvar-ovjes', 'remen-zupcastog-prijenosa'],
  },
  {
    slug: 'zvukovi-kvar-ovjes',
    categorySlug: 'odrzavanje',
    title: 'Zvukovi koji otkrivaju kvar na ovjesu',
    excerpt: 'Škripa, lupanje i kloparanje – svaki zvuk upire prstom na drugi dio ovjesa.',
    readMin: 5,
    published: '2026-01-28',
    intro: 'Ovjes se rijetko pokvari bez upozorenja. Problem je što se upozorenje čuje, a ne vidi.',
    sections: [
      {
        heading: 'Prepoznavanje zvuka po dijelu',
        paragraph: 'Lokacija i vrsta zvuka gotovo uvijek upućuju na konkretan dio ovjesa.',
        block: {
          type: 'table',
          caption: 'Zvuk → mogući uzrok',
          rows: [
            ['Lupanje na neravninama', 'Istrošene šipke stabilizatora'],
            ['Škripa u krivini', 'Suhi ili istrošeni selen blokovi'],
            ['Kloparanje pri kočenju', 'Labavi ovjesni nosač ili kočione pločice'],
          ],
        },
      },
      {
        heading: 'Kad ne čekati sljedeći servis',
        paragraph: 'Neki zvukovi znače da je sigurnost vožnje već ugrožena.',
        block: {
          type: 'warning',
          text: 'Metalno struganje pri kočenju ili osjetljivo "plutanje" volana u krivini razlog su za odlazak u servis odmah, ne na sljedeći redovni pregled.',
        },
      },
    ],
    faq: [
      {
        q: 'Je li normalno da ovjes škripi po hladnom vremenu?',
        a: 'Blaga škripa na startu koja nestane nakon nekoliko metara često je bezopasna, ali ako se ponavlja treba je provjeriti.',
      },
    ],
    related: ['kako-odabrati-motorno-ulje', 'remen-zupcastog-prijenosa'],
  },
  {
    slug: 'remen-zupcastog-prijenosa',
    categorySlug: 'odrzavanje',
    title: 'Kada mijenjati remen zupčastog prijenosa',
    excerpt: 'Kašnjenje sa zamjenom razdvodnog remena spada u najskuplje pogreške koje se mogu izbjeći.',
    readMin: 6,
    published: '2025-12-10',
    updated: '2026-04-18',
    intro:
      'Interval zamjene remena zupčastog prijenosa nije preporuka – to je granica poslije koje rizik puknuća naglo raste.',
    sections: [
      {
        heading: 'Zamjena u koracima',
        paragraph: 'Zajedno s remenom uvijek treba mijenjati i pripadajuće komponente.',
        block: {
          type: 'steps',
          items: [
            'Provjera kilometraže i godina od zadnje zamjene',
            'Zamjena remena, zatezača i vodećih koloturnika',
            'Zamjena pumpe rashladne tekućine ako je na istom remenu',
            'Provjera pravilnog namještanja (timing) prije puštanja motora',
          ],
        },
      },
      {
        heading: 'Zašto štedjeti na ovome nije isplativo',
        paragraph: 'Puknuće remena kod motora s "interferentnim" ventilima obično znači oštećenje ventila i klipova.',
        block: {
          type: 'table',
          caption: 'Usporedba troška',
          rows: [
            ['Redovna zamjena remena', '250 – 450 EUR'],
            ['Popravak motora nakon puknuća', '1.500 – 4.000 EUR'],
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Vozim malo, treba li mi zamjena po kilometraži ili godinama?',
        a: 'Vrijedi koje god se prije dosegne – gumeni remen stari i bez vožnje.',
      },
    ],
    related: ['kako-odabrati-motorno-ulje', 'zvukovi-kvar-ovjes'],
  },
  {
    slug: 'checklista-kupnja-rabljenog-njuskalo',
    categorySlug: 'kupnja-prodaja',
    title: 'Checklista za kupnju rabljenog auta s Njuškala',
    excerpt: 'Dvadeset minuta provjere na licu mjesta može spriječiti mjesece problema i tisuće eura popravaka.',
    readMin: 8,
    published: '2026-04-05',
    updated: '2026-08-20',
    featured: true,
    popular: true,
    intro:
      'Oglas s lijepim slikama ne govori ništa o stvarnom stanju auta. Ova checklista prolazi kroz sve što se može provjeriti bez dizanja vozila na dizalicu.',
    warning:
      'Nikad ne plaćaj kaparu ili cijeli iznos prije nego provjeriš da prodavač na prometnoj dozvoli odgovara osobi s kojom razgovaraš.',
    sections: [
      {
        heading: 'Provjera na terenu',
        paragraph: 'Prije test vožnje pogledaj karoseriju, gume i tragove curenja tekućina.',
        block: {
          type: 'checklist',
          items: [
            'Ujednačen razmak spojeva lima (nema udara)',
            'Boja i debljina laka podudarna na svim panelima',
            'Nema tragova ulja ili rashladne tekućine ispod auta',
            'Gume ravnomjerno istrošene',
            'Datumi na servisnoj knjižici odgovaraju kilometraži',
          ],
        },
      },
      {
        heading: 'Test vožnja',
        paragraph: 'Vozi minimalno 20 minuta, po gradu i autocesti, s hladnim i toplim motorom.',
        block: {
          type: 'steps',
          items: [
            'Pokreni motor hladan i slušaj prve minute',
            'Provjeri mjenjač u svim brzinama',
            'Provjeri kočenje ravnom crtom i pri jačem kočenju',
            'Nakon 15-ak minuta provjeri temperaturu i miris iz kabine',
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Isplati li se platiti neovisnu inspekciju vozila?',
        a: 'Za automobile starije od 8 godina ili iznad 15.000 EUR skoro uvijek da – cijena inspekcije je mala u odnosu na rizik.',
      },
      {
        q: 'Je li normalno da prodavač ne dozvoli dulju test vožnju?',
        a: 'Nije – ozbiljan prodavač neće imati problem s razumnom, dogovorenom test vožnjom.',
      },
    ],
    related: ['procjena-cijene-rabljenog-vozila', 'ugovor-kupoprodaja-auta'],
  },
  {
    slug: 'procjena-cijene-rabljenog-vozila',
    categorySlug: 'kupnja-prodaja',
    title: 'Kako procijeniti realnu cijenu rabljenog vozila',
    excerpt: 'Cijena na oglasu je početna ponuda, ne činjenica. Evo kako doći do realne tržišne vrijednosti.',
    readMin: 6,
    published: '2026-02-22',
    intro:
      'Realna cijena rabljenog auta ovisi o više od kilometraže – stanje, servisna povijest i broj vlasnika mijenjaju vrijednost jednako snažno.',
    sections: [
      {
        heading: 'Faktori koji spuštaju cijenu',
        paragraph: 'Neki nedostaci opravdavaju popust veći nego što prodavač priznaje.',
        block: {
          type: 'table',
          caption: 'Tipičan utjecaj na cijenu',
          rows: [
            ['Bojani paneli (osim sitnih ogrebotina)', '−5 do −10%'],
            ['Nepotpuna servisna knjižica', '−5 do −8%'],
            ['Uvezeno vozilo bez dokaza o povijesti', '−8 do −15%'],
          ],
        },
      },
      {
        heading: 'Kako usporediti tržište',
        paragraph:
          'Gledaj minimalno 10-15 sličnih oglasa iste godine, motorizacije i kilometraže prije nego uđeš u pregovore.',
        block: {
          type: 'tip',
          text: 'Zapiši prosjek cijene tri najsličnija oglasa i koristi ga kao argument u pregovorima, ne osjećaj.',
        },
      },
    ],
    faq: [
      {
        q: 'Vrijedi li provjera kroz VIN broj?',
        a: 'Da – provjera VIN-a otkriva broj prethodnih vlasnika, uvoz i, kod nekih baza, prijavljene štete.',
      },
    ],
    related: ['checklista-kupnja-rabljenog-njuskalo', 'ugovor-kupoprodaja-auta'],
  },
  {
    slug: 'ugovor-kupoprodaja-auta',
    categorySlug: 'kupnja-prodaja',
    title: 'Ugovor o kupoprodaji auta: na što paziti',
    excerpt: 'Dobar ugovor štiti obje strane – i kupca od skrivenih mana i prodavača od kasnijih potraživanja.',
    readMin: 5,
    published: '2026-05-14',
    intro:
      'Usmeni dogovor "sve je u redu" ne vrijedi ništa pred zakonom. Ugovor mora sadržavati konkretne podatke i izjave o stanju vozila.',
    sections: [
      {
        heading: 'Obavezni elementi ugovora',
        paragraph: 'Bez ovih podataka ugovor je pravno slab i teško ga je koristiti u sporu.',
        block: {
          type: 'checklist',
          items: [
            'Puni podaci kupca i prodavača (OIB, adresa)',
            'VIN broj, marka, model i godina vozila',
            'Točan iznos i način plaćanja',
            'Izjava o kilometraži i stanju vozila',
            'Datum i mjesto potpisivanja',
          ],
        },
      },
      {
        heading: 'Prijenos vlasništva',
        paragraph: 'Prijenos u prometnoj dozvoli treba obaviti u zakonskom roku od dana kupnje.',
        block: {
          type: 'warning',
          text: 'Ako prodavač ne odjavi vozilo, sve dok ne prijaviš prijenos i on ostaje formalni vlasnik i odgovoran za eventualne prekršaje.',
        },
      },
    ],
    faq: [
      {
        q: 'Treba li ugovor ovjeriti kod javnog bilježnika?',
        a: 'Nije obavezno za osobna vozila, ali ovjera dodatno štiti obje strane kod većih iznosa.',
      },
    ],
    related: ['checklista-kupnja-rabljenog-njuskalo', 'procjena-cijene-rabljenog-vozila'],
  },
  {
    slug: 'skoda-octavia-3-2-0-tdi-iskustva',
    categorySlug: 'recenzije',
    title: 'Škoda Octavia III 2.0 TDI: iskustva vlasnika',
    excerpt: 'Jedan od najprodavanijih rabljenih auta u Hrvatskoj – što vlasnici zapravo kažu nakon 100.000+ km.',
    readMin: 7,
    published: '2026-03-19',
    popular: true,
    intro:
      'Octavia III s 2.0 TDI motorom postala je gotovo zadana preporuka za obiteljski auto. Evo gdje ta reputacija drži vodu, a gdje ne.',
    sections: [
      {
        heading: 'Što vlasnici hvale',
        paragraph: 'Prostor, potrošnja i jednostavnost servisiranja najčešće se spominju kao najveće prednosti.',
        block: {
          type: 'checklist',
          items: [
            'Potrošnja 4,5–5,5 l/100km na duže staze',
            'Velik prtljažnik i prostor za noge',
            'Rasprostranjena mreža neovisnih servisa i jeftini dijelovi',
          ],
        },
      },
      {
        heading: 'Na što obratiti pažnju kod kupnje',
        paragraph: 'DSG mjenjač i EGR ventil najčešća su mjesta skupljih popravaka na starijim primjercima.',
        block: {
          type: 'table',
          caption: 'Najčešći kvarovi po kilometraži',
          rows: [
            ['80.000 – 120.000 km', 'EGR ventil, senzori tlaka'],
            ['120.000 – 180.000 km', 'Mehatronika DSG mjenjača'],
            ['180.000+ km', 'Turbina, ovjes'],
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Je li DSG mjenjač pouzdan na ovom modelu?',
        a: 'Uz redovnu zamjenu ulja u mjenjaču na 60.000 km, DSG je uglavnom pouzdan; problemi dolaze od zapuštenog održavanja.',
      },
    ],
    related: ['vw-golf-7-16-tdi-prednosti-mane', 'checklista-kupnja-rabljenog-njuskalo'],
  },
  {
    slug: 'vw-golf-7-16-tdi-prednosti-mane',
    categorySlug: 'recenzije',
    title: 'VW Golf VII 1.6 TDI – prednosti i mane',
    excerpt: 'Neutralan pregled najprodavanijeg kompaktnog dizelaša u regiji, bez uljepšavanja.',
    readMin: 6,
    published: '2026-01-09',
    updated: '2026-05-30',
    intro:
      'Golf VII 1.6 TDI ima reputaciju "sigurne kupnje". Iskustva vlasnika tu reputaciju uglavnom potvrđuju, uz nekoliko iznimaka.',
    sections: [
      {
        heading: 'Prednosti u svakodnevnoj vožnji',
        paragraph: 'Vozna dinamika i kvaliteta unutrašnjosti i danas djeluju suvremeno.',
        block: {
          type: 'checklist',
          items: [
            'Ugodan i tih na autocesti',
            'Kvalitetni materijali u kabini za tu klasu',
            'Dobra dostupnost rezervnih dijelova',
          ],
        },
      },
      {
        heading: 'Poznate mane',
        paragraph: 'DPF filter i EGR sustav osjetljivi su na kratke gradske vožnje.',
        block: {
          type: 'warning',
          text: 'Ako Golf VII 1.6 TDI vozite isključivo po gradu na kratkim relacijama, DPF filter se začepljuje brže i traži skuplje intervencije.',
        },
      },
    ],
    faq: [
      {
        q: 'Koji je najpouzdaniji motor u ovoj generaciji Golfa?',
        a: '1.6 TDI 105 KS smatra se jednim od najizdržljivijih, uz uredno održavanje EGR-a i DPF-a.',
      },
    ],
    related: ['skoda-octavia-3-2-0-tdi-iskustva', 'renault-clio-4-pouzdanost'],
  },
  {
    slug: 'renault-clio-4-pouzdanost',
    categorySlug: 'recenzije',
    title: 'Renault Clio IV: pouzdanost nakon 150.000 km',
    excerpt: 'Gradski ljubimac s dobrom potrošnjom – ali servisna disciplina odlučuje hoće li ostati jeftin za održavanje.',
    readMin: 5,
    published: '2025-10-30',
    intro:
      'Clio IV je čest izbor za prvi auto. Nakon 150.000 km, iskustva vlasnika pokazuju gdje popušta prije ostalih.',
    sections: [
      {
        heading: 'Gdje se auto pokazao dobro',
        paragraph: 'Benzinski 1.2 i dizel 1.5 dCi motori pokazali su se izdržljivima uz redovno održavanje.',
        block: {
          type: 'tip',
          text: 'Kod dCi motora redovna zamjena filtra goriva prema intervalu značajno smanjuje rizik kvara ubrizgivača.',
        },
      },
      {
        heading: 'Slabije točke',
        paragraph: 'Električni prozori, senzori i manji elektronski kvarovi učestaliji su nego kod konkurencije.',
        block: {
          type: 'checklist',
          items: [
            'Provjeri rad svih el. podizača prozora',
            'Provjeri rad klima uređaja i senzora parkiranja',
            'Provjeri brtvljenje vjetrobranskog stakla',
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Je li 1.5 dCi motor skup za održavanje?',
        a: 'Nije, dijelovi su pristupačni, ali zahtijeva strogo poštivanje intervala zamjene ulja i filtra goriva.',
      },
    ],
    related: ['vw-golf-7-16-tdi-prednosti-mane', 'skoda-octavia-3-2-0-tdi-iskustva'],
  },
  {
    slug: 'najbolji-obd-alati-do-100-eur',
    categorySlug: 'oprema',
    title: 'Najbolji OBD dijagnostički alati do 100 EUR',
    excerpt: 'Kućni OBD čitač ne zamjenjuje servis, ali može spriječiti nepotrebnu paniku i nepotreban odlazak na dijagnostiku.',
    readMin: 5,
    published: '2026-04-27',
    intro: 'Kada se upali lampica motora, jeftin OBD čitač u autu prvo pokaže je li riječ o sitnici ili ozbiljnom kvaru.',
    sections: [
      {
        heading: 'Na što obratiti pažnju kod odabira',
        paragraph:
          'Podrška za sve sustave (motor, ABS, airbag), ne samo motor, glavna je razlika između jeftinih i kvalitetnih uređaja.',
        block: {
          type: 'checklist',
          items: [
            'Podrška za sve sustave vozila, ne samo motor',
            'Redovita ažuriranja baze grešaka',
            'Kompatibilnost s aplikacijom na hrvatskom ili engleskom jeziku',
            'Bluetooth verzija za lakše korištenje s telefonom',
          ],
        },
      },
      {
        heading: 'Kako pročitati grešku bez panike',
        paragraph: 'Kod greške je samo početna točka – uvijek provjeri i opis, ne samo šifru.',
        block: {
          type: 'steps',
          items: [
            'Spoji čitač na OBD utičnicu (obično ispod volana)',
            'Uključi paljenje bez pokretanja motora',
            'Pročitaj kod greške i njen opis',
            'Usporedi s priručnikom modela prije odlaska u servis',
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Može li OBD čitač oštetiti auto?',
        a: 'Ne, čitanje kodova je pasivna operacija; problem nastaje samo ako se koristi za brisanje grešaka bez razumijevanja uzroka.',
      },
    ],
    related: ['zimske-gume-dimenzije', 'kompresor-za-auto-odabir'],
  },
  {
    slug: 'zimske-gume-dimenzije',
    categorySlug: 'oprema',
    title: 'Zimske gume: kako izabrati pravu dimenziju',
    excerpt: 'Dimenzija na naljepnici u vratima nije preporuka – to je zakonska obaveza za tehnički pregled.',
    readMin: 4,
    published: '2025-11-18',
    updated: '2026-01-05',
    intro:
      'Manja dimenzija zimskih guma od propisane može uzrokovati pad na tehničkom pregledu, a veća utjecati na rad ABS-a i ESP-a.',
    sections: [
      {
        heading: 'Gdje pronaći ispravnu dimenziju',
        paragraph: 'Nalazi se na naljepnici na B-stupu vrata ili u servisnoj knjižici, ne nužno na trenutnim gumama.',
        block: {
          type: 'tip',
          text: 'Ako auto ima dvije dopuštene dimenzije (npr. 16" i 17"), zimske gume mogu biti manje dimenzije radi bolje udobnosti i cijene.',
        },
      },
      {
        heading: 'Zakonski minimum dubine profila',
        paragraph: 'Dubina profila ispod zakonskog minimuma povlači kaznu i pad tehničkog pregleda.',
        block: {
          type: 'table',
          caption: 'Zakonski minimumi',
          rows: [
            ['Zimske gume', 'min. 4 mm dubine profila'],
            ['Ljetne gume', 'min. 1,6 mm dubine profila'],
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Moraju li sve četiri gume biti iste marke?',
        a: 'Zakonski ne moraju, ali preporučuje se – razlike u prionjivosti između marki utječu na stabilnost vozila.',
      },
    ],
    related: ['najbolji-obd-alati-do-100-eur', 'kompresor-za-auto-odabir'],
  },
  {
    slug: 'kompresor-za-auto-odabir',
    categorySlug: 'oprema',
    title: 'Kompresor za auto: koji odabrati i zašto',
    excerpt: 'Mali digitalni kompresor u prtljažniku rješava probušenu gumu bez čekanja pomoći na cesti.',
    readMin: 4,
    published: '2026-02-08',
    intro:
      'Kompresor od 30-40 EUR često izbjegne skuplji trošak – vučnu službu ili zamjenu naplatka nakon vožnje na ispuhanoj gumi.',
    sections: [
      {
        heading: 'Što provjeriti prije kupnje',
        paragraph: 'Brzina punjenja i preciznost mjerača tlaka razlikuju kvalitetan kompresor od igračke.',
        block: {
          type: 'checklist',
          items: [
            'Digitalni prikaz tlaka, ne analogni',
            'Brzina punjenja do 2 bara u razumnom vremenu',
            'LED svjetlo za rad noću',
            'Kabel dovoljno dug za sve četiri gume',
          ],
        },
      },
      {
        heading: 'Kako ga koristiti pravilno',
        paragraph: 'Kompresor puni sporije nego što misliš – strpljenje čuva i njega i akumulator.',
        block: {
          type: 'steps',
          items: [
            'Pokreni motor prije spajanja kompresora',
            'Spoji na 12V utičnicu i na gumu',
            'Napuni do propisanog tlaka iz priručnika',
            'Isključi motor tek nakon isključivanja kompresora',
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Može li kompresor isprazniti akumulator?',
        a: 'Kratko korištenje uz upaljen motor ne predstavlja rizik; dugo punjenje s isključenim motorom može.',
      },
    ],
    related: ['zimske-gume-dimenzije', 'najbolji-obd-alati-do-100-eur'],
  },
  {
    slug: 'nova-pravila-tehnickog-pregleda-2026',
    categorySlug: 'novosti',
    title: 'Nova pravila tehničkog pregleda od 2026. godine',
    excerpt: 'Nekoliko promjena u postupku tehničkog pregleda utječe na to koliko često i što se točno provjerava.',
    readMin: 5,
    published: '2026-01-15',
    updated: '2026-07-01',
    intro:
      'Izmjene pravilnika o tehničkim pregledima donose strože provjere emisijskog sustava i noviju opremu na stanicama.',
    sections: [
      {
        heading: 'Što se konkretno mijenja',
        paragraph: 'Provjera se sada oslanja i na očitanje OBD sustava vozila, ne samo na vizualni pregled.',
        block: {
          type: 'checklist',
          items: [
            'Obavezno OBD očitanje kod vozila proizvedenih nakon 2010.',
            'Stroža provjera brtvljenja DPF/FAP filtera',
            'Detaljnija provjera sustava za pomoć u vožnji (ADAS)',
          ],
        },
      },
      {
        heading: 'Što to znači za vozača',
        paragraph: 'Vozila s neriješenim greškama na senzorima mogu pasti tehnički pregled i kada "vizualno" sve izgleda uredno.',
        block: {
          type: 'warning',
          text: 'Upaljena lampica motora sama po sebi može biti razlog za pad tehničkog pregleda, bez obzira na težinu stvarnog kvara.',
        },
      },
    ],
    faq: [
      {
        q: 'Vrijede li nova pravila za sva vozila odmah?',
        a: 'Primjenjuju se postupno prema godini proizvodnje vozila, prema rasporedu koji objavljuje nadležno tijelo.',
      },
    ],
    related: ['porez-na-vozila-izmjene', 'kazne-mobitel-u-voznji'],
  },
  {
    slug: 'porez-na-vozila-izmjene',
    categorySlug: 'novosti',
    title: 'Porez na vozila: što se mijenja ove godine',
    excerpt: 'Izmjene u obračunu poreza na vozila utječu na trošak registracije i kupnje novog auta.',
    readMin: 5,
    published: '2026-02-27',
    popular: true,
    intro:
      'Porezna osnovica sve više ovisi o emisiji CO2, što mijenja odnos cijene benzinskih, dizelskih i električnih vozila.',
    sections: [
      {
        heading: 'Kako se sada računa porez',
        paragraph: 'Emisija CO2 i cijena vozila zajedno određuju konačni iznos posebnog poreza pri prvoj registraciji.',
        block: {
          type: 'table',
          caption: 'Okvirni raspon poreza po CO2 razredu',
          rows: [
            ['do 120 g/km CO2', 'niži razred poreza'],
            ['120 – 160 g/km CO2', 'srednji razred'],
            ['preko 160 g/km CO2', 'viši razred poreza'],
          ],
        },
      },
      {
        heading: 'Utjecaj na godišnju registraciju',
        paragraph: 'Osim jednokratnog poreza, godišnja naknada za ceste i ekološka naknada također se preračunavaju.',
        block: {
          type: 'tip',
          text: 'Prije kupnje novog vozila provjeri službeni CO2 podatak proizvođača – razlika od nekoliko grama po km može promijeniti poreznu klasu.',
        },
      },
    ],
    faq: [
      {
        q: 'Plaćaju li električna vozila poseban porez?',
        a: 'Trenutno imaju povlašteni tretman i znatno niže poreze i naknade u odnosu na vozila s motorima s unutarnjim izgaranjem.',
      },
    ],
    related: ['nova-pravila-tehnickog-pregleda-2026', 'kazne-mobitel-u-voznji'],
  },
  {
    slug: 'kazne-mobitel-u-voznji',
    categorySlug: 'novosti',
    title: 'Nove kazne za korištenje mobitela u vožnji',
    excerpt: 'Iznosi kazni i broj kaznenih bodova za korištenje mobitela za volanom značajno su povećani.',
    readMin: 4,
    published: '2026-03-30',
    intro: 'Korištenje mobitela bez handsfree uređaja tijekom vožnje sada nosi veće kazne i brže gubljenje bodova.',
    sections: [
      {
        heading: 'Iznosi kazni',
        paragraph: 'Kazna ovisi o tome je li riječ o prvom prekršaju ili ponavljanju u kratkom razdoblju.',
        block: {
          type: 'table',
          caption: 'Pregled kazni',
          rows: [
            ['Prvi prekršaj', 'novčana kazna + kazneni bodovi'],
            ['Ponovljeni prekršaj u kratkom roku', 'viša kazna + mogući gubitak vozačke dozvole'],
          ],
        },
      },
      {
        heading: 'Što se smatra dozvoljenim korištenjem',
        paragraph: 'Handsfree, ugrađeni sustav vozila ili držač s glasovnim upravljanjem i dalje su dopušteni.',
        block: {
          type: 'checklist',
          items: [
            'Handsfree slušalica ili ugrađeni Bluetooth sustav',
            'Držač telefona uz glasovno upravljanje',
            'Telefon isključivo za navigaciju uz glasovne naredbe',
          ],
        },
      },
    ],
    faq: [
      {
        q: 'Vrijedi li kazna i kad je auto zaustavljen u koloni?',
        a: 'Da, dok je motor upaljen i vozilo na kolniku, korištenje mobitela u ruci i dalje se smatra prekršajem.',
      },
    ],
    related: ['nova-pravila-tehnickog-pregleda-2026', 'porez-na-vozila-izmjene'],
  },
];

export function getArticlesByCategory(slug: string): Article[] {
  return articles.filter((a) => a.categorySlug === slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeatured(): Article {
  return articles.find((a) => a.featured) ?? articles[0];
}

export function getPopular(n = 5): Article[] {
  return articles
    .filter((a) => a.popular)
    .concat(articles.filter((a) => !a.popular))
    .slice(0, n);
}

export function getLatest(n = 6, excludeSlug?: string): Article[] {
  return articles
    .filter((a) => a.slug !== excludeSlug)
    .slice()
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, n);
}
