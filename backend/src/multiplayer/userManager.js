const userService = require('../services/user.service.js');

const rooms = [];
const maxWaitToStartGame = 50; //in seconds
const maxResponseTime = 10; //in seconds
const questions = [
    {
        countryCode: 'in',
        totalLetters: 5,
        hint: 'I-N--A',
        ans: 'INDIA',
        maxTime:10,
        id:0,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'us',
        totalLetters: 6,
        hint: 'U--T-D',
        ans: 'UNITED',
        maxTime:10,
        id:1,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'uk',
        totalLetters: 7,
        hint: 'E-G-A-D',
        ans: 'ENGLAND',
        maxTime:10,
        id:2,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'ca',
        totalLetters: 6,
        hint: 'C-N-D-',
        ans: 'CANADA',
        maxTime:10,
        id:3,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'au',
        totalLetters: 9,
        hint: 'A-S-R-L-A',
        ans: 'AUSTRALIA',
        maxTime:10,
        id:4,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'fr',
        totalLetters: 6,
        hint: 'F-A-C-',
        ans: 'FRANCE',
        maxTime:10,
        id:5,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'de',
        totalLetters: 7,
        hint: 'G-R-A-Y',
        ans: 'GERMANY',
        maxTime:10,
        id:6,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'jp',
        totalLetters: 5,
        hint: 'J-P-N-',
        ans: 'JAPAN',
        maxTime:10,
        id:7,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'it',
        totalLetters: 5,
        hint: 'I-A-Y',
        ans: 'ITALY',
        maxTime:10,
        id:8,
        timedOut: false,
        userAnswers: [],
    },
    {
        countryCode: 'br',
        totalLetters: 6,
        hint: 'B-A-I-',
        ans: 'BRAZIL',
        maxTime:10,
        id:9,
        timedOut: false,
        userAnswers: [],
    }
];

async function addUser({ io, socket, message}) {
    const { username } = message;

    //check user in database
    const user_ = await userService.findUserByUsername(username);

    if(!user_){
        const err_msg = `user with username ${username} not found`;
        console.error(err_msg);
        socket.emit('error', {type:'UserNotFound', message: err_msg});
        return;
    }

    const user = {
        username,
        userId: user_._id,
        score: 0, 
    }

    /*  see if user already belongs to a room and trying to reconnect
        It doesn't matter whether the game has started or not */

    for(let i=0; i<rooms.length; i++){
        if(rooms[i].users.map(u=>u.userId).includes(user.userId)){
            //player already exists in room send them updated room
            socket.join(roomName);
            socket.emit('joined', rooms[i]);
            return;
        }
    }

    //join an existing room with less than 10 connections that is about to start
    let existingRoom = null;

    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].users.length < 10 && !rooms[i].gameStarted) {
            existingRoom = rooms[i];
            break;
        }
    }

    if (existingRoom) {
        //a room is found.. let the user join this room
        existingRoom.users.push(user);
        if (existingRoom.users.length == 2) {
            existingRoom.countStartedAt = new Date();
            existingRoom.startsIn = maxWaitToStartGame; //2 minutes wait before starting the game
        } else {
            const diff = Math.max( maxWaitToStartGame - Math.floor(Math.abs(new Date() - existingRoom.countStartedAt) / 1000), 0);
            existingRoom.startsIn = diff;
        }


        socket.join(existingRoom.roomName);
        socket.emit('joined', existingRoom);
        //broadcast room changes to all users
        io.in(existingRoom.roomName).emit('room-update', existingRoom);
    } else {
        //no exisiting room is there create a random one and bind the user to it
        const roomName = `${username}'s_room`;
        const roomId = user_._id;
        const room = {
            roomName,
            users: [user],
            startsIn: null,
            gameStarted: false,
            messages: [],
            question: {},
        }
        rooms.push(room);
        socket.join(roomName);
        socket.emit('joined', room);
    }


    const interval = setInterval(()=>{
            //check if a room need to start the game
            rooms.forEach(room=>{
                diff = maxWaitToStartGame-Math.floor(Math.abs(new Date() - room.countStartedAt)/1000);
                if(!room.gameStarted && diff <= 1){
                    room.gameStarted = true;
                    startQuestionInterval(room.roomName);
                    room.startsIn = 0;
                    io.in(room.roomName).emit('room-update', room);
                }
            })
        },1000);


        function startQuestionInterval(roomName){
            const room = rooms.find(r=>r.roomName == roomName);

            console.log('room name.. is', roomName, JSON.stringify(room));
            room.question = questions[0];
            io.in(roomName).emit('question-update', questions[0]);

            const interval = setInterval(()=>{
                let lastQuestion = room?.question;
                if(lastQuestion && lastQuestion.id < 9){
                    room.question = questions[lastQuestion.id+1];
                    io.in(roomName).emit('question-update', questions[lastQuestion.id+1]);
                }

                if(lastQuestion && lastQuestion.id == 9){
                    io.in(roomName).emit('game-end');
                    clearInterval(interval);
                }
                
            },10000);
        } 
}

async function removeUser({io, socket, userId}) {
     //check users list for all rooms and remove user from there
     for(let i=0; i<rooms.length; i++){
        for(let j=0; j<rooms[i].users.length; j++){
            if(!rooms[i].gameStarted && rooms[i].users[j].userId == userId){
                //remove user from the room... send room update to all connected members
                rooms[i].users = rooms[i].users.filter(user=>user.userId != userId);
                io.in(rooms[i].roomName).emit('room-update', rooms[i]);
                break;
            }
        }
    }
}

async function updateAnswer({io, socket, userId, ans, questionId, roomName}){
     // Find the room by roomName
     let room = rooms.find(r => r.roomName == roomName);
     if (!room) return;
 
     // Find the user by userId in the room
     let userIndex = room.users.findIndex(usr => usr.userId == userId);
     if (userIndex === -1) return;
 
     let question = questions[questionId];
 
     // Check if the answer is correct
     if (question.ans.toLowerCase() == ans.toLowerCase()) {
         // Check if the user has already answered
         if (!question.userAnswers.find(answer => answer.username === room.users[userIndex].username)) {
             // Update the user's score and answer
             let scoreToAdd;
             if (question.userAnswers.length === 0) {
                 scoreToAdd = 100;
             } else if (question.userAnswers.length === 1) {
                 scoreToAdd = 70;
             } else if (question.userAnswers.length === 2) {
                 scoreToAdd = 50;
             }
 
             room.users[userIndex].score = (room.users[userIndex].score ?? 0) + scoreToAdd;
             room.users[userIndex].answers = [...(room.users[userIndex].answers ?? []), { questionId, ans, timeStamp: new Date() }];
             
             // Add to question's userAnswers
             question.userAnswers.push({ username: room.users[userIndex].username, ans });
 
             // Broadcast the updated users to the room
             io.in(roomName).emit('user-update', { users: room.users });
         }
     }
}

async function handleUserMessage({io, socket, content, to, sender}){
    console.log(`message from ${sender}, content: ${content}, roomName: ${to}`);
        let room = rooms.find(room=>room.roomName == to);
        if(room){
            console.log(room, 'room');
            room.messages.push({sender, message:content, timeStamp:new Date()});
            console.log(room, 'room after pushing message', room.roomName);
            const res = io.in(room.roomName).emit('message-update', room.messages);
            console.log(res, 'res... ')
        }else{
            socket.emit('message-error', {type:'RoomNotFound', message: `can not find the given roomname, ${to}`})
        }
}

module.exports = {addUser, removeUser, updateAnswer, handleUserMessage}