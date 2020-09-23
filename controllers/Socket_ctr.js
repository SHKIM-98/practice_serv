const User = require('../models/user');
const io = require('socket.io-client');

const chat_main = (req,res) =>  {
    res.render('chat_main', {room_list : room_list});
};

const chat = (req,res) =>   {
    var id = req.params.id;
    var room_name = room_list[id];

    var chat = io('http://localhost:3000/chat'),
        news = io('/news');
        
    res.render('chat');
};

const mk_room = (req,res) =>    {
    var room_name = req.body.room_name;
    console.log(room_name);
    room_list.push(room_name);
    console.log(room_list);
    res.redirect('/chat_main');
}

module.exports = {
    chat_main,
    chat,
    mk_room,
};