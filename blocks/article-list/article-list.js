import { createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_INDEX_PATH = '/query-index.json';
const FETCH_LIMIT = 100;

/**
 * Fetches every row from a paginated index JSON (e.g. query-index.json),
 * following its offset/limit/total until everything has been retrieved.
 * @param {string} indexPath path to the index JSON
 * @returns {Promise<object[]>} all rows across every page
 */
async function fetchAllRows(indexPath) {
  const rows = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${indexPath}?limit=${FETCH_LIMIT}&offset=${offset}`);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    rows.push(...json.data);
    total = json.total;
    offset += json.data.length;
    if (!json.data.length) break;
  }
  return rows;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const link = block.querySelector('a');
  const indexPath = link ? link.getAttribute('href') : (block.textContent.trim() || DEFAULT_INDEX_PATH);
  block.textContent = '';

  const rows = await fetchAllRows(indexPath);

  const ul = document.createElement('ul');
  rows.forEach((row) => {
    const li = document.createElement('li');

    if (row.image) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'article-list-card-image';
      imageWrapper.append(createOptimizedPicture(row.image, row.title || '', false, [{ width: '750' }]));
      li.append(imageWrapper);
    }

    const body = document.createElement('div');
    body.className = 'article-list-card-body';

    const heading = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = row.path;
    titleLink.textContent = row.title || row.path;
    heading.append(titleLink);
    body.append(heading);

    if (row.description) {
      const description = document.createElement('p');
      description.textContent = row.description;
      body.append(description);
    }

    li.append(body);
    ul.append(li);
  });

  block.append(ul);
}
