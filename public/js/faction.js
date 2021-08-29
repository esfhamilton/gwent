const socket = io();
let SID;
// Get session ID from URL
const roomQuery = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

SID = +Object.values(roomQuery);
socket.emit('rejoinRequest', SID);

function submit() {
    let faction = document.getElementById('faction').value;
    // TESTING: localhost:5000
    // LIVE: gwent-io.herokuapp.com
    location.replace(`http://localhost:5000/deck.html?SID=${SID}&faction=${faction}`);
}




