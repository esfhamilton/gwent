const express = require('express')();
const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 5000;
const http = require('http').createServer(express);
const io = require('socket.io')(http);

express.set('view engine', 'ejs');
express.get('/', (req, res) => {res.render('pages/index')});
express.get('/cool', (req, res) => res.send(cool()));

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
    socket.on('chat message',(msg) => {
        io.emit('chat message', msg);
    });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});