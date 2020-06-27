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
    
    socket.on('create or join', function (room) {
        log('Request to create or join room ' + room);

		var numClients = io.sockets.clients(room).length;
		log('Room ' + room + ' has ' + numClients + ' client(s)');

		if (numClients === 0){
			socket.join(room);
			socket.emit('created', room, socket.id);

		} else if (numClients === 1) {
			socket.join(room);
            socket.emit('joined', room, socket.id);
            io.sockets.in(room).emit('ready');

		} else { // max two clients
			socket.emit('full', room);
		}
	});
});


