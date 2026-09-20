import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const SANITY_PROJECT_ID = 'mlukd3n9';
export const SANITY_DATASET = 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  // false: build-time fetches always get the freshest published content.
  // Sanity's CDN (useCdn: true) is faster but can lag behind a fresh publish
  // by up to a minute, which would bake stale content into a static build.
  useCdn: false,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: any) {
  // auto('format') lets Sanity's CDN serve WebP/AVIF to browsers that support it
  // (falling back to the original format otherwise), and quality(75) trims file
  // size without a visible drop in quality. fit('max') stops it from ever
  // upscaling past the original image's dimensions.
  return builder.image(source).auto('format').quality(75).fit('max');
}
