import { fetchPlaceholders } from '../../scripts/placeholders.js';

const DEFAULT_PAGE_SIZE = 10;
const COLUMNS = ['Name', 'Department', 'Experience', 'City'];

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const [sheetCell, pageSizeCell] = [...(block.children[0]?.children || [])];

  const link = sheetCell?.querySelector('a');
  const sheetPath = link ? link.getAttribute('href') : (sheetCell?.textContent.trim() || '/employees.json');
  const pageSize = parseInt(pageSizeCell?.textContent.trim(), 10) || DEFAULT_PAGE_SIZE;

  block.textContent = '';

  const resp = await fetch(sheetPath);
  if (!resp.ok) return;
  const { data: employees } = await resp.json();

  const placeholders = await fetchPlaceholders();

  const table = document.createElement('table');
  table.innerHTML = `<thead><tr>${COLUMNS.map((col) => `<th>${col}</th>`).join('')}</tr></thead>`;
  const tbody = document.createElement('tbody');
  table.append(tbody);

  const loadMoreButton = document.createElement('button');
  loadMoreButton.type = 'button';
  loadMoreButton.className = 'button primary employee-list-load-more';
  loadMoreButton.textContent = placeholders.loadMore || 'Load more';

  let rendered = 0;
  const renderNextPage = () => {
    employees.slice(rendered, rendered + pageSize).forEach((employee) => {
      const row = document.createElement('tr');
      COLUMNS.forEach((col) => {
        const cell = document.createElement('td');
        cell.textContent = employee[col] || '';
        row.append(cell);
      });
      tbody.append(row);
    });
    rendered += pageSize;
    loadMoreButton.hidden = rendered >= employees.length;
  };

  loadMoreButton.addEventListener('click', renderNextPage);
  renderNextPage();

  block.append(table, loadMoreButton);
}
