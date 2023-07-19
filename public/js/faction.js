const socket = io();
let SID;
// Get session ID from URL
const roomQuery = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

SID = +Object.values(roomQuery);
socket.emit('rejoinRequest', SID);

function submit() {
    const faction = document.getElementById('faction').value;
    location.replace(`${location.origin ?? originUrl}/deck.html?SID=${SID}&faction=${faction}`);
}