/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * 2-column block; one row per accordion item: [title, content].
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll(':scope > .faq-item, :scope > details, details');
  const cells = [];

  items.forEach((item) => {
    // Title: text label from the summary (ignore decorative icon img/svg)
    const summary = item.querySelector('.faq-question, summary');
    let titleContent = '';
    if (summary) {
      const titleEl = summary.querySelector('span, h1, h2, h3, h4, h5, h6');
      if (titleEl) {
        titleContent = titleEl;
      } else {
        // fall back to the summary's text without the icon
        const clone = summary.cloneNode(true);
        clone.querySelectorAll('img, svg').forEach((n) => n.remove());
        titleContent = clone.textContent.trim();
      }
    }

    // Content: the answer body
    const answer = item.querySelector('.faq-answer');
    let contentContent = '';
    if (answer) {
      contentContent = Array.from(answer.childNodes);
    } else {
      // fall back: everything inside the item except the summary
      const clone = item.cloneNode(true);
      clone.querySelectorAll('summary, .faq-question').forEach((n) => n.remove());
      contentContent = Array.from(clone.childNodes);
    }

    cells.push([titleContent, contentContent]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
