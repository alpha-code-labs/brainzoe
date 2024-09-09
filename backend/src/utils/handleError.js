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
        return createError('UnknownError', 'An unexpected error occurred', 500);
    }
}

module.exports = handleError;