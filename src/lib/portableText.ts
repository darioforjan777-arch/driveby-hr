// Minimal Portable Text -> HTML renderer (no React needed).
// Supports: normal/h3/h4 block styles, bullet/number lists, strong/em marks, plain links, inline images.

import { urlForImage } from './sanity';

interface PTSpan {
  _type: 'span';
  text: string;
  marks?: string[];
}

interface PTBlock {
  _type: 'block';
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children: PTSpan[];
  markDefs?: { _key: string; _type: string; href?: string }[];
}

interface PTImage {
  _type: 'image';
  alt?: string;
  asset?: { _ref?: string };
  [key: string]: unknown;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderSpans(children: PTSpan[] = [], markDefs: PTBlock['markDefs'] = []): string {
  return children
    .map((span) => {
      let text = escapeHtml(span.text ?? '');
      const marks = span.marks ?? [];
      for (const mark of marks) {
        const def = markDefs?.find((d) => d._key === mark);
        if (def && def._type === 'link' && def.href) {
          text = `<a href="${escapeHtml(def.href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        } else if (mark === 'strong') {
          text = `<strong>${text}</strong>`;
        } else if (mark === 'em') {
          text = `<em>${text}</em>`;
        }
      }
      return text;
    })
    .join('');
}

export interface TocEntry {
  label: string;
  id: string;
}

function renderImage(image: PTImage): string {
  if (!image?.asset) return '';
  const alt = escapeHtml(image.alt ?? '');
  const url = urlForImage(image).width(1200).url();
  return `<img src="${url}" alt="${alt}" loading="lazy" style="width:100%; height:auto; border-radius:12px; margin:6px 0 20px;" />`;
}

export function renderArticleBody(blocks: (PTBlock | PTImage)[] | undefined | null): { html: string; toc: TocEntry[] } {
  if (!blocks || blocks.length === 0) return { html: '', toc: [] };
  let html = '';
  let listOpen: 'bullet' | 'number' | null = null;
  const toc: TocEntry[] = [];
  let h2count = 0;

  const closeList = () => {
    if (listOpen === 'bullet') html += '</ul>';
    if (listOpen === 'number') html += '</ol>';
    listOpen = null;
  };

  for (const rawBlock of blocks) {
    if (rawBlock._type === 'image') {
      closeList();
      html += renderImage(rawBlock as PTImage);
      continue;
    }
    const block = rawBlock as PTBlock;
    if (block._type !== 'block') continue;

    if (block.listItem) {
      if (listOpen !== block.listItem) {
        closeList();
        html += block.listItem === 'bullet' ? '<ul>' : '<ol>';
        listOpen = block.listItem;
      }
      html += `<li>${renderSpans(block.children, block.markDefs)}</li>`;
      continue;
    }

    closeList();

    const inner = renderSpans(block.children, block.markDefs);
    if (!inner.trim()) continue;

    if (block.style === 'h2') {
      const id = `sec-${h2count++}`;
      const plainText = (block.children ?? []).map((c) => c.text).join('');
      toc.push({ label: plainText, id });
      html += `<h2 id="${id}">${inner}</h2>`;
    } else if (block.style === 'h3') {
      html += `<h3>${inner}</h3>`;
    } else if (block.style === 'h4') {
      html += `<h4>${inner}</h4>`;
    } else if (block.style === 'blockquote') {
      html += `<blockquote>${inner}</blockquote>`;
    } else {
      html += `<p>${inner}</p>`;
    }
  }
  closeList();
  return { html, toc };
}

export function renderPortableText(blocks: PTBlock[] | undefined | null): string {
  if (!blocks || blocks.length === 0) return '';
  let html = '';
  let listOpen: 'bullet' | 'number' | null = null;

  const closeList = () => {
    if (listOpen === 'bullet') html += '</ul>';
    if (listOpen === 'number') html += '</ol>';
    listOpen = null;
  };

  for (const block of blocks) {
    if (block._type !== 'block') continue;

    if (block.listItem) {
      if (listOpen !== block.listItem) {
        closeList();
        html += block.listItem === 'bullet' ? '<ul>' : '<ol>';
        listOpen = block.listItem;
      }
      html += `<li>${renderSpans(block.children, block.markDefs)}</li>`;
      continue;
    }

    closeList();

    const inner = renderSpans(block.children, block.markDefs);
    if (!inner.trim()) continue;

    switch (block.style) {
      case 'h2':
        html += `<h2>${inner}</h2>`;
        break;
      case 'h3':
        html += `<h3>${inner}</h3>`;
        break;
      case 'h4':
        html += `<h4>${inner}</h4>`;
        break;
      case 'blockquote':
        html += `<blockquote>${inner}</blockquote>`;
        break;
      default:
        html += `<p>${inner}</p>`;
    }
  }
  closeList();
  return html;
}
