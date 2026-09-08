export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  block.classList.add(`columns-intro-${cols.length}-cols`);

  // Tag the column(s) whose only content is imagery so CSS can lay them out
  // as a stacked image stack. EDS wraps multiple sibling <picture> elements
  // in a single <p>, so a column is an image column when every element it
  // contains is a picture (or a wrapper of pictures) with no text.
  cols.forEach((col) => {
    const hasPicture = col.querySelector('picture');
    const hasText = col.textContent.trim().length > 0;
    if (hasPicture && !hasText) {
      col.classList.add('columns-intro-img-col');
    }
  });
}
