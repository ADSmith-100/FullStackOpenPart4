const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const initialUsers = [
  { id: 69, username: "testUser", name: "testName" },
  { id: 96, username: "testUser2", name: "testName2" },
];

const initialBlogs = [
  {
    id: 12345678910,
    title: "TEST TILE 1",
    author: "Test Author 1",
    url: "www.testurl1.com",
    likes: 3,
    // user: {
    //   name: "testName",
    //   id: "69",
    // },
  },
  {
    id: 1987654321,
    title: "TEST TILE 2",
    author: "Test Author 2",
    url: "www.testurl2.com",
    likes: 16,
    // user: {
    //   name: "testUser",
    //   id: "69",
    // },
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

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

function makeAuthHeader(testUser, secret = process.env.SECRET) {
  const token = jwt.sign({ username: testUser.username }, secret, {
    subject: testUser.username,
    algorithm: "HS256",
  });
  return `bearer ${token}`;
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
  makeAuthHeader,
};
