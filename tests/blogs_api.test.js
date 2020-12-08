const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./blogs_helper");
const bcrypt = require("bcrypt");

let token = "";

beforeEach(async () => {
  await User.deleteMany({});
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash("rootbeer", saltRounds);
  const user = new User({ username: "testUser", passwordHash });

  await user.save();

  await api
    .post("/api/login")
    .send({ username: "testUser", password: "rootbeer" })
    .then((response) => {
      token = response.body.token;
    });

  await Blog.deleteMany({});
  const blogs = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user.id })
  );
  await Blog.insertMany(helper.initialBlogs);
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
  console.log(token);
  const newBlog = {
    title: "NEW TITLE",
    author: "NEW Author ",
    url: "www.newURL.com",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
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
    .set("Authorization", `bearer ${token}`)
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

  await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(missingTitleUrlBlog)
    .expect(400);
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    await api.post("/api/blogs").set("Authorization", `Bearer ${token}`);

    const newBlog = {
      title: "NEW TITLE",
      author: "NEW Author ",
      url: "www.newURL.com",
      likes: 12,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];
    console.log(blogsAtStart);
    await api

      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
