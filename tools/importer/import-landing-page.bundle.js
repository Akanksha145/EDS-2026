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

  // tools/importer/import-landing-page.js
  var import_landing_page_exports = {};
  __export(import_landing_page_exports, {
    default: () => import_landing_page_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document: document2 }) {
    const items = element.querySelectorAll(":scope > .faq-item, :scope > details, details");
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector(".faq-question, summary");
      let titleContent = "";
      if (summary) {
        const titleEl = summary.querySelector("span, h1, h2, h3, h4, h5, h6");
        if (titleEl) {
          titleContent = titleEl;
        } else {
          const clone = summary.cloneNode(true);
          clone.querySelectorAll("img, svg").forEach((n) => n.remove());
          titleContent = clone.textContent.trim();
        }
      }
      const answer = item.querySelector(".faq-answer");
      let contentContent = "";
      if (answer) {
        contentContent = Array.from(answer.childNodes);
      } else {
        const clone = item.cloneNode(true);
        clone.querySelectorAll("summary, .faq-question").forEach((n) => n.remove());
        contentContent = Array.from(clone.childNodes);
      }
      cells.push([titleContent, contentContent]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
    const cards = element.querySelectorAll(":scope > .article-card, :scope > a.card-link, :scope > a");
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".article-card-image img, img");
      const textCell = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) textCell.push(meta);
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) textCell.push(heading);
      const href = card.tagName === "A" ? card.getAttribute("href") : card.querySelector("a") && card.querySelector("a").getAttribute("href");
      if (href) {
        const cta = document2.createElement("a");
        cta.href = href;
        cta.textContent = heading ? heading.textContent.trim() : "Read more";
        textCell.push(cta);
      }
      cells.push([image || "", textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const items = element.querySelectorAll(":scope > div");
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector("img") || (item.tagName === "IMG" ? item : null);
      if (!image) return;
      const textCell = [];
      const heading = item.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) textCell.push(heading);
      item.querySelectorAll("p").forEach((p) => textCell.push(p));
      cells.push([image, textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse4(element, { document: document2 }) {
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
  function parse5(element, { document: document2 }) {
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

  // tools/importer/parsers/hero-overlay.js
  function parse6(element, { document: document2 }) {
    const bgImage = element.querySelector("img.cover-image, img.utility-overlay, img");
    const contentContainer = element.querySelector(".card-body") || element;
    const heading = contentContainer.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = contentContainer.querySelector("p, .subheading");
    const ctaLinks = Array.from(contentContainer.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-team.js
  function parse7(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const menuButtons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu-link"));
    const cells = [];
    panes.forEach((pane, i) => {
      let label = "";
      const button = menuButtons[i];
      if (button) {
        const inner = button.querySelector(":scope > div") || button;
        const labelNodes = Array.from(inner.childNodes);
        label = labelNodes.length ? labelNodes : inner.textContent.trim().replace(/\s+/g, " ");
      }
      if (!label || Array.isArray(label) && label.length === 0) {
        const paneName = pane.querySelector("strong");
        label = paneName ? paneName.textContent.trim() : `Tab ${i + 1}`;
      }
      const paneInner = pane.querySelector(":scope > .grid-layout") || pane;
      const content = Array.from(paneInner.childNodes);
      cells.push([label, content.length ? content : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-team", cells });
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

  // tools/importer/import-landing-page.js
  var PAGE_TEMPLATE = {
    name: "landing-page",
    description: "Landing/homepage: hero intro columns, article header, image gallery, team testimonial tabs, latest articles cards, FAQ accordion, and a closing CTA hero banner.",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-intro",
        instances: [
          "#main-content header.section div.grid-layout.tablet-1-column.grid-gap-xxl"
        ]
      },
      {
        name: "columns-article",
        instances: [
          '#main-content div.grid-layout.tablet-1-column.grid-gap-lg:not([class*="desktop-"])'
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "#main-content div.grid-layout.desktop-4-column.grid-gap-sm",
          "#main-content div.grid-layout.desktop-3-column.grid-gap-sm"
        ]
      },
      {
        name: "tabs-team",
        instances: [
          "#main-content div.tabs-wrapper"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "#main-content div.grid-layout.desktop-4-column.grid-gap-md"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "#main-content div.faq-list"
        ]
      },
      {
        name: "hero-overlay",
        instances: [
          "#main-content div.grid-layout.desktop-1-column"
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
        name: "Article header",
        selector: "#main-content > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Style in every snapshot gallery",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"]
      },
      {
        id: "rc4",
        name: "Team testimonials",
        selector: "#main-content > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-team"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "Latest articles",
        selector: "#main-content > section.section.secondary-section:nth-of-type(4)",
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"]
      },
      {
        id: "rc6",
        name: "FAQ",
        selector: "#main-content > section.section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        id: "rc7",
        name: "Closing CTA banner",
        selector: "#main-content > section.section.inverse-section",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "columns-intro": parse5,
    "columns-article": parse4,
    "cards-gallery": parse3,
    "tabs-team": parse7,
    "cards-article": parse2,
    "accordion-faq": parse,
    "hero-overlay": parse6
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
  var import_landing_page_default = {
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
  return __toCommonJS(import_landing_page_exports);
})();
