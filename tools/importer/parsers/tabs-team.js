/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-team. Base: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * 2-column block; one row per tab: [tab label, tab content].
 * Labels come from the .tab-menu buttons; content from the matching .tab-pane,
 * paired by document order.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link'));

  const cells = [];

  panes.forEach((pane, i) => {
    // Tab label: use the full menu button content (avatar image + name + role)
    // so the decorated tab pill matches the source. The tabs block decoration
    // copies the label cell's innerHTML into the button, so rich content renders.
    let label = '';
    const button = menuButtons[i];
    if (button) {
      // Prefer the button's inner wrapper (avatar + text), fall back to the button itself.
      const inner = button.querySelector(':scope > div') || button;
      const labelNodes = Array.from(inner.childNodes);
      label = labelNodes.length ? labelNodes : inner.textContent.trim().replace(/\s+/g, ' ');
    }
    if (!label || (Array.isArray(label) && label.length === 0)) {
      const paneName = pane.querySelector('strong');
      label = paneName ? paneName.textContent.trim() : `Tab ${i + 1}`;
    }

    // Tab content: the pane's inner content.
    const paneInner = pane.querySelector(':scope > .grid-layout') || pane;
    const content = Array.from(paneInner.childNodes);

    cells.push([label, content.length ? content : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-team', cells });
  element.replaceWith(block);
}
