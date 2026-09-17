// Minimal Portable Text -> HTML renderer (no React needed).
// Supports: normal/h3/h4 block styles, bullet/number lists, strong/em marks, plain links.

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
      case 'h3':
        html += `<h3>${inner}</h3>`;
        break;
      case 'h4':
        html += `<h4>${inner}</h4>`;
        break;
      default:
        html += `<p>${inner}</p>`;
    }
  }
  closeList();
  return html;
}
