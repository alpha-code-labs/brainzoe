const express = require('express');
const dotenv = require('dotenv');
const errorHanlder = require('./src/middlewares/error.middleware.js');
const connectToDb = require('./src/config/db.js');
const authRouter = require('./src/routes/auth.routes.js');

dotenv.config();

const app = express();
app.use(express.json());


app.get('/', (req, res)=> {
    throw new Error('Some Error occured', 'invaid parms');
})

app.use('/auth', authRouter);

app.use(errorHanlder);

connectToDb();
app.listen(process.env.PORT, ()=>console.log(`server listening on port ${process.env.PORT}`))