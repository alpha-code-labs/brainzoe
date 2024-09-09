const mongoose = require('mongoose');

const connectToDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.mongoDbUrl);
        console.log(`Db connected: ${conn.connection.host}`);
    }catch(e){
        console.error(`Error: ${e.message}`);
        process.exit(1);
    }
}

module.exports  = connectToDb;