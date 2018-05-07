var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.render('index')
})


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(data){
        if(!socket.nickname) {
            return;
        }
        users.splice(users.indexOf(socket.nickname),1);
        updateUsers();
    console.log('user disconnected');
    });

    function updateUsers() {
        io.emit('usernames', users);
    }

    socket.on('chat message', function(data){
        io.emit('chat message', {msg: data, nick: socket.nickname});
    });

    socket.on('new user', function(data, callback) {
        if (users.indexOf(data) != -1 ) {
            callback(false);
        } else {
            callback(true)
            console.log("data is " + data);
            socket.nickname = data;
            users.push(socket.nickname);
            updateUsers();
        }
    })
});


http.listen(8000, function(){
    console.log('listening on *:8000');
});
      






