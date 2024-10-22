const errorMiddleware = (err, req, res, next) => {
    // Set the status code based on the type of error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
  
    // Log the error details for debugging (optional, useful in development)
    console.error(err.stack);
  
    // Send a JSON response with error details
    res.json({
      message: err.message,
      // Only provide the stack trace in development mode for security reasons
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  export default errorMiddleware;
  