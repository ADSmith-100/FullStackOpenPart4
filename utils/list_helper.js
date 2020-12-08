// const _ = require("underscore");
const _ = require("lodash");

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
    return {
      title: blogs[mostLikes].title,
      author: blogs[mostLikes].author,
      likes: blogs[mostLikes].likes,
    };
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 1) {
    return { author: blogs[0].author, blogs: 1 };
  } else if (blogs.length === 0) {
    return "no blogs : /";
  } else {
    let authors = blogs.map((b) => b.author);
    const result = _.values(_.groupBy(authors)).map((d) => ({
      author: d[0],
      blogs: d.length,
    }));

    return result.pop();
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 1) {
    return { author: blogs[0].author, likes: blogs[0].likes };
  } else if (blogs.length === 0) {
    return "no blogs : /";
  } else {
    //list authors by number of blogs and gives blogs for each author
    const blogsByAuthor = _.toPairs(_.groupBy(blogs, (b) => b.author));
    //makes list of authors and calculates total likes of author blogs, then flips order so most likes is first in list.
    const likesByAuthor = blogsByAuthor
      .map(([author, blogs]) => ({
        author,
        likes: blogs.reduce((s, b) => s + b.likes, 0),
      }))
      .sort((a1, a2) => a2.likes - a1.likes);
    console.log(likesByAuthor[0]);
    return likesByAuthor[0];
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
