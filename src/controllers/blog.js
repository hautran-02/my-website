import { BLOG_TABLE } from '~/constants/blog';
import { Blog } from '~/models/blog';
import { BlogContent } from '~/models/blogContent';
import { BlogEditorSession } from '~/models/BlogEditorSession';
import fileUtil from '~/utils/fileUtil';
import { transformErrorArrayToErrorForm } from '~/validators';

const blogController = {};

blogController.viewHome = (req, res) => {
  res.render('home', { page: 'home' });
};

blogController.viewBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({ active: true }).lean();
    res.render('blog/index', { page: 'blog', blogs });
  } catch (error) {
    console.log(error);
  }
};

blogController.viewBlogContent = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).lean();
    if (!blog) {
      res
        .status(404)
        .send({ message: 'Could not find blog with id ' + blogId });
    }
    const blogCtnId = blog.blogContents.quill;
    const blogContent = await BlogContent.findById(blogCtnId).lean();
    res.render('blog/view', { content: JSON.stringify(blogContent.content) });
  } catch (error) {
    console.log(error);
  }
};

blogController.viewBlogForm = async (req, res, next) => {
  try {
    let { values = {} } = req;
    const isEdit = req.query.edit;
    const blogId = req.query.blogId;
    if (isEdit && !values.keys) {
      const blog = await Blog.findById(blogId).lean();
      values = blog;
    }
    res.render('blog/form', {
      formErrors: req.validationErrors,
      values,
      isEdit,
    });
  } catch (error) {
    console.log(error);
  }
};

blogController.viewBlogEditor = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).lean();
    if (blog.blogContents) {
      const blogContentId = blog.blogContents.quill;
      const blogContent = await BlogContent.findById(blogContentId);
      res.render('blog/editor', {
        blog,
        content: JSON.stringify(blogContent.content),
        blogContentId,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

blogController.uploadImg = async (req, res, next) => {
  try {
    const blogContentId = req.params.blogContentId;
    const path = `/${req.file.path}`;
    const blogES = await BlogEditorSession.findOne({ blogContentId });
    if (!blogES) {
      const blogEditorSession = new BlogEditorSession({
        blogContentId: req.params.blogContentId,
        files: [path],
      });
      await blogEditorSession.save();
    } else {
      blogES.imageUrls.push(path);
      blogES.save();
    }

    res.status(200).send({ message: 'Upload successfully', path });
  } catch (err) {
    console.log(err);
  }
};

blogController.editBlogContent = async (req, res, next) => {
  try {
    const blogContentId = req.params.blogContentId;
    const content = req.body.content;

    let imgUrls = [];
    content.ops.forEach((row) => {
      if (row['insert']['image']) {
        imgUrls.push(row['insert']['image']);
      }
    });

    //hanlde blogContent
    const blogES = await BlogEditorSession.findOne({ blogContentId });
    if (blogES) {
      blogES.imageUrls.forEach((imgUrl) => {
        if (!imgUrls.includes(imgUrl)) {
          fileUtil.deleteFile(imgUrl.slice(1));
        }
      });
      blogES.imageUrls = imgUrls;
      await blogES.save();
    }

    await BlogContent.findByIdAndUpdate(blogContentId, {
      content,
    });

    res
      .status(200)
      .send({ message: `Save blog successfully ${blogContentId}` });
  } catch (error) {
    console.log(error);
  }
};

blogController.viewBlogManagement = async (req, res, next) => {
  try {
    const data = await Blog.find().lean();
    res.render('blog/management', {
      page: 'admin/blog',
      columns: BLOG_TABLE,
      data,
    });
  } catch {}
};

blogController.deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.body.blogId;
    const result = await Blog.findByIdAndDelete(blogId);
    if (result.imageUrl) {
      fileUtil.deleteFile(result.imageUrl.slice(1));
    }
    const blogContent = await BlogContent.findById(result.blogContents.quill);
    const blogES = await BlogEditorSession.findById(blogContent._id);
    if (blogES) {
      blogES.imageUrls.forEach((imgUrl) => {
        fileUtil.deleteFile(imgUrl.slice(1));
      });
    }
    await BlogContent.findByIdAndDelete(result.blogContents.quill);
    await BlogContent.findByIdAndDelete(result.blogContents.html);
    await BlogContent.findByIdAndDelete(result.blogContents.markdown);
    await BlogEditorSession.findOneAndDelete({
      blogContentId: blogContent._id,
    });
    res.redirect('/admin/blog');
  } catch (err) {
    console.log(err);
  }
};

blogController.changeActive = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).exec();
    await Blog.findByIdAndUpdate(blogId, {
      active: !blog.active,
    });
    res.redirect('/admin/blog');
  } catch (err) {
    console.log(err);
  }
};

blogController.createBlog = async (req, res, next) => {
  const { title, description } = req.body;
  if (req.validationErrors) {
    const values = {
      title,
      description,
    };
    const formError = transformErrorArrayToErrorForm(req.validationErrors);
    res.render('blog/form', {
      formError,
      values,
    });
  } else {
    try {
      const file = req.file;
      const imageUrl = '/' + file.path;
      const contentBlogMd = new BlogContent({
        type: 'markdown',
      });
      await contentBlogMd.save();
      const contentBlogQuill = new BlogContent({
        type: 'quill',
      });
      await contentBlogQuill.save();
      const blog = Blog({
        title,
        description,
        imageUrl,
        blogContents: {
          markdown: contentBlogMd._id,
          quill: contentBlogQuill._id,
        },
      });
      await blog.save();
      res.redirect('/admin/blog');
    } catch (error) {
      console.log(error);
    }
  }
  // res.render('blog/form');
};

blogController.editBlog = async (req, res, next) => {
  const blogId = req.params.blogId;
  const { title, description } = req.body;
  if (req.validationErrors) {
    const values = {
      title,
      description,
    };
    const formError = transformErrorArrayToErrorForm(req.validationErrors);
    res.render('blog/form', {
      formError,
      values,
    });
  } else {
    try {
      const file = req.file;
      let imageUrl = '';
      if (file) {
        fileUtil.deleteFile(req.body.imageUrl.slice(1)); // remove / on first
        imageUrl = '/' + file.path;
      } else {
        imageUrl = req.body.imageUrl;
      }
      await Blog.findByIdAndUpdate(blogId, {
        title,
        description,
        imageUrl,
      });
      res.redirect('/admin/blog');
    } catch (error) {
      console.log(error);
    }
  }
  // res.render('blog/form');
};

export default blogController;
