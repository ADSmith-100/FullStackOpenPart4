// import _ from "lodash";

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0].likes;
  } else if (blogs.length === 0) {
    return 0;
  } else {
    const reducer = (sum, item) => {
      return sum + item.likes;
    };
    return blogs.reduce(reducer, 0);
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0];
  } else if (blogs.length === 0) {
    return "no blogs to like";
  } else {
    let blogLikes = blogs.map((b) => b.likes);
    let mostLikes = blogLikes.indexOf(Math.max(...blogLikes));
    return { author: blogs[mostLikes].author, blogs: 1 };
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 1) {
    return { author: blogs[0].author, blogs: 1 };
  } else if (blogs.length === 0) {
    return "no blogs : /";
  } else {
    return "fuck you";
  }
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
