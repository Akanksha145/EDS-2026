import { toCamelCase } from './aem.js';

/**
 * Fetches and caches placeholder key/value pairs published from the
 * placeholders sheet.
 * @param {string} [prefix] location of the placeholders sheet, defaults to the root
 * @returns {Promise<object>} placeholders object, camelCased by key
 */
// eslint-disable-next-line import/prefer-default-export
export async function fetchPlaceholders(prefix = '') {
  window.placeholders = window.placeholders || {};
  if (!window.placeholders[prefix]) {
    window.placeholders[prefix] = fetch(`${prefix}/placeholders.json`)
      .then((resp) => resp.json())
      .then(({ data }) => Object.fromEntries(
        data.map((row) => {
          const entry = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]),
          );
          return [toCamelCase(entry.key || ''), entry.text ?? entry.value];
        }).filter(([key]) => key),
      ))
      .catch(() => ({}));
  }
  return window.placeholders[prefix];
}
