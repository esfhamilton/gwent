const socket = io();

// Get session ID from URL
const roomQuery = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

let lobbyMsg = document.getElementById("msgPlaceholder");

// IF SID is not present in query => create session
// ELSE send joinRequest to session SID
if (Object.keys(roomQuery) != "SID"){
    socket.emit('createRequest');
}
else{
    const SID = +Object.values(roomQuery);
    socket.emit('joinRequest', SID);
}

socket.on("validRoom", (SID) => {
    lobbyMsg.innerHTML = `Session ID: ${SID}`;
});

socket.on("full", (SID) => {    
    lobbyMsg.innerHTML = `Error: Room ${SID} is full, please create a new room.`;
});

socket.on("invalidRoom", (SID) => {
    lobbyMsg.innerHTML = `ERROR: Room ${SID} is an invalid room, please check the session ID has been entered correctly.`;
});

// LOGGING
socket.on('connection', (socket) => {
    console.log('A user has connected');
});