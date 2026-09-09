/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome. All selectors verified against
 * migration-work/cleaned.html for the about-us page.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Site chrome — not authorable page content.
    // Found in cleaned.html: <a class="skip-link">, <div class="navbar"> (header/nav + mega menu),
    // <footer class="footer inverse-footer">.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer',
    ]);
  }
}
