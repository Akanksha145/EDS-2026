/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [imageCell, textCell, colorCell] = [...block.children[0].children];

  if (imageCell) imageCell.classList.add('banner-image');
  if (textCell) textCell.classList.add('banner-text');

  if (colorCell) {
    const color = colorCell.textContent.trim();
    if (color) block.style.setProperty('--banner-background-color', color);
    colorCell.remove();
  }
}
