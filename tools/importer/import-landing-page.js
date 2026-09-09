/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsArticleParser from './parsers/columns-article.js';
import columnsIntroParser from './parsers/columns-intro.js';
import heroOverlayParser from './parsers/hero-overlay.js';
import tabsTeamParser from './parsers/tabs-team.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (landing-page)
const PAGE_TEMPLATE = {
  name: 'landing-page',
  description: 'Landing/homepage: hero intro columns, article header, image gallery, team testimonial tabs, latest articles cards, FAQ accordion, and a closing CTA hero banner.',
  urls: [
    'https://wknd-trendsetters.site/',
  ],
  blocks: [
    {
      name: 'columns-intro',
      instances: [
        '#main-content header.section div.grid-layout.tablet-1-column.grid-gap-xxl',
      ],
    },
    {
      name: 'columns-article',
      instances: [
        '#main-content div.grid-layout.tablet-1-column.grid-gap-lg:not([class*="desktop-"])',
      ],
    },
    {
      name: 'cards-gallery',
      instances: [
        '#main-content div.grid-layout.desktop-4-column.grid-gap-sm',
        '#main-content div.grid-layout.desktop-3-column.grid-gap-sm',
      ],
    },
    {
      name: 'tabs-team',
      instances: [
        '#main-content div.tabs-wrapper',
      ],
    },
    {
      name: 'cards-article',
      instances: [
        '#main-content div.grid-layout.desktop-4-column.grid-gap-md',
      ],
    },
    {
      name: 'accordion-faq',
      instances: [
        '#main-content div.faq-list',
      ],
    },
    {
      name: 'hero-overlay',
      instances: [
        '#main-content div.grid-layout.desktop-1-column',
      ],
    },
  ],
  sections: [
    {
      id: 'rc1', name: 'Hero intro', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['columns-intro'], defaultContent: [],
    },
    {
      id: 'rc2', name: 'Article header', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['columns-article'], defaultContent: [],
    },
    {
      id: 'rc3', name: 'Style in every snapshot gallery', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary', blocks: ['cards-gallery'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem'],
    },
    {
      id: 'rc4', name: 'Team testimonials', selector: '#main-content > section.section:nth-of-type(3)', style: null, blocks: ['tabs-team'], defaultContent: [],
    },
    {
      id: 'rc5', name: 'Latest articles', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'secondary', blocks: ['cards-article'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center'],
    },
    {
      id: 'rc6', name: 'FAQ', selector: '#main-content > section.section:nth-of-type(5)', style: null, blocks: ['accordion-faq'], defaultContent: ['#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      id: 'rc7', name: 'Closing CTA banner', selector: '#main-content > section.section.inverse-section', style: null, blocks: ['hero-overlay'], defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'columns-intro': columnsIntroParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-team': tabsTeamParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (root "/" maps to "/index")
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
