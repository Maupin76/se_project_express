// Centralized error-handling middleware
module.exports = (err, req, res, next) => {
  // Always log full error for debugging
  console.error(err);

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};
