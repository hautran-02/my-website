const scriptEl = document.querySelector('#blogContentScript');

const content = scriptEl.getAttribute('content-data');

const quill = new Quill('#editor-result', {
  modules: { toolbar: false },
  placeholder: 'Composean epic...',
  readonly: true,
  theme: 'snow',
});

quill.setContents(JSON.parse(content));