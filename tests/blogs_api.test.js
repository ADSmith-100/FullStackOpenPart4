const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./blogs_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
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

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("verifies that the unique ident property of the blog posts is id, not _id", async () => {
  const response = await api.get("/api/blogs");
  console.log(response.body);
  expect(response.body[0].id).toBeDefined();
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "NEW TITLE",
    author: "NEW Author ",
    url: "www.newURL.com",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).toContain("NEW TITLE");
});

test("if the likes property is missing, it will default to 0", async () => {
  const zeroLikesBlog = {
    title: "Zero TITLE",
    author: "Zero Author ",
    url: "www.zeroURL.com",
  };

  await api
    .post("/api/blogs")
    .send(zeroLikesBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const likes = blogsAtEnd.map((b) => b.likes);
  expect(likes).toContain(0);
});

test("if the title and url properties are missing, the backend responds 400 Bad Request", async () => {
  const missingTitleUrlBlog = {
    author: "Zero Author ",
  };

  await api.post("/api/blogs").send(missingTitleUrlBlog).expect(400);
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
