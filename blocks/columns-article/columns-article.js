export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-article-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-article-img-col');
        }
      }
    });
  });

  // text column: the column that holds the heading
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const textCol = heading ? heading.closest('div') : null;
  if (textCol) {
    const kids = [...textCol.children];
    const headingIndex = kids.indexOf(heading);

    // Byline stack (blog-article header): authors sometimes split the byline
    // into many single-value paragraphs after the heading, e.g.
    // "By" / "<author>" / "<date>" / "•" / "<read time>" / "<category>".
    // Normalise them into: a byline line ("By <author>"), a muted meta line
    // ("<date> • <read time>") and a lime category pill — matching the source.
    // The 2-paragraph shape used by other pages (about-us) already matches and
    // is left untouched.
    const stack = kids
      .slice(headingIndex + 1)
      .filter((el) => el.tagName === 'P' && !el.querySelector('a'));
    if (stack.length > 2) {
      const parts = stack.map((el) => el.textContent.trim());
      const byIdx = parts.findIndex((t) => /^by$/i.test(t));
      const author = byIdx >= 0 ? parts[byIdx + 1] : undefined;
      const dateText = parts.find((t) => /\b\d{4}\b/.test(t) || /^[A-Z][a-z]{2,9}\.?\s+\d{1,2}/.test(t));
      const readText = parts.find((t) => /min read/i.test(t));
      const known = new Set([author, dateText, readText, '•', '•']);
      if (byIdx >= 0) known.add(parts[byIdx]);
      const category = parts.find((t) => t && !known.has(t) && !/^by$/i.test(t));

      // build replacement nodes in source order: byline, meta, pill
      const frag = document.createDocumentFragment();
      if (author) {
        const byline = document.createElement('p');
        byline.className = 'columns-article-byline';
        const by = document.createElement('span');
        by.className = 'columns-article-by';
        by.textContent = 'By';
        const name = document.createElement('span');
        name.className = 'columns-article-author';
        name.textContent = author;
        byline.append(by, ' ', name);
        frag.append(byline);
      }
      if (dateText || readText) {
        const meta = document.createElement('p');
        meta.className = 'columns-article-metaline';
        meta.textContent = [dateText, readText].filter(Boolean).join(' • ');
        frag.append(meta);
      }
      if (category) {
        const pill = document.createElement('p');
        pill.className = 'columns-article-meta';
        const tag = document.createElement('span');
        tag.className = 'columns-article-tag';
        tag.textContent = category;
        pill.append(tag);
        frag.append(pill);
      }
      stack.forEach((el) => el.remove());
      textCol.append(frag);
    }

    // "Featured <date>" meta line (article-listing featured card): the first
    // link-less paragraph that appears before the heading. Wrap the leading
    // label in a pill and the trailing date in a muted span. Breadcrumb rows
    // (which contain links) are skipped.
    const metaP = kids.find(
      (el, i) => el.tagName === 'P' && i < headingIndex && !el.querySelector('a'),
    );
    if (metaP) {
      const m = metaP.textContent.trim().match(/^(.*?)\s+([A-Z][a-z]{2,9}\.?\s+\d{1,2}(?:,\s*\d{4})?)$/);
      if (m) {
        const [, label, dateText] = m;
        metaP.textContent = '';
        metaP.className = 'columns-article-meta';
        const pill = document.createElement('span');
        pill.className = 'columns-article-tag';
        pill.textContent = label;
        const date = document.createElement('span');
        date.className = 'columns-article-date';
        date.textContent = dateText;
        metaP.append(pill, date);
      }
    }

    // trailing CTA: a paragraph whose only content is a single link (not a
    // breadcrumb). Style it as a filled pill button.
    const paras = [...textCol.querySelectorAll('p')];
    const last = paras[paras.length - 1];
    if (last && last.children.length === 1) {
      const link = last.querySelector(':scope > a');
      if (link && link.textContent.trim() === last.textContent.trim()) {
        last.classList.add('columns-article-cta');
      }
    }
  }
}
