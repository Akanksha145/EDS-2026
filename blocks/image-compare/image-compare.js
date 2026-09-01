/**
 * Finds the direct child of `cell` that contains (or is) the picture.
 * @param {Element} cell image-compare column cell
 * @param {Element} picture the picture element found within the cell
 * @returns {Element} the direct child of cell wrapping the picture
 */
function findPictureWrapper(cell, picture) {
  let el = picture;
  while (el.parentElement !== cell) el = el.parentElement;
  return el;
}

/**
 * Moves any authored content other than the image (headings, text, buttons)
 * into a caption overlaid on that image.
 * @param {Element} cell image-compare column cell
 */
function decorateCaption(cell) {
  const picture = cell.querySelector('picture');
  const pictureWrapper = picture ? findPictureWrapper(cell, picture) : null;
  const captionEls = [...cell.children].filter((el) => el !== pictureWrapper);
  if (!captionEls.length) return;

  const caption = document.createElement('div');
  caption.className = 'image-compare-caption';
  captionEls.forEach((el) => caption.append(el));
  cell.append(caption);
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const row = block.children[0];
  const [baseCell, overlayCell] = [...row.children];

  if (baseCell) {
    baseCell.classList.add('image-compare-base');
    decorateCaption(baseCell);
  }
  if (overlayCell) {
    overlayCell.classList.add('image-compare-overlay');
    decorateCaption(overlayCell);
  }

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0;
  slider.max = 100;
  slider.value = 50;
  slider.className = 'image-compare-slider';
  slider.setAttribute('aria-label', 'Drag to compare the two images');

  const updatePosition = () => {
    block.style.setProperty('--image-compare-position', `${slider.value}%`);
  };
  slider.addEventListener('input', updatePosition);
  updatePosition();

  row.append(slider);
}
