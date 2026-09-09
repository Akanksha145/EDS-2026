/**
 * Fetch the footer fragment as plain HTML, trying the DA content path first
 * (/content/footer.plain.html) and falling back to the site root
 * (/footer.plain.html). Metadata-independent: uses the two fixed paths only
 * (no getMetadata lookup).
 * @returns {Promise<Document|null>} parsed fragment document, or null on failure
 */
async function fetchFooterFragment() {
  try {
    let resp = await fetch('/content/footer.plain.html');
    if (!resp.ok) resp = await fetch('/footer.plain.html');
    if (resp.ok) {
      const html = await resp.text();
      if (html && html.trim()) {
        return new DOMParser().parseFromString(html, 'text/html');
      }
    }
  } catch (e) {
    // network error — render nothing rather than throwing
  }
  return null;
}

/**
 * Determine whether a top-level fragment section is the brand column: it has
 * no heading and contains one or more images (logo + social icons).
 * @param {Element} section
 * @returns {boolean}
 */
function isBrandSection(section) {
  return !section.querySelector('h1, h2, h3, h4, h5, h6')
    && !!section.querySelector('img');
}

/**
 * Rebuild an anchor from a source link, preserving href and aria-label and
 * either an image (icon) or its text label. Generic — used for logo, social
 * icons and text links.
 * @param {HTMLAnchorElement} srcLink
 * @returns {HTMLAnchorElement}
 */
function buildLink(srcLink) {
  const link = document.createElement('a');
  link.href = srcLink.getAttribute('href') || '#';
  const ariaLabel = srcLink.getAttribute('aria-label');
  if (ariaLabel) link.setAttribute('aria-label', ariaLabel);

  const img = srcLink.querySelector('img');
  const text = srcLink.textContent.trim();
  if (img) {
    const icon = document.createElement('img');
    icon.src = img.getAttribute('src');
    icon.alt = img.getAttribute('alt') || ariaLabel || '';
    icon.loading = 'lazy';
    icon.setAttribute('aria-hidden', 'true');
    link.append(icon);
  }
  if (text) {
    const span = document.createElement('span');
    span.textContent = text;
    link.append(span);
  }
  return link;
}

/**
 * Build the brand column: logo (image + wordmark) and a social icon row.
 * @param {Element} section source fragment section
 * @returns {HTMLElement}
 */
function buildBrandColumn(section) {
  const col = document.createElement('div');
  col.className = 'footer-brand';

  [...section.querySelectorAll(':scope > p')].forEach((p) => {
    const links = [...p.querySelectorAll('a')];
    if (links.length === 0) return;
    // A brand/logo paragraph holds a single link with both image + wordmark.
    // A social paragraph holds multiple icon-only links.
    if (links.length === 1 && links[0].textContent.trim()) {
      const logo = buildLink(links[0]);
      logo.classList.add('footer-logo');
      col.append(logo);
    } else {
      const social = document.createElement('ul');
      social.className = 'footer-social';
      social.setAttribute('aria-label', 'Social media links');
      links.forEach((a) => {
        const li = document.createElement('li');
        const icon = buildLink(a);
        icon.classList.add('footer-social-link');
        li.append(icon);
        social.append(li);
      });
      col.append(social);
    }
  });
  return col;
}

/**
 * Build a link column from a heading + list of links.
 * @param {Element} section source fragment section
 * @returns {HTMLElement}
 */
function buildLinkColumn(section) {
  const nav = document.createElement('nav');
  nav.className = 'footer-links';

  const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const label = heading.textContent.trim();
    nav.setAttribute('aria-label', label);
    const h = document.createElement('h2');
    h.className = 'footer-heading';
    h.textContent = label;
    nav.append(h);
  }

  const list = document.createElement('ul');
  [...section.querySelectorAll('a')].forEach((a) => {
    const li = document.createElement('li');
    const link = buildLink(a);
    link.classList.add('footer-link');
    li.append(link);
    list.append(li);
  });
  nav.append(list);
  return nav;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooterFragment();
  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  footer.className = 'footer-content';

  const sections = [...fragment.body.children].filter((el) => el.tagName === 'DIV');
  sections.forEach((section) => {
    if (isBrandSection(section)) {
      footer.append(buildBrandColumn(section));
    } else {
      footer.append(buildLinkColumn(section));
    }
  });

  block.append(footer);
}
