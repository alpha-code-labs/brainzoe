const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res)=> res.status(200).json({message: "listening.."}))

app.listen(process.env.PORT, ()=>console.log(`server listening on port ${process.env.PORT}`))