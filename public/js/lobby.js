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

// Shows session ID to users who have joined a room
socket.on("validRoom", (SID) => {
    lobbyMsg.innerHTML = `Session ID: ${SID}`;
});

// Advances users to faction selection after 2 users have connected to a room
socket.on("continue", (SID) => {
    // TESTING: localhost:5000
    // LIVE: gwent-io.herokuapp.com
    location.replace(`http://gwent-io.herokuapp.com/faction.html?SID=${SID}`);
});

// Deals with users trying to join a full room
socket.on("full", (SID) => {    
    lobbyMsg.innerHTML = `Error: Room ${SID} is full, please create a new room.`;
});

// Deals with users trying to join a non-existent room
socket.on("invalidRoom", (SID) => {
    lobbyMsg.innerHTML = `ERROR: Room ${SID} is an invalid room, please check the session ID has been entered correctly.`;
});

