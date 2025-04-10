
const express = require('express');
const cors = require('cors');
const app = express();

const authRouter = require('./controllers/authController');

const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/meesageController');

app.use(cors());
//use auth controller routers
app.use(express.json({
    limit: '50mb'
}));
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

const onlineUser = [];

//Test socket connection from client

io.on('connection', socket => {
    socket.on('join-room', userid => {
        socket.join(userid);
        
    })
    socket.on('send-message', (message) => {
       
        io
        .to(message.members[0]).
        to(message.members[1])
        .emit('receive-message', message)


        io
        .to(message.members[0]).
        to(message.members[1])
        .emit('set-message-count', message)


    })
    socket.on('clear-unread-message', data => {
        io.to(data.members[0]).to(data.members[1]).emit('message-count-clear', data)
    })

    socket.on('user-login', userId => {
        
        if(!onlineUser.includes(userId)){
            onlineUser.push(userId);
        }
        
        
      
        
        socket.emit('online-user', onlineUser);

    })

    socket.on('user-offline',userId => {
        onlineUser.splice(onlineUser.indexOf(userId));
        io.emit('onlie-user-updated', onlineUser);
    } )
    

})



module.exports = server;