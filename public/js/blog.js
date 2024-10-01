const $ = document.querySelector.bind(document);
const turndownService = new window.TurndownService();
const md = window.markdownit();
const scriptEl = document.querySelector('#blogContentEditScript');
const content = JSON.parse(scriptEl.getAttribute('content-data'));
const blogContentId = scriptEl.getAttribute('blog-content-id');
const editorEl = $('#editor');
const resultEditorEl = $('#editor-result');

const imgHanlder = async () => {
  const input = document.createElement('input', { id: 'imgTempInput' });
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();
  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      try {
        const range = quill.getSelection();
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`/admin/blog/upload/${blogContentId}`, {
          // URL to your server API
          method: 'POST',
          body: formData,
          headers: {},
        });

        const data = await response.json();
        const imageUrl = data.path;

        // Insert the image into the editor
        quill.insertEmbed(range.index, 'image', imageUrl);
      } catch (err) {
        console.error('Error uploading image', err);
      }
    }
  };
};

const quill = new Quill('#editor', {
  modules: {
    syntax: true,
    toolbar: {
      container: '#toolbar-container',
      handlers: {
        image: imgHanlder,
      },
    },
  },
  placeholder: 'Compose an epic...',
  theme: 'snow',
});
quill.setContents(content);

const onSaveBlogContent = async (blog) => {
  if (blog.blogContents) {
    const quillId = blog.blogContents.quill;
    const markdownId = blog.blogContents.markdown;

    const delta = quill.getContents();
    const resultQuill = new Quill('#editor-result', {
      modules: {
        toolbar: false,
      },
      placeholder: 'Compose an epic...',
      readonly: true,
      theme: 'snow',
    });
    console.log(delta);

    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`/admin/blog/edit-content/${quillId}`, {
        method: 'POST',
        body: JSON.stringify({
          content: delta,
        }),
        headers,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const convertQuillToMarkdown = (delta) => {};
