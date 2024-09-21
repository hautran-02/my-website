import { BLOG_TABLE } from '~/constants/blog';
import { Blog } from '~/models/blog';
import { ContentBlog } from '~/models/blogContent';
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
      const contentBlog = new ContentBlog();
      await contentBlog.save();
      const blog = Blog({
        title,
        description,
        imageUrl,
        blogContentId: contentBlog._id,
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
        console.log(req.body.imageUrl);
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
