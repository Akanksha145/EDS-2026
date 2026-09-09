import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });

    const body = li.querySelector('.cards-article-card-body');
    if (body) {
      // The last paragraph is a redundant link duplicating the title; use it to
      // make the whole card clickable (source wraps the card in an <a>).
      const linkP = [...body.querySelectorAll('p')].find((p) => p.querySelector('a'));
      const href = linkP?.querySelector('a')?.getAttribute('href');
      if (linkP) linkP.remove();

      // First paragraph holds meta text like "Casual Cool May 12".
      // Split trailing date ("Mon DD") into a separate muted label and wrap the
      // leading category text in a pill tag.
      const metaP = body.querySelector('p');
      if (metaP) {
        const meta = document.createElement('div');
        meta.className = 'cards-article-card-meta';
        const text = metaP.textContent.trim();
        // Category words followed by a date like "June 12" or "February 22, 2026".
        const m = text.match(/^(.*?)\s+([A-Z][a-z]{2,9}\.?\s+\d{1,2}(?:,\s*\d{4})?)$/);
        if (m) {
          const [, category, dateText] = m;
          const tag = document.createElement('span');
          tag.className = 'cards-article-tag';
          tag.textContent = category;
          const date = document.createElement('span');
          date.className = 'cards-article-date';
          date.textContent = dateText;
          meta.append(tag, date);
        } else {
          const tag = document.createElement('span');
          tag.className = 'cards-article-tag';
          tag.textContent = text;
          meta.append(tag);
        }
        metaP.replaceWith(meta);
      }

      if (href) {
        const link = document.createElement('a');
        link.className = 'cards-article-card-link';
        link.href = href;
        const title = body.querySelector('h1, h2, h3, h4, h5, h6');
        if (title) link.setAttribute('aria-label', title.textContent.trim());
        while (li.firstElementChild) link.append(li.firstElementChild);
        li.append(link);
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img')?.classList.add('cards-article-cover');
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
