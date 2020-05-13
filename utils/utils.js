const validateEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

const getPagination = (url, page, limit, numbersPages) => {
  const firstpage = `<${url}?limit=${limit}&page=${1}>; rel="first"`;
  const prevPage = `<${url}?limit=${limit}&page=${page - 1}>; rel="prev"`;
  const nextPage = `<${url}?limit=${limit}&page=${page + 1}>; rel="next"`;
  const lastPage = `<${url}?limit=${limit}&page=${numbersPages}>; rel="last"`;
  return `${firstpage}, ${prevPage}, ${nextPage}, ${lastPage}`;
};

const functionUtils = {
  validateEmail,
  getPagination
};

module.exports = functionUtils;