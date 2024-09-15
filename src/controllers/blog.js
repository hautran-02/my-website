import { Blog } from '~/models/blog';
import { ContentBlog } from '~/models/blogContent';
import { transformErrorArrayToErrorForm } from '~/validators';
const blogController = {};

blogController.viewHome = (req, res) => {
  res.render('home', { page: 'home' });
};

blogController.viewBlog = (req, res) => {
  const blog = {
    title: 'Third Blog Post',
    description: `The third blog post covers the latest trends in web development, including the rise of
    JAMstack, the role of headless CMS in modern development, and how developers can leverage these
    technologies to build highly scalable and performant websites.`,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzsM6zsSVj3LttmwxNWDO-TC7EpxXKvABpog&s',
    publicTime: new Date(),
  };
  let blogs = [];
  for (let i = 0; i < 10; i++) {
    blogs.push(blog);
  }
  res.render('blog/index', { page: 'blog', blogs: blogs });
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
