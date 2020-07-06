const socket = io();

// Get faction ID from URL
const factionQuery = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const faction = ''+Object.values(factionQuery);

/*  
    6.65% First column
    35.5% Second column
    64.5% Third column
    93.4% Final column
    6% Top row
    50% Second row
    94% Final row
    455% 331% height width 
*/
if (faction === 'NR'){
    document.getElementById('Lead1').style = "background: url(img/cards_13.jpg) 64.5% 94% / 455% 331%;";
    document.getElementById('Lead2').style = "background: url(img/cards_13.jpg) 93.4% 94% / 455% 331%;";
    document.getElementById('Lead3').style = "background: url(img/cards_14.jpg) 6.65% 6% / 455% 331%;";
    document.getElementById('Lead4').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%;";
}
/*
    Currently only northern realms is in use
    other faction decks can be added in else ifs
*/
else{
    document.getElementById('Lead1').style = "background: url(img/cards_13.jpg) 64.5% 94% / 455% 331%;";
    document.getElementById('Lead2').style = "background: url(img/cards_13.jpg) 93.4% 94% / 455% 331%;";
    document.getElementById('Lead3').style = "background: url(img/cards_14.jpg) 6.65% 6% / 455% 331%;";
    document.getElementById('Lead4').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%;";
}

// Shows session ID to users who have joined a room
socket.on("validRoom", (SID) => {
    lobbyMsg.innerHTML = `Session ID: ${SID}`;
});

// Advances users to faction selection after 2 users have connected to a room
socket.on("continue", (SID) => {
    location.replace(`http://localhost:5000/faction.html`);
});


