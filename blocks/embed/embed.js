/**
 * loads a script and calls a callback when it's loaded
 * @param {string} url script url
 * @param {Function} callback called once the script has loaded
 */
function loadScript(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.setAttribute('nonce', 'aem');
  script.onload = callback;
  document.head.append(script);
  return script;
}

function getDefaultEmbed(url) {
  return `<div class="embed-video">
    <iframe src="${url.href}" title="Content from ${url.hostname}" allow="encrypted-media" allowfullscreen loading="lazy"></iframe>
  </div>`;
}

function embedYoutube(url, autoplay) {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const src = `https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}`;
  return `<div class="embed-video">
    <iframe src="${src}" title="Content from YouTube" allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope" allowfullscreen loading="lazy"></iframe>
  </div>`;
}

function embedVimeo(url, autoplay) {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  return `<div class="embed-video">
    <iframe src="https://player.vimeo.com/video/${video}${suffix}" title="Content from Vimeo" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>
  </div>`;
}

function embedTwitter(url) {
  loadScript('https://platform.twitter.com/widgets.js');
  return `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
}

const EMBEDS_CONFIG = [
  { match: ['youtube', 'youtu.be'], name: 'youtube', embed: embedYoutube },
  { match: ['vimeo'], name: 'vimeo', embed: embedVimeo },
  { match: ['twitter', 'x.com'], name: 'twitter', embed: embedTwitter },
];

/**
 * replaces the block's placeholder with the actual embed markup
 * @param {Element} block the embed block
 * @param {string} link the authored embed link
 * @param {boolean} autoplay whether video embeds should autoplay
 */
function loadEmbed(block, link, autoplay) {
  if (block.classList.contains('embed-is-loaded')) return;

  const url = new URL(link);
  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));

  block.innerHTML = config ? config.embed(url, autoplay) : getDefaultEmbed(url);
  block.className = `block embed embed-is-loaded${config ? ` embed-${config.name}` : ''}`;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a')?.href;
  block.textContent = '';

  if (!link) return;

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    wrapper.innerHTML = '<div class="embed-placeholder-play"><button type="button" title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => loadEmbed(block, link, true));
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}
