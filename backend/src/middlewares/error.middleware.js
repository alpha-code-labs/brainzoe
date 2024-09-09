const logError = (error)=>{
    console.error('Error', error.message);
    return error;
} 

const createError = (type, message, statusCode) => ({
    type,
    message,
    statusCode,
});

const handleError = (error) => {
    if (error.name === 'ValidationError') {
        return createError('ValidationError', error.message, 400);
    } else if (error.code === 11000) {
        return createError('DuplicateKeyError', 'Duplicate key error', 409);
    } else {
        return createError('UnknownError', error.message??error, 500);
    }
}

const errorHanlder = (err, req, res, next) =>{
    console.log('middleware handling error.. ')
    logError(err);
    const error = handleError(err);
    res.status(error.statusCode).json({
        error: error.error,
        message: error.message,
    })
}


module.exports = errorHanlder;