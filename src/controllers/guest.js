const guestController = {};

guestController.viewHome = (req, res) => {
  res.render('home', { page: 'home' });
};

guestController.viewBlog = (req, res) => {
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

export default guestController;
