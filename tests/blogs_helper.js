const Blog = require("../models/blog");

const initialBlogs = [
  {
    id: 12345678910,
    title: "TEST TILE 1",
    author: "Test Author 1",
    url: "www.testurl1.com",
    likes: 3,
  },
  {
    id: 1987654321,
    title: "TEST TILE 2",
    author: "Test Author 2",
    url: "www.testurl2.com",
    likes: 16,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon", date: new Date() });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
