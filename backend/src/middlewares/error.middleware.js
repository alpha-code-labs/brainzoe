const logError = (error)=>{
    console.error('Error', error.message);
    return error;
} 



const errorHanlder = (err, req, res, next) =>{
    console.log('middleware handling error.. ')
    logError(err);
    if(err.statusCode){
        res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
        })
    }else{
        //unknown error... log and shut the process
        console.log(err);
        process.exit(1);
    }
    
}


module.exports = errorHanlder;