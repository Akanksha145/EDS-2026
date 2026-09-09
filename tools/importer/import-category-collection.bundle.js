/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-category-collection.js
  var import_category_collection_exports = {};
  __export(import_category_collection_exports, {
    default: () => import_category_collection_default
  });

  // tools/importer/parsers/cards-trends.js
  function parse(element, { document: document2 }) {
    const bodies = element.querySelectorAll(".trend-card-body");
    const cells = [];
    bodies.forEach((body) => {
      let imageWrap = body.previousElementSibling;
      if (!imageWrap || !imageWrap.classList.contains("trend-card-image")) {
        imageWrap = null;
      }
      const image = imageWrap && imageWrap.querySelector("img") || body.previousElementSibling && body.previousElementSibling.querySelector && body.previousElementSibling.querySelector("img") || null;
      const textCell = [];
      const tag = body.querySelector(".tag");
      if (tag) textCell.push(tag);
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) textCell.push(heading);
      body.querySelectorAll("p").forEach((p) => {
        if (p.textContent.trim()) textCell.push(p);
      });
      const anchor = body.closest("a");
      const href = anchor ? anchor.getAttribute("href") : null;
      if (href) {
        const cta = document2.createElement("a");
        cta.href = href;
        cta.textContent = heading ? heading.textContent.trim() : "Read more";
        textCell.push(cta);
      }
      cells.push([image || "", textCell]);
    });
    if (cells.length === 0) {
      const cards = element.querySelectorAll(":scope > a.trend-card, :scope > a.card-link, :scope > a, :scope > div");
      cards.forEach((card) => {
        const image = card.querySelector("img");
        const textCell = [];
        const tag = card.querySelector(".tag");
        if (tag) textCell.push(tag);
        const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
        if (heading) textCell.push(heading);
        card.querySelectorAll("p").forEach((p) => {
          if (p.textContent.trim()) textCell.push(p);
        });
        const href = card.tagName === "A" ? card.getAttribute("href") : null;
        if (href) {
          const cta = document2.createElement("a");
          cta.href = href;
          cta.textContent = heading ? heading.textContent.trim() : "Read more";
          textCell.push(cta);
        }
        if (image || textCell.length) cells.push([image || "", textCell]);
      });
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-trends", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    element.querySelectorAll(".breadcrumbs img, .breadcrumbs svg").forEach((sep) => sep.remove());
    const row = columns.map((col) => {
      const contents = Array.from(col.childNodes);
      return contents.length ? contents : "";
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-intro.js
  function parse3(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columns.map((col) => {
      const contents = Array.from(col.childNodes);
      return contents.length ? contents : "";
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-category-collection.js
  var PAGE_TEMPLATE = {
    name: "category-collection",
    description: "Category landing page: hero intro columns (heading, subheading, CTA + stacked cover images), a dense category card grid ('Trend alert', default-content intro + cards-trends), a featured article columns block, and a closing subscribe CTA (accent section, default content).",
    urls: [
      "https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"
    ],
    blocks: [
      {
        name: "columns-intro",
        instances: [
          "#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl"
        ]
      },
      {
        name: "cards-trends",
        instances: [
          "#trends > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"
        ]
      },
      {
        name: "columns-article",
        instances: [
          "#main-content > section.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-lg"
        ]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Hero intro",
        selector: "#main-content > header.section.secondary-section",
        style: "secondary",
        blocks: ["columns-intro"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "Trend alert category grid",
        selector: "#trends",
        style: null,
        blocks: ["cards-trends"],
        defaultContent: ["#trends > div.container > div.utility-text-align-center"]
      },
      {
        id: "rc3",
        name: "Featured article",
        selector: "#main-content > section.section.secondary-section",
        style: "secondary",
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "Subscribe CTA",
        selector: "#main-content > section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: ["#main-content > section.section.accent-section > div.container > div.utility-text-align-center"]
      }
    ]
  };
  var parsers = {
    "columns-intro": parse3,
    "cards-trends": parse,
    "columns-article": parse2
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_category_collection_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_category_collection_exports);
})();
