function errorHandler(error, request, response, next) {
  // console.error(error);  // Commented out to silence tests.
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
}

module.exports = errorHandler;
