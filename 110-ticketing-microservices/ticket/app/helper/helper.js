const getPagination = (page, size) => {
  const limit = size ? size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const helper = {
  getPagination,
};
module.exports = helper;
