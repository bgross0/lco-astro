/* Decap CMS preview: shows an entry the way the site lays it out (hero over
   its photo, the write-up, process steps and FAQs) plus how its title and
   description read in Google, styled by preview.css. Shared by every folder
   collection; fields a collection does not have are skipped. Uses Decap's
   global `h` and `createClass` (React). */
(function () {
  if (!window.CMS) return;

  function read(data, path) {
    var value = data.getIn(path.split('.'));
    return value && value.toJS ? value.toJS() : value;
  }
  function first(data, paths) {
    for (var i = 0; i < paths.length; i++) {
      var value = read(data, paths[i]);
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return undefined;
  }
  // Uploaded-but-unpublished images resolve through getAsset; published ones
  // are root-relative paths this origin already serves.
  function imageUrl(getAsset, path) {
    if (!path) return null;
    try {
      var asset = getAsset(path);
      var url = asset && typeof asset.then !== 'function' ? String(asset) : '';
      return url && url !== '[object Object]' ? url : path;
    } catch (error) {
      return path;
    }
  }

  var Preview = createClass({
    render: function () {
      var entry = this.props.entry;
      var data = entry.get('data');
      var widgetFor = this.props.widgetFor;
      var getAsset = this.props.getAsset;

      var heading = first(data, ['hero.heading', 'title', 'name', 'city']);
      var text = first(data, ['hero.text', 'hero.subheading', 'summary', 'description', 'blurb']);
      var image = imageUrl(getAsset, first(data, ['hero.image', 'image']));
      var bodyHeading = first(data, ['heading', 'detailsHeading', 'title', 'name']);
      var meta = [first(data, ['location']), first(data, ['author']), first(data, ['pubDate'])].filter(Boolean);
      var seoTitle = first(data, ['seo.title']) || heading;
      var seoDescription = first(data, ['seo.description']) || text;
      var process = first(data, ['process']);
      var faq = first(data, ['faq', 'faqs']);
      var steps = (process && process.steps) || [];
      var questions = (faq && faq.items) || [];

      return h('div', { className: 'pv' },
        h('aside', { className: 'pv-serp' },
          h('p', { className: 'pv-serp-label' }, 'In Google'),
          h('p', { className: 'pv-serp-title' + (seoTitle && seoTitle.length > 60 ? ' pv-long' : '') }, seoTitle || '(no title)'),
          h('p', { className: 'pv-serp-desc' + (seoDescription && seoDescription.length > 160 ? ' pv-long' : '') }, seoDescription || '(no description)'),
          (seoTitle && seoTitle.length > 60) || (seoDescription && seoDescription.length > 160)
            ? h('p', { className: 'pv-serp-note' }, 'Google shortens titles past about 60 characters and descriptions past about 160.')
            : null
        ),
        h('section', { className: 'pv-hero' + (image ? '' : ' pv-hero-plain'), style: image ? { backgroundImage: 'url("' + image + '")' } : null },
          h('div', { className: 'pv-hero-inner' },
            h('h1', null, heading || 'Untitled'),
            text ? h('p', null, text) : null,
            meta.length ? h('p', { className: 'pv-meta' }, meta.join(' · ')) : null
          )
        ),
        h('article', { className: 'pv-body' },
          bodyHeading && bodyHeading !== heading ? h('h2', null, bodyHeading) : null,
          widgetFor('body')
        ),
        steps.length
          ? h('section', { className: 'pv-steps' },
              h('h2', null, (process && (process.title || process.heading)) || 'Process'),
              h('ol', null, steps.map(function (step, i) {
                return h('li', { key: i }, h('strong', null, step.title), h('span', null, step.text || step.description || ''));
              })))
          : null,
        questions.length
          ? h('section', { className: 'pv-faq' },
              h('h2', null, (faq && (faq.title || faq.heading)) || 'FAQs'),
              questions.map(function (item, i) {
                return h('details', { key: i, open: i === 0 }, h('summary', null, item.question), h('p', null, item.answer));
              }))
          : null
      );
    },
  });

  var collections = (window.PREVIEW_COLLECTIONS || []);
  collections.forEach(function (name) { CMS.registerPreviewTemplate(name, Preview); });
  CMS.registerPreviewStyle('/admin/preview.css');
})();
