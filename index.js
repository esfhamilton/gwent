const express = require('express');
const app = express();
const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 5000; 

app.set('view engine', 'ejs')
   .use(express.static('public'))
   .get('/', (req, res) => {res.render('pages/index')})
   .get('/cool', (req, res) => res.send(cool()));

server = app.listen(PORT);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
    socket.on('chat message',(msg) => {
        io.emit('chat message', msg);
    });
});
