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
    return blogs[mostLikes];
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
