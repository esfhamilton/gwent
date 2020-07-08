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

/* NEUTRAL CARDS (accessible to each faction) */
// Decoy
document.getElementById('neutral1').style = "background: url(img/cards_01.jpg) 6.65% 6% / 455% 331%; display: block;";
// Commander's Horn
document.getElementById('neutral2').style = "background: url(img/cards_01.jpg) 35.5% 6% / 455% 331%; display: block;";
// Scorch
document.getElementById('neutral3').style = "background: url(img/cards_01.jpg) 64.5% 6% / 455% 331%; display: block;";
// Biting Frost
document.getElementById('neutral4').style = "background: url(img/cards_01.jpg) 93.4% 6% / 455% 331%; display: block;";
// Impenetrable Fog
document.getElementById('neutral5').style = "background: url(img/cards_01.jpg) 6.65% 50% / 455% 331%; display: block;";
// Torrential Rain
document.getElementById('neutral6').style = "background: url(img/cards_01.jpg) 35.5% 50% / 455% 331%; display: block;";
// Clear Weather
document.getElementById('neutral7').style = "background: url(img/cards_01.jpg) 64.5% 50% / 455% 331%; display: block;";
// Geralt of Rivia
document.getElementById('neutral8').style = "background: url(img/cards_12.jpg) 35.5% 50% / 455% 331%; display: block;";
// Cirilla Fiona Elen Riannon
document.getElementById('neutral9').style = "background: url(img/cards_12.jpg) 64.5% 50% / 455% 331%; display: block;";
// Yennefer of Vengerberg
document.getElementById('neutral10').style = "background: url(img/cards_12.jpg) 93.4% 50% / 455% 331%; display: block;";
// Triss Merigold
document.getElementById('neutral11').style = "background: url(img/cards_12.jpg) 6.65% 94% / 455% 331%; display: block;";
// Avallac'h
document.getElementById('neutral12').style = "background: url(img/cards_12.jpg) 35.5% 94% / 455% 331%; display: block;";
// Villentretenmerth
document.getElementById('neutral13').style = "background: url(img/cards_01.jpg) 93.4% 50% / 455% 331%; display: block;";
// Vesemir
document.getElementById('neutral14').style = "background: url(img/cards_01.jpg) 6.65% 94% / 455% 331%; display: block;";
// Zoltan Chivay
document.getElementById('neutral15').style = "background: url(img/cards_01.jpg) 35.5% 94% / 455% 331%; display: block;";
// Emiel Regis Rohellec Terzieff
document.getElementById('neutral16').style = "background: url(img/cards_15.jpg) 64.5% 6% / 455% 331%; display: block;"; 
// Dandelion
document.getElementById('neutral17').style = "background: url(img/cards_01.jpg) 64.5% 94% / 455% 331%; display: block;"; 

if (faction === 'NR'){
    document.getElementById('Lead1').style = "background: url(img/cards_13.jpg) 64.5% 94% / 455% 331%;";
    document.getElementById('Lead2').style = "background: url(img/cards_13.jpg) 93.4% 94% / 455% 331%;";
    document.getElementById('Lead3').style = "background: url(img/cards_14.jpg) 6.65% 6% / 455% 331%;";
    document.getElementById('Lead4').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%;";
    document.getElementById('NR1').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR2').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR3').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR4').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR5').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR6').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR7').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR8').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR9').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR10').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR11').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR12').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR13').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR14').style = "background: url(img/cards_07.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR15').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR16').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR17').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR18').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR19').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR20').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR21').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR22').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR23').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR24').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR25').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR26').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR27').style = "background: url(img/cards_09.jpg) 35.5% 6% / 455% 331%; display: block;";
    document.getElementById('NR28').style = "background: url(img/cards_09.jpg) 35.5% 6% / 455% 331%; display: block;";
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

function leaderSelected(id) {
    document.getElementById('Lead1').style.border = "none";
    document.getElementById('Lead2').style.border = "none";
    document.getElementById('Lead3').style.border = "none";
    document.getElementById('Lead4').style.border = "none";
    document.getElementById(id).style.borderStyle = "solid";
    document.getElementById(id).style.borderColor = "gold";
}

// Shows session ID to users who have joined a room
socket.on("validRoom", (SID) => {
    lobbyMsg.innerHTML = `Session ID: ${SID}`;
});

// Advances users to faction selection after 2 users have connected to a room
socket.on("continue", (SID) => {
    location.replace(`http://localhost:5000/faction.html`);
});


