/**
 * hero-overlay -- full-bleed cover image with dark overlay, heading, subheading, CTA.
 * The block renders as two rows: image row (first) and content row (last).
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture, img'));

  // First row is the background image; mark absence so layout can adapt if needed.
  if (!imageRow) {
    block.classList.add('no-image');
  }

  // Prioritise the LCP hero image.
  const img = block.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
  }
}
