/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Flexible columns block. Source has 2 top-level columns in a single row:
 * [image, text content (breadcrumbs, heading, author meta)].
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // The breadcrumb uses SVG chevrons as separators (inline <svg> or base64
  // <img> depending on the page); those would import as broken/empty images.
  // Strip both, keeping the text links.
  element.querySelectorAll('.breadcrumbs img, .breadcrumbs svg').forEach((sep) => sep.remove());

  // Each direct child div becomes a column cell in a single content row.
  const row = columns.map((col) => {
    const contents = Array.from(col.childNodes);
    return contents.length ? contents : '';
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
