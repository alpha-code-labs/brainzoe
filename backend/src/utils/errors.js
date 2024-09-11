class CustomError extends Error {
    constructor(type, message, statusCode) {
      super(message); 
      this.type = type; 
      this.statusCode = statusCode || 500; 
      this.name = this.constructor.name; 
      
      // Capture stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  

  class InvalidParameterError extends CustomError {
    constructor(message) {
      super('InvalidParameter', message, 400); 
    }
  }

  class AuthenticationError extends CustomError {
    constructor(message){
        super('AuthenticationFailed', message, 401);
    }
  } 

  class NotFoundError extends CustomError {
    constructor(message){
        super('NotFound', message, 404);
    }
  }

  class ConflictError extends CustomError {
    constructor(message){
      super('Conflict', message, 409);
    }
  }



  module.exports = {InvalidParameterError, AuthenticationError, NotFoundError, ConflictError};
  