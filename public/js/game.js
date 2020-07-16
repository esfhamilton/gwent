const socket = io();

// Get SID and faction ID from URL
const {SID, faction} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('rejoinRequest', SID);
socket.emit('startCheck', SID);
socket.emit('playerCheck', SID);

socket.on('startGame', () => {
    // change this to .style display none 
    document.getElementById('waitingMsg').innerHTML = "Starting game...";
});

// A or B used for identification on the server side
let player;
socket.on('playerAssigned', (PID) => {
    player = PID;
});



