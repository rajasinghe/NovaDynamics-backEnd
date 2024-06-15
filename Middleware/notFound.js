const notFoundHandler = (req, res, next) => {
  const error = new Error("resource not found on the server");
  next(error);
};

export default notFoundHandler;
