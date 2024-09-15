import { Blog } from '~/models/blog';
import { ContentBlog } from '~/models/blogContent';
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

blogController.viewBlogForm = (req, res, next) => {
  const { values = {} } = req;
  res.render('blog/form', {
    formErrors: req.validationErrors,
    values,
  });
};

blogController.createBlog = async (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  if (req.validationErrors) {
    const values = {
      title,
      description,
      imageUrl,
    };
    const formError = transformErrorArrayToErrorForm(req.validationErrors);
    res.render('blog/form', {
      formError,
      values,
    });
  } else {
    try {
      const contentBlog = new ContentBlog();
      await contentBlog.save();
      const blog = Blog({
        title,
        description,
        imageUrl,
        blogContentId: contentBlog._id,
      });
      await blog.save();
    } catch (error) {
      console.log(error);
    }
  }
  // res.render('blog/form');
};

export default blogController;
