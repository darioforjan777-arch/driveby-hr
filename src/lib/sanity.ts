import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const SANITY_PROJECT_ID = 'mlukd3n9';
export const SANITY_DATASET = 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: any) {
  return builder.image(source);
}
