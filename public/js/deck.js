const socket = io();

// Get faction ID from URL as an object
const factionQuery = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// Converts faction id from object to string value
const faction = ''+Object.values(factionQuery); 

// How many cards are available to add to deck 
let threeAvailable = [];
let twoAvailable = [];
let oneAvailable = [];
let zeroAvailable = [];

// How many cards have been added to deck
let threeAdded = [];
let twoAdded = [];
let oneAdded = [];
let zeroAdded = [];

let allCards = [];
for (let i=1; i<29; i++) {
    // Add the 17 neutrals too
    if (i<=17) {
        allCards.push("neutral"+i);
    }
    allCards.push("faction"+i);
}

// Object to store each cards style parameters
let styles = {};

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
    
    // Initialises availability of cards
    threeAvailable = ["neutral1","neutral2","neutral3","neutral4","neutral5","neutral6","neutral7",
                      "faction17","faction22","faction25","faction28"];
    twoAvailable = ["faction5"];
    oneAvailable = ["neutral8","neutral9","neutral10","neutral11","neutral12","neutral13","neutral14","neutral15","neutral16","neutral17",
                    "faction1","faction2","faction3","faction4","faction6","faction7","faction8","faction9","faction10",
                    "faction11","faction12","faction13","faction14","faction15","faction16","faction17","faction18","faction19",
                    "faction20","faction21","faction23","faction24","faction26","faction27"];
    
    /*
        Iterates through every ID, updates html of
        of availabilityID depending on which
        availability array card's id is in
    */
    allCards.forEach(id => {
        console.log(id.length);
        let availabilityID;
        if(id.length===8){
            availabilityID = id[0]+id[id.length-1];
        }
        else {
            availabilityID = id[0]+id[id.length-2]+id[id.length-1];
        }
        
        console.log(availabilityID);
        if (threeAvailable.includes(id)) {
            document.getElementById(availabilityID).innerHTML = "x3";
        }
        else if (twoAvailable.includes(id)) {
            document.getElementById(availabilityID).innerHTML = "x2";
        }
        else {
            document.getElementById(availabilityID).innerHTML = "x1";
        }
    });
    
    // Initialises neutral and faction styles
    styles ={neutral1:"background: url(img/cards_01.jpg) 6.65% 6% / 455% 331%; display: block;",
             neutral2:"background: url(img/cards_01.jpg) 35.5% 6% / 455% 331%; display: block;",
             neutral3:"background: url(img/cards_01.jpg) 64.5% 6% / 455% 331%; display: block;",
             neutral4:"background: url(img/cards_01.jpg) 93.4% 6% / 455% 331%; display: block;",
             neutral5:"background: url(img/cards_01.jpg) 6.65% 50% / 455% 331%; display: block;",
             neutral6:"background: url(img/cards_01.jpg) 35.5% 50% / 455% 331%; display: block;",
             neutral7:"background: url(img/cards_01.jpg) 64.5% 50% / 455% 331%; display: block;",
             neutral8:"background: url(img/cards_12.jpg) 35.5% 50% / 455% 331%; display: block;",
             neutral9:"background: url(img/cards_12.jpg) 64.5% 50% / 455% 331%; display: block;",
             neutral10:"background: url(img/cards_12.jpg) 93.4% 50% / 455% 331%; display: block;",
             neutral11:"background: url(img/cards_12.jpg) 6.65% 94% / 455% 331%; display: block;",
             neutral12:"background: url(img/cards_12.jpg) 35.5% 94% / 455% 331%; display: block;",
             neutral13:"background: url(img/cards_01.jpg) 93.4% 50% / 455% 331%; display: block;",
             neutral14:"background: url(img/cards_01.jpg) 6.65% 94% / 455% 331%; display: block;",
             neutral15:"background: url(img/cards_01.jpg) 35.5% 94% / 455% 331%; display: block;",
             neutral16:"background: url(img/cards_15.jpg) 64.5% 6% / 455% 331%; display: block;",
             neutral17:"background: url(img/cards_01.jpg) 64.5% 94% / 455% 331%; display: block;",
             faction1:"background: url(img/cards_14.jpg) 64.5% 6% / 455% 331%; display: block;",
             faction2:"background: url(img/cards_14.jpg) 93.4% 6% / 455% 331%; display: block;",
             faction3:"background: url(img/cards_14.jpg) 6.65% 50% / 455% 331%; display: block;",
             faction4:"background: url(img/cards_14.jpg) 35.5% 50% / 455% 331%; display: block;",
             faction5:"background: url(img/cards_07.jpg) 64.5% 6% / 455% 331%; display: block;",
             faction6:"background: url(img/cards_07.jpg) 93.4% 6% / 455% 331%; display: block;",
             faction7:"background: url(img/cards_07.jpg) 6.65% 50% / 455% 331%; display: block;",
             faction8:"background: url(img/cards_07.jpg) 35.5% 50% / 455% 331%; display: block;",
             faction9:"background: url(img/cards_07.jpg) 64.5% 50% / 455% 331%; display: block;",
             faction10:"background: url(img/cards_07.jpg) 93.4% 50% / 455% 331%; display: block;",
             faction11:"background: url(img/cards_07.jpg) 6.65% 94% / 455% 331%; display: block;",
             faction12:"background: url(img/cards_07.jpg) 35.5% 94% / 455% 331%; display: block;",
             faction13:"background: url(img/cards_07.jpg) 64.5% 94% / 455% 331%; display: block;",
             faction14:"background: url(img/cards_07.jpg) 93.4% 94% / 455% 331%; display: block;",
             faction15:"background: url(img/cards_08.jpg) 6.65% 6% / 455% 331%; display: block;",
             faction16:"background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;",
             faction17:"background: url(img/cards_08.jpg) 64.5% 6% / 455% 331%; display: block;",
             faction18:"background: url(img/cards_08.jpg) 93.4% 6% / 455% 331%; display: block;",
             faction19:"background: url(img/cards_08.jpg) 6.65% 50% / 455% 331%; display: block;",
             faction20:"background: url(img/cards_08.jpg) 35.5% 50% / 455% 331%; display: block;",
             faction21:"background: url(img/cards_08.jpg) 64.5% 50% / 455% 331%; display: block;",
             faction22:"background: url(img/cards_08.jpg) 93.4% 50% / 455% 331%; display: block;",
             faction23:"background: url(img/cards_08.jpg) 6.65% 94% / 455% 331%; display: block;",
             faction24:"background: url(img/cards_08.jpg) 35.5% 94% / 455% 331%; display: block;",
             faction25:"background: url(img/cards_08.jpg) 64.5% 94% / 455% 331%; display: block;",
             faction26:"background: url(img/cards_08.jpg) 93.4% 94% / 455% 331%; display: block;",
             faction27:"background: url(img/cards_09.jpg) 6.65% 6% / 455% 331%; display: block;",
             faction28:"background: url(img/cards_09.jpg) 35.5% 6% / 455% 331%; display: block;"}
    
    // Leader cards
    document.getElementById('Lead1').style = "background: url(img/cards_13.jpg) 64.5% 94% / 455% 331%;";
    document.getElementById('Lead2').style = "background: url(img/cards_13.jpg) 93.4% 94% / 455% 331%;";
    document.getElementById('Lead3').style = "background: url(img/cards_14.jpg) 6.65% 6% / 455% 331%;";
    document.getElementById('Lead4').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%;";
    // Faction cards
    // Vernon Roche
    document.getElementById('faction1').style = "background: url(img/cards_14.jpg) 64.5% 6% / 455% 331%; display: block;";
    // John Natalis
    document.getElementById('faction2').style = "background: url(img/cards_14.jpg) 93.4% 6% / 455% 331%; display: block;";
    // Esterad Thyssen
    document.getElementById('faction3').style = "background: url(img/cards_14.jpg) 6.65% 50% / 455% 331%; display: block;";
    // Philippa Eilhart
    document.getElementById('faction4').style = "background: url(img/cards_14.jpg) 35.5% 50% / 455% 331%; display: block;";
    // Catapult
    document.getElementById('faction5').style = "background: url(img/cards_07.jpg) 64.5% 6% / 455% 331%; display: block;";
    // Dethmold
    document.getElementById('faction6').style = "background: url(img/cards_07.jpg) 93.4% 6% / 455% 331%; display: block;";
    // Trebuchet
    document.getElementById('faction7').style = "background: url(img/cards_07.jpg) 6.65% 50% / 455% 331%; display: block;";
    // Trebuchet
    document.getElementById('faction8').style = "background: url(img/cards_07.jpg) 35.5% 50% / 455% 331%; display: block;";
    // Ballista
    document.getElementById('faction9').style = "background: url(img/cards_07.jpg) 64.5% 50% / 455% 331%; display: block;";
    // Ballista
    document.getElementById('faction10').style = "background: url(img/cards_07.jpg) 93.4% 50% / 455% 331%; display: block;";
    // Siege Tower
    document.getElementById('faction11').style = "background: url(img/cards_07.jpg) 6.65% 94% / 455% 331%; display: block;";
    // Ves
    document.getElementById('faction12').style = "background: url(img/cards_07.jpg) 35.5% 94% / 455% 331%; display: block;";
    // Siegfried of Denesle
    document.getElementById('faction13').style = "background: url(img/cards_07.jpg) 64.5% 94% / 455% 331%; display: block;";
    // Kiera Metz
    document.getElementById('faction14').style = "background: url(img/cards_07.jpg) 93.4% 94% / 455% 331%; display: block;";
    // Sile de Tansarville
    document.getElementById('faction15').style = "background: url(img/cards_08.jpg) 6.65% 6% / 455% 331%; display: block;";
    // Prince Stennis
    document.getElementById('faction16').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    // Crimson Reavers Dragon Hunter
    document.getElementById('faction17').style = "background: url(img/cards_08.jpg) 64.5% 6% / 455% 331%; display: block;";
    // Dun Banner Medic
    document.getElementById('faction18').style = "background: url(img/cards_08.jpg) 93.4% 6% / 455% 331%; display: block;";
    // Sigismund Dijkstra
    document.getElementById('faction19').style = "background: url(img/cards_08.jpg) 6.65% 50% / 455% 331%; display: block;";
    // Sabrina Glevissig
    document.getElementById('faction20').style = "background: url(img/cards_08.jpg) 35.5% 50% / 455% 331%; display: block;";
    // Sheldon Skaggs
    document.getElementById('faction21').style = "background: url(img/cards_08.jpg) 64.5% 50% / 455% 331%; display: block;";
    // Blue Stripes Commando
    document.getElementById('faction22').style = "background: url(img/cards_08.jpg) 93.4% 50% / 455% 331%; display: block;";
    // Yarpen Zigrin
    document.getElementById('faction23').style = "background: url(img/cards_08.jpg) 6.65% 94% / 455% 331%; display: block;";
    // Thaler
    document.getElementById('faction24').style = "background: url(img/cards_08.jpg) 35.5% 94% / 455% 331%; display: block;";
    // Poor Fucking Infantry
    document.getElementById('faction25').style = "background: url(img/cards_08.jpg) 64.5% 94% / 455% 331%; display: block;";
    // Redanian Foot Soldier
    document.getElementById('faction26').style = "background: url(img/cards_08.jpg) 93.4% 94% / 455% 331%; display: block;";
    // Redanian Foot Soldier
    document.getElementById('faction27').style = "background: url(img/cards_09.jpg) 6.65% 6% / 455% 331%; display: block;";
    // Kaedweni Siege Expert
    document.getElementById('faction28').style = "background: url(img/cards_09.jpg) 35.5% 6% / 455% 331%; display: block;";
}
/*
    Currently only northern realms is in use,
    other faction decks can be added in else ifs here
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

function cardSelected(id) {
    let index;
    let availabilityID;
    if (id.length===8) {
        availabilityID = id[0]+id[id.length-1];
    }
    else {
        availabilityID = id[0]+id[id.length-2]+id[id.length-1];
    }
    const deckID = id+'CD';
    const addedID = availabilityID + "CD"; 
    
    // Check if 3 available 
    if (threeAvailable.includes(id)) {
        // Remove from threeAvailable
        index = threeAvailable.indexOf(id);
        if (index > -1) {
          threeAvailable.splice(index, 1);
        }
        // Add to twoAvailable
        twoAvailable.push(id);
        document.getElementById(availabilityID).innerHTML = "x2";
        updateAddedCards(id,deckID,addedID);
    }
    // Check is 2 available
    else if (twoAvailable.includes(id)) {
        // Remove from twoAvailable
        index = twoAvailable.indexOf(id);
        if (index > -1) {
          twoAvailable.splice(index, 1);
        }
        // Add to oneAvailable
        oneAvailable.push(id);
        document.getElementById(availabilityID).innerHTML = "x1";
        updateAddedCards(id,deckID,addedID);
    }
    // Must only be one available
    else {
        // Remove from oneAvailable
        index = oneAvailable.indexOf(id);
        if (index > -1) {
          oneAvailable.splice(index, 1);
        }
        // Add to zeroAvailable
        zeroAvailable.push(id);
        // Hide card
        document.getElementById(id).style="display: none;";
        updateAddedCards(id,deckID,addedID);
    }

    // Show card in "current deck"
    document.getElementById(deckID).style = styles[id];
}

// Updates the added amounts on each card in deck
function updateAddedCards(id,deckID,addedID) {
    if (twoAdded.includes(id)) {
        // Remove from oneAdded
        index = twoAdded.indexOf(deckID);
        if (index > -1) {
          twoAdded.splice(index, 1);
        }
        // Add to twoAdded
        threeAdded.push(id);
        document.getElementById(addedID).innerHTML = "x3";
    }
    else if (oneAdded.includes(id)) {
        // Remove from oneAdded
        index = oneAdded.indexOf(deckID);
        if (index > -1) {
          oneAdded.splice(index, 1);
        }
        // Add to twoAdded
        twoAdded.push(id);
        document.getElementById(addedID).innerHTML = "x2";
    }
    else {
        // Remove from zeroAdded
        index = zeroAdded.indexOf(deckID);
        if (index > -1) {
          zeroAdded.splice(index, 1);
        }
        // Add to oneAdded
        oneAdded.push(id);
        document.getElementById(addedID).innerHTML = "x1";
    }
}



/* Use below after room is complete */

// Shows session ID to users who have joined a room
socket.on("validRoom", (SID) => {
    lobbyMsg.innerHTML = `Session ID: ${SID}`;
});

// Advances users to faction selection after 2 users have connected to a room
socket.on("continue", (SID) => {
    location.replace(`http://localhost:5000/faction.html`);
});


