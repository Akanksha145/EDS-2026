import { getMetadata } from '../../scripts/aem.js';

/**
 * Converts a URL path segment into a readable label.
 * @param {string} segment path segment, e.g. 'trail-name'
 * @returns {string} readable label, e.g. 'Trail Name'
 */
function toLabel(segment) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const segments = window.location.pathname.split('/').filter(Boolean);

  const trail = [{ text: 'Home', link: segments.length ? '/' : null }];
  segments.forEach((segment, i) => {
    const isCurrentPage = i === segments.length - 1;
    trail.push({
      text: isCurrentPage ? (getMetadata('og:title') || document.title || toLabel(segment)) : toLabel(segment),
      link: isCurrentPage ? null : `/${segments.slice(0, i + 1).join('/')}`,
    });
  });

  const ol = document.createElement('ol');
  trail.forEach(({ text, link }) => {
    const li = document.createElement('li');
    if (link) {
      const a = document.createElement('a');
      a.href = link;
      a.textContent = text;
      li.append(a);
    } else {
      li.textContent = text;
      li.setAttribute('aria-current', 'page');
    }
    ol.append(li);
  });

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.append(ol);
  block.append(nav);
}
