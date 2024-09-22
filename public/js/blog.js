const $ = document.querySelector.bind(document);
const turndownService = new window.TurndownService();
const md = window.markdownit();

const editorEl = $('#editor');
const resultEditorEl = $('#editor-result');
const quill = new Quill('#editor', {
  modules: {
    syntax: true,
    toolbar: '#toolbar-container',
  },
  placeholder: 'Compose an epic...',
  theme: 'snow',
});

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
    resultQuill.setContents(delta);

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
