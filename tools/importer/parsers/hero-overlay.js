/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * 1-column hero. Row 2 = background image; Row 3 = heading, subheading, CTA.
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('img.cover-image, img.utility-overlay, img');

  const contentContainer = element.querySelector('.card-body') || element;
  const heading = contentContainer.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = contentContainer.querySelector('p, .subheading');
  const ctaLinks = Array.from(contentContainer.querySelectorAll('.button-group a, a.button'));

  if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional)
  if (bgImage) cells.push([bgImage]);

  // Row 3: text content (heading, subheading, CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
