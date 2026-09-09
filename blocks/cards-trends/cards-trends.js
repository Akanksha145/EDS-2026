import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-trends-card-image';
      else div.className = 'cards-trends-card-body';
    });

    const body = li.querySelector('.cards-trends-card-body');
    if (body) {
      // The last paragraph is a redundant link duplicating the title; use it to
      // make the whole card clickable (source wraps the card in an <a>).
      const linkP = [...body.querySelectorAll('p')].find((p) => p.querySelector('a'));
      const href = linkP?.querySelector('a')?.getAttribute('href');
      if (linkP) linkP.remove();

      // First paragraph is the category tag; render it as a pill.
      const tagP = body.querySelector('p');
      if (tagP && tagP.textContent.trim()) {
        const tag = document.createElement('span');
        tag.className = 'cards-trends-tag';
        tag.textContent = tagP.textContent.trim();
        tagP.replaceWith(tag);
      }

      if (href) {
        const link = document.createElement('a');
        link.className = 'cards-trends-card-link';
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
    optimizedPic.querySelector('img')?.classList.add('cards-trends-cover');
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
