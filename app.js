// Global 변수
let room_list = new Array();
let session_list = new Array();

global.room_list = room_list;
global.session_list = session_list;

// express 기본 모듈
const express = require('express'),
    http = require('http');

// express 미들웨어
const bodyparser = require('body-parser'),
    session = require('express-session');

// express object 생성
const app = express();
const server = http.createServer(app);

// connect to mongodb
const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://shkim:kimsh4549@nodetest.73kba.mongodb.net/nodeJS?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then((result) => server.listen(3000, () => console.log("Start Server : Port 3000")))
    .catch((err) => console.log(err));

// view engine : ejs 세팅
app.set("view engine", 'ejs');
app.set('views', './views');

// 미들웨어 설정
app.use(bodyparser.urlencoded({ extended : false}));
app.use(express.static('public'));
app.locals.pretty = true;

// session 설정
app.use(session({
    secret : 'my key',
    resave : false,
    saveUninitialized : true,
    store: require('mongoose-session')(mongoose)
}));

// passport module
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// socket io
const io = require('socket.io')(server);

var chat = io.of('/chat').on('connection', function(socket) {
    socket.on('chat message', function(data){
      console.log('message from client: ', data);

      if(data.name) {
        console.log("Enter Client " + socket.name);
        var name = socket.name = data.name;
        var room = socket.room = data.room;
      }  
      console.log(socket);
      var send_msg = { msg : data.msg , name : socket.name};
      
      // room에 join한다
      socket.join(room);
      // room에 join되어 있는 클라이언트에게 메시지를 전송한다
      chat.to(room).emit('chat message', send_msg);
    });
});

// io.on('connection', (socket) => {
//     socket.on('login', function(data)   {
//         console.log('Client logged-in:\n name: ' + data.name);
//         socket.name = data.name;

//         io.emit('login', data.name);
//     });

//     socket.on('chat', function(data)    {
//         console.log('Message from %s : %s', socket.name, data.msg);
//         var msg = {
//             from :  {
//                 name : socket.name,
//             },
//             msg : data.msg,
//         };

//         socket.broadcast.emit('chat', msg);
//     });

//     socket.on('force_disconnect', function()  {
//         socket.disconnect();
//     });

//     socket.on('disconnect', function()  {
//         console.log('user disconnected: ' + socket.name);
//     })
// });

// routing
const routes = require('./routers/routes');
app.use('/', routes);

// module exports
module.exports = {
};