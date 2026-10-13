/* Decap CMS preview for the home page (src/content/homepage/home.json),
   section by section in the order src/pages/index.astro renders them:
   hero, services heading, Shoreline band, About band, the three highlights,
   reviews heading, offer, service-area heading and the closing band.
   Styled by preview.css. Uses Decap's global `h` and `createClass`. */
(function () {
  if (!window.CMS) return;

  function js(data, path) {
    var value = data.getIn(path.split('.'));
    return value && value.toJS ? value.toJS() : value;
  }
  function asset(getAsset, path) {
    if (!path) return null;
    try {
      var a = getAsset(path);
      var url = a && typeof a.then !== 'function' ? String(a) : '';
      return url && url !== '[object Object]' ? url : path;
    } catch (error) {
      return path;
    }
  }

  var Home = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var getAsset = this.props.getAsset;
      var hero = js(data, 'hero') || {};
      var seo = js(data, 'seo') || {};
      var shoreline = js(data, 'shoreline') || {};
      var about = js(data, 'about') || {};
      var highlights = js(data, 'highlights') || {};
      var reviews = js(data, 'reviews') || {};
      var offer = js(data, 'offer') || {};
      var areas = js(data, 'areas') || {};
      var cta = js(data, 'cta') || {};
      var services = js(data, 'services') || {};
      var heroImage = asset(getAsset, hero.image);

      return h('div', { className: 'pv pv-home' },
        h('aside', { className: 'pv-serp' },
          h('p', { className: 'pv-serp-label' }, 'In Google'),
          h('p', { className: 'pv-serp-title' + ((seo.title || '').length > 60 ? ' pv-long' : '') }, seo.title || '(no title)'),
          h('p', { className: 'pv-serp-desc' + ((seo.description || '').length > 160 ? ' pv-long' : '') }, seo.description || '(no description)')
        ),

        h('section', { className: 'pv-hero pv-hero-center', style: heroImage ? { backgroundImage: 'url("' + heroImage + '")' } : null },
          h('div', { className: 'pv-hero-inner' },
            h('p', { className: 'pv-badge' }, '★★★★★ 5.0 stars on Google'),
            h('h1', null, hero.heading),
            hero.text ? h('p', null, hero.text) : null,
            h('p', { className: 'pv-buttons' }, h('span', { className: 'pv-btn pv-btn-light' }, 'Get in touch'), h('span', { className: 'pv-btn' }, 'Call us'))
          )
        ),
        h('p', { className: 'pv-note' }, 'On the site the hero plays the snow-removal video; this photo is its poster and the social share image.'),

        services.title ? h('section', { className: 'pv-section' }, h('h2', null, services.title), h('p', { className: 'pv-note' }, 'Services by category, from the Services collection.')) : null,

        shoreline.title
          ? h('section', { className: 'pv-band' },
              h('div', null, h('h2', null, shoreline.title), h('p', null, shoreline.text)),
              shoreline.linkText ? h('span', { className: 'pv-btn pv-btn-light' }, shoreline.linkText + ' →') : null)
          : null,

        about.title
          ? h('section', { className: 'pv-band pv-band-about' },
              h('div', { className: 'pv-about-text' }, h('h2', null, about.title), h('p', null, about.text)),
              about.image ? h('img', { src: asset(getAsset, about.image), alt: about.imageAlt || '' }) : null)
          : null,

        highlights.items && highlights.items.length
          ? h('section', { className: 'pv-section' },
              h('h2', { className: 'pv-center pv-brand' }, highlights.title),
              highlights.items.map(function (item, i) {
                return h('div', { key: i, className: 'pv-split' + (i % 2 ? ' pv-split-flip' : '') },
                  item.image ? h('img', { src: asset(getAsset, item.image), alt: item.imageAlt || '' }) : h('div'),
                  h('div', null,
                    h('h3', { className: 'pv-brand' }, item.title),
                    (item.paragraphs || []).map(function (p, j) { return h('p', { key: j }, p); }),
                    item.stats && item.stats.length
                      ? h('div', { className: 'pv-stats' }, item.stats.map(function (s, j) { return h('div', { key: j }, h('strong', null, s.value), h('span', null, s.label)); }))
                      : null,
                    item.tags && item.tags.length
                      ? h('p', { className: 'pv-tags' }, item.tags.map(function (t, j) { return h('span', { key: j }, t); }))
                      : null,
                    item.video ? h('p', { className: 'pv-note' }, 'Shows the video ' + item.video + ' on the site.') : null
                  ));
              }))
          : null,

        reviews.title ? h('section', { className: 'pv-section pv-soft pv-center' }, h('h2', null, reviews.title), h('p', null, reviews.text), h('p', { className: 'pv-note' }, 'Review cards come from the Reviews collection.')) : null,

        offer.title
          ? h('section', { className: 'pv-section' },
              h('h2', null, offer.title),
              h('div', { className: 'pv-offer' },
                h('div', { className: 'pv-offer-top' }, h('h3', null, offer.name), h('strong', null, offer.value)),
                h('p', null, offer.text),
                offer.buttonText ? h('span', { className: 'pv-btn pv-btn-light' }, offer.buttonText + ' →') : null))
          : null,

        areas.title ? h('section', { className: 'pv-section pv-soft pv-center' }, h('h2', null, areas.title), areas.text ? h('p', null, areas.text) : null, h('p', { className: 'pv-note' }, 'Map and cities come from Service Area Pages and Pages › Service Areas.')) : null,

        cta.title
          ? h('section', { className: 'pv-cta' }, h('h2', null, cta.title), h('p', null, cta.text),
              h('p', { className: 'pv-buttons' }, h('span', { className: 'pv-btn pv-btn-light' }, 'Get in touch'), h('span', { className: 'pv-btn pv-btn-outline' }, 'Call us')))
          : null
      );
    },
  });

  CMS.registerPreviewTemplate('home', Home);
})();
