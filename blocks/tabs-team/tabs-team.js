// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-team-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-team-body';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-team-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();

    // Group the member text (name/role/quote) in the remaining panel cell so it
    // stacks at the top of the text column instead of being distributed across
    // equal-height grid rows (matches the source layout).
    const panelInner = tabpanel.firstElementChild;
    if (panelInner) {
      const paras = [...panelInner.children].filter((el) => el.tagName === 'P');
      const imageP = paras.find((p) => p.querySelector('picture, img'));
      const textParas = paras.filter((p) => p !== imageP);
      if (textParas.length) {
        const textWrap = document.createElement('div');
        textWrap.className = 'tabs-team-panel-text';
        textParas[0].before(textWrap);
        textParas.forEach((p) => textWrap.append(p));
      }
    }
  });

  block.prepend(tablist);
}
