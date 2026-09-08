/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Image-only gallery. 2-column block; one row per card: [image, text].
 * These cards have no text content, so the text cell is left empty.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll(':scope > div');
  const cells = [];

  items.forEach((item) => {
    const image = item.querySelector('img') || (item.tagName === 'IMG' ? item : null);
    if (!image) return;

    // Optional text content, if any accompanies the image
    const textCell = [];
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textCell.push(heading);
    item.querySelectorAll('p').forEach((p) => textCell.push(p));

    cells.push([image, textCell.length ? textCell : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
