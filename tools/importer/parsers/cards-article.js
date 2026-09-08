/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * 2-column block; one row per card: [image, text content].
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope > .article-card, :scope > a.card-link, :scope > a');
  const cells = [];

  cards.forEach((card) => {
    // First cell: image
    const image = card.querySelector('.article-card-image img, img');

    // Second cell: text content (meta, heading) plus a CTA link
    const textCell = [];
    const meta = card.querySelector('.article-card-meta');
    if (meta) textCell.push(meta);
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) textCell.push(heading);

    // Preserve the card link as a CTA when the card itself is an anchor
    const href = card.tagName === 'A' ? card.getAttribute('href') : (card.querySelector('a') && card.querySelector('a').getAttribute('href'));
    if (href) {
      const cta = document.createElement('a');
      cta.href = href;
      cta.textContent = heading ? heading.textContent.trim() : 'Read more';
      textCell.push(cta);
    }

    cells.push([image || '', textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
