const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
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
beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});
test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("returns correct amount of blog posts", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("verifies that the unique ident property of the blog posts is id, not _id", async () => {
  const response = await api.get("/api/blogs");
  console.log(response.body);
  expect(response.body[0].id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
