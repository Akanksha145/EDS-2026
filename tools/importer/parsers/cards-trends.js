/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-trends. Base: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport (#trends)
 * Dense category card grid. Each card is an <a> wrapping an image
 * (.trend-card-image) and a body (.trend-card-body) with a category tag, a
 * title heading, and a short description paragraph.
 *
 * IMPORTANT: the source markup is a run of sibling <a class="trend-card"> whose
 * children are two <div>s (image + body). Chromium's HTML parser (used by the
 * import harness) applies the adoption-agency algorithm and collapses those
 * anchors into a single <a> holding every image/body div flat, so keying off
 * `a.trend-card` yields one giant "card". To be robust to both that shape and
 * the clean per-anchor shape, we pair each `.trend-card-body` with its preceding
 * `.trend-card-image` and take the href from the nearest ancestor <a>.
 * 2-column block; one row per card: [image, text content (tag, heading,
 * description) + CTA link].
 */
export default function parse(element, { document }) {
  const bodies = element.querySelectorAll('.trend-card-body');
  const cells = [];

  bodies.forEach((body) => {
    // Image div immediately precedes the body div (both shapes preserve order).
    let imageWrap = body.previousElementSibling;
    if (!imageWrap || !imageWrap.classList.contains('trend-card-image')) {
      imageWrap = null;
    }
    const image = (imageWrap && imageWrap.querySelector('img'))
      || (body.previousElementSibling && body.previousElementSibling.querySelector && body.previousElementSibling.querySelector('img'))
      || null;

    // Text content: tag, heading, description.
    const textCell = [];
    const tag = body.querySelector('.tag');
    if (tag) textCell.push(tag);
    const heading = body.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) textCell.push(heading);
    body.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) textCell.push(p);
    });

    // CTA: the card is a link — use the nearest ancestor anchor's href.
    const anchor = body.closest('a');
    const href = anchor ? anchor.getAttribute('href') : null;
    if (href) {
      const cta = document.createElement('a');
      cta.href = href;
      cta.textContent = heading ? heading.textContent.trim() : 'Read more';
      textCell.push(cta);
    }

    cells.push([image || '', textCell]);
  });

  // Fallback: no bodies found — try treating each anchor/div as a full card.
  if (cells.length === 0) {
    const cards = element.querySelectorAll(':scope > a.trend-card, :scope > a.card-link, :scope > a, :scope > div');
    cards.forEach((card) => {
      const image = card.querySelector('img');
      const textCell = [];
      const tag = card.querySelector('.tag');
      if (tag) textCell.push(tag);
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) textCell.push(heading);
      card.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) textCell.push(p);
      });
      const href = card.tagName === 'A' ? card.getAttribute('href') : null;
      if (href) {
        const cta = document.createElement('a');
        cta.href = href;
        cta.textContent = heading ? heading.textContent.trim() : 'Read more';
        textCell.push(cta);
      }
      if (image || textCell.length) cells.push([image || '', textCell]);
    });
  }

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-trends', cells });
  element.replaceWith(block);
}
