class CustomError extends Error {
    constructor(type, message, statusCode) {
      super(message); // Call the parent class (Error) constructor with the message
      this.type = type; // Custom property for error type
      this.statusCode = statusCode || 500; // Default to 500 if no status code is provided
      this.name = this.constructor.name; // Set the error name to the class name (CustomError)
      
      // Capture stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Example of a specific custom error
  class InvalidParameterError extends CustomError {
    constructor(message) {
      super('InvalidParameter', message, 400); 
    }
  }

  class AuthenticationError extends CustomError {
    constructor(message){
        super('AuthenticationError', message, 401);
    }
  }

  class NotFoundError extends CustomError {
    constructor(message){
        super('NotFound', message, 404);
    }
  }


  module.exports = {InvalidParameterError, AuthenticationError, NotFoundError};
  