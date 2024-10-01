const express = require('express');
const dotenv = require('dotenv');
const errorHanlder = require('./src/middlewares/error.middleware.js');
const connectToDb = require('./src/config/db.js');
const authRouter = require('./src/routes/auth.routes.js');
const userRouter = require('./src/routes/user.routes.js');
const http = require('http');
const {Server} = require('socket.io');
const userManager = require('./src/multiplayer/userManager.js');
const {authenticate} = require('./src/middlewares/error.middleware.js');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());


app.get('/', (req, res)=> {
    return res.send(200);
})

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use(errorHanlder);

//multiplayer sockets
io.on('connection', (socket)=>{
    console.log('new user connection requested..', socket.id)

    socket.on('join-room', (message)=> userManager.addUser({io, socket, message}) );
    socket.on('user-message', ({content, to, sender})=> userManager.handlUserMessage({io, socket, content, to, sender}));
    socket.on('ans-update', ({ ans, questionId, socketId, roomName }) => userManager.updateAnswer({io, socket, userId, ans, questionId, roomName}));
    socket.on('disconnect', ({userId, roomId})=> userManager.removeUser({to, socket, userId}));
})

connectToDb();
server.listen(process.env.PORT, ()=>console.log(`server listening on port ${process.env.PORT}`))