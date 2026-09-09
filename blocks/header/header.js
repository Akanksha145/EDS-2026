// Desktop breakpoint — matches header.css @media (width >= 900px)
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment as plain HTML, trying the DA content path first
 * (/content/nav.plain.html) and falling back to the site root (/nav.plain.html).
 * Metadata-independent: uses the two fixed paths only (no page metadata lookup).
 * @returns {Promise<Document|null>} parsed fragment document, or null on failure
 */
async function fetchNavFragment() {
  try {
    // metadata-independent: /content first (localhost), then root (DA/EDS prod)
    let resp = await fetch('/content/nav.plain.html');
    if (!resp.ok) resp = await fetch('/nav.plain.html');
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
 * A submenu is a "megamenu" when at least one of its immediate items contains
 * its own nested list (i.e. it groups content into columns of cards).
 * @param {Element} submenu The <ul> directly under a top-level item
 */
function isMegamenu(submenu) {
  return [...submenu.children].some((li) => li.querySelector(':scope > ul'));
}

/**
 * Build a single icon card from a source anchor that contains an image,
 * a <strong> title, and trailing description text.
 * @param {HTMLAnchorElement} link
 * @returns {HTMLAnchorElement}
 */
function buildCard(link) {
  const card = document.createElement('a');
  card.className = 'nav-card';
  if (link.href) card.href = link.getAttribute('href');

  const img = link.querySelector('img');
  const strong = link.querySelector('strong');
  const title = strong ? strong.textContent.trim() : link.textContent.trim();

  // Description = text content of the link minus the title.
  let desc = link.textContent.replace(title, '').trim();
  desc = desc.replace(/\s+/g, ' ');

  if (img) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'nav-card-icon';
    const icon = document.createElement('img');
    icon.src = img.getAttribute('src');
    icon.alt = img.getAttribute('alt') || '';
    icon.loading = 'lazy';
    iconWrap.append(icon);
    card.append(iconWrap);
  }

  const text = document.createElement('span');
  text.className = 'nav-card-text';
  const titleEl = document.createElement('span');
  titleEl.className = 'nav-card-title';
  titleEl.textContent = title;
  text.append(titleEl);
  if (desc) {
    // Whitespace text node between title and description so the anchor's
    // textContent reads "Streetwear Everyday looks…" (space-separated) — matching
    // the source markup where the description follows the <strong> with a space.
    text.append(document.createTextNode(' '));
    const descEl = document.createElement('span');
    descEl.className = 'nav-card-desc';
    descEl.textContent = desc;
    text.append(descEl);
  }
  card.append(text);
  return card;
}

/**
 * Build the megamenu flyout panel from a submenu list.
 * Items with a nested list become card columns (heading + cards);
 * items without one become the featured promo card.
 * @param {Element} submenu The <ul> directly under the megamenu trigger
 * @returns {HTMLElement}
 */
function buildMegamenuPanel(submenu) {
  const panel = document.createElement('div');
  panel.className = 'nav-megamenu-panel';
  const grid = document.createElement('div');
  grid.className = 'nav-megamenu-grid';
  panel.append(grid);

  [...submenu.children].forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    if (nested) {
      const column = document.createElement('div');
      column.className = 'nav-megamenu-column';
      const heading = li.querySelector(':scope > p');
      if (heading) {
        const h = document.createElement('h3');
        h.textContent = heading.textContent.trim();
        column.append(h);
      }
      [...nested.children].forEach((cardLi) => {
        const a = cardLi.querySelector(':scope > a');
        if (a) column.append(buildCard(a));
      });
      grid.append(column);
    } else {
      // Featured / promo card: gather links and paragraphs.
      const featured = document.createElement('a');
      featured.className = 'nav-featured';
      const links = li.querySelectorAll('a');
      const primary = links[0];
      if (primary) featured.href = primary.getAttribute('href');

      const paragraphs = [...li.querySelectorAll(':scope > p')];
      const [titleP, descP, ctaP] = paragraphs;

      const titleEl = document.createElement('span');
      titleEl.className = 'nav-featured-title';
      titleEl.textContent = titleP ? titleP.textContent.trim() : '';
      featured.append(titleEl);

      if (descP) {
        const d = document.createElement('span');
        d.className = 'nav-featured-desc';
        d.textContent = descP.textContent.trim();
        featured.append(d);
      }
      if (ctaP) {
        const cta = document.createElement('span');
        cta.className = 'nav-featured-cta';
        cta.textContent = ctaP.textContent.trim();
        featured.append(cta);
      }
      grid.append(featured);
    }
  });

  return panel;
}

/**
 * Build a simple flyout dropdown (a flat list of links) from a submenu list.
 * @param {Element} submenu
 * @returns {HTMLElement}
 */
function buildDropdownPanel(submenu) {
  const panel = document.createElement('div');
  panel.className = 'nav-dropdown-panel';
  const list = document.createElement('ul');
  [...submenu.children].forEach((li) => {
    const a = li.querySelector(':scope > a');
    if (!a) return;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    item.append(link);
    list.append(item);
  });
  panel.append(list);
  return panel;
}

/**
 * Close all open flyouts within the nav.
 * @param {Element} nav
 */
function closeAllFlyouts(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    drop.setAttribute('aria-expanded', 'false');
    const trigger = drop.querySelector(':scope > .nav-link');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Wire hover + focus open/close behaviour on a top-level item that owns a flyout.
 * @param {Element} item The top-level <li>
 * @param {Element} nav
 */
function wireFlyout(item, nav) {
  const trigger = item.querySelector(':scope > .nav-link');
  const setState = (expanded) => {
    item.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (trigger) trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };
  const open = () => {
    if (isDesktop.matches) {
      closeAllFlyouts(nav);
      setState(true);
    }
  };
  const close = () => {
    if (isDesktop.matches) setState(false);
  };

  item.addEventListener('mouseenter', open);
  item.addEventListener('mouseleave', close);
  // Opens on keyboard focus entering the item; closes when focus leaves it.
  item.addEventListener('focusin', open);
  item.addEventListener('focusout', (e) => {
    if (!item.contains(e.relatedTarget)) close();
  });
  // On touch / non-hover, toggle on click of the label.
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = item.getAttribute('aria-expanded') === 'true';
      closeAllFlyouts(nav);
      setState(!expanded);
    });
  }
}

/**
 * Decorate one top-level menu item: plain link, megamenu trigger, or dropdown.
 * @param {Element} li source <li>
 * @param {Element} nav
 * @returns {Element} decorated <li>
 */
function decorateTopLevelItem(li, nav) {
  const item = document.createElement('li');
  item.className = 'nav-menu-item';

  const submenu = li.querySelector(':scope > ul');
  // A top-level link may be a direct child (<li><a>) or wrapped in a single
  // paragraph (<li><p><a>) — Document Authoring serializes a bare link in a
  // list item as the latter. Treat both as a plain navigable link.
  let directLink = li.querySelector(':scope > a');
  if (!directLink) {
    const soleP = li.querySelector(':scope > p');
    const pLink = soleP ? soleP.querySelector(':scope > a') : null;
    if (soleP && pLink && soleP.textContent.trim() === pLink.textContent.trim()) {
      directLink = pLink;
    }
  }
  const labelSource = li.querySelector(':scope > p') || directLink;
  const labelText = labelSource ? labelSource.textContent.trim() : '';

  if (!submenu && directLink) {
    // Plain link
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = directLink.getAttribute('href');
    a.textContent = directLink.textContent.trim();
    item.append(a);
    return item;
  }

  // Trigger label (with caret)
  const trigger = document.createElement(directLink ? 'a' : 'button');
  trigger.className = 'nav-link';
  if (directLink) trigger.href = directLink.getAttribute('href');
  else trigger.setAttribute('type', 'button');
  trigger.setAttribute('aria-expanded', 'false');
  const labelSpan = document.createElement('span');
  labelSpan.textContent = labelText;
  trigger.append(labelSpan);
  const caret = document.createElement('span');
  caret.className = 'nav-caret';
  caret.setAttribute('aria-hidden', 'true');
  trigger.append(caret);
  item.append(trigger);

  if (submenu) {
    item.classList.add('nav-drop');
    item.setAttribute('aria-expanded', 'false');
    if (isMegamenu(submenu)) {
      item.classList.add('nav-has-megamenu');
      item.append(buildMegamenuPanel(submenu));
    } else {
      item.classList.add('nav-has-dropdown');
      item.append(buildDropdownPanel(submenu));
    }
    wireFlyout(item, nav);
  }

  return item;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNavFragment();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.body.children];
  const [brandSection, menuSection, toolsSection] = sections;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // Brand / logo
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  if (brandSection) {
    const brandLink = brandSection.querySelector('a');
    if (brandLink) {
      const a = document.createElement('a');
      a.className = 'nav-logo';
      a.href = brandLink.getAttribute('href') || '/';
      const img = brandLink.querySelector('img');
      if (img) {
        const icon = document.createElement('span');
        icon.className = 'nav-logo-icon';
        const logo = document.createElement('img');
        logo.src = img.getAttribute('src');
        logo.alt = img.getAttribute('alt') || '';
        icon.append(logo);
        a.append(icon);
      }
      const text = brandLink.textContent.trim();
      if (text) {
        const label = document.createElement('span');
        label.className = 'nav-logo-text';
        label.textContent = text;
        a.append(label);
      }
      navBrand.append(a);
    }
  }
  nav.append(navBrand);

  // Menu
  const navMenu = document.createElement('div');
  navMenu.className = 'nav-menu';
  const menuList = document.createElement('ul');
  menuList.className = 'nav-menu-list';
  const sourceList = menuSection ? menuSection.querySelector(':scope > ul') : null;
  if (sourceList) {
    [...sourceList.children].forEach((li) => {
      menuList.append(decorateTopLevelItem(li, nav));
    });
  }
  navMenu.append(menuList);
  nav.append(navMenu);

  // Tools (e.g. Subscribe CTA)
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  if (toolsSection) {
    toolsSection.querySelectorAll('a').forEach((srcLink) => {
      const a = document.createElement('a');
      a.className = 'nav-cta';
      a.href = srcLink.getAttribute('href');
      a.textContent = srcLink.textContent.trim();
      navTools.append(a);
    });
  }
  nav.append(navTools);

  // Hamburger toggle for narrow viewports
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('type', 'button');
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';

  // Collapse the mobile menu (and any expanded accordion) back to its closed state.
  const closeMenu = () => {
    closeAllFlyouts(nav);
    nav.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
  };

  const openMenu = () => {
    nav.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation');
  };

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu();
    else openMenu();
  });
  nav.prepend(hamburger);

  // Reset the mobile menu when crossing the desktop breakpoint so it never
  // stays stuck open (and the hamburger icon/state is reset).
  isDesktop.addEventListener('change', closeMenu);

  // Escape closes any open desktop flyout and the mobile drawer.
  nav.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (nav.classList.contains('nav-open')) closeMenu();
      else closeAllFlyouts(nav);
    }
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
