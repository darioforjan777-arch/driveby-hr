# DriveByHR (drivebyhr.com) — auto blog

Astro projekt za blog o autima (tehnički pregled, održavanje, kupnja/prodaja, recenzije, oprema, novosti).

## Pokretanje lokalno

```bash
npm install
npm run dev
```

Otvori http://localhost:4321

## Build za produkciju

```bash
npm run build
npm run preview
```

## Kako dodati novi članak

Otvori `src/data/articles.ts` i dodaj novi objekt u `articles` niz — kopiraj postojeći
članak kao predložak i promijeni sadržaj. Dostupni tipovi blokova unutar `sections`:

- `checklist` — lista sa kvačicama
- `steps` — numerirani koraci
- `warning` — naglašeni okvir "Pazi!"
- `tip` — okvir "Savjet"
- `table` — tablica s dva stupca (naziv / vrijednost)

Nakon spremanja, slug članka (`slug` polje) automatski postaje URL: `/clanak/<slug>/`.

## Kako dodati novu kategoriju

Otvori `src/data/site.ts` i dodaj novi objekt u `categories` niz (slug, name, hue, intro).
Po potrebi dodaj i autora u `authors` te affiliate proizvod u `affiliates`.

## Deploy na Vercel

1. Stavi ovaj projekt u GitHub repozitorij
2. Na vercel.com poveži repozitorij (Vercel prepoznaje Astro automatski)
3. Deploy

## Napomena o besplatnom (Hobby) Vercel planu

Vercel Hobby plan je namijenjen za nekomercijalnu upotrebu. Kad blog počne imati
oglase/affiliate linkove kao stalan izvor prihoda, razmotri prelazak na Pro plan.
