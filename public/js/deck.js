const socket = io();

// Get SID and faction ID from URL
const {SID, faction} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('rejoinRequest', SID);

// How many cards are available to add to deck 
let threeAvailable = [];
let twoAvailable = [];
let oneAvailable = [];
let zeroAvailable = [];

// How many cards have been added to deck
let threeAdded = [];
let twoAdded = [];
let oneAdded = [];
let zeroAdded;

// Stores every card id
let allCards = [];
for (let i=1; i<29; i++) {
    if (i<=17) {
        allCards.push("neutral"+i);
    }
    allCards.push("NR"+i);
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
                      "NR17","NR22","NR25","NR28"];
    twoAvailable = ["NR5"];
    oneAvailable = ["neutral8","neutral9","neutral10","neutral11","neutral12","neutral13","neutral14","neutral15","neutral16","neutral17",
                    "NR1","NR2","NR3","NR4","NR6","NR7","NR8","NR9","NR10",
                    "NR11","NR12","NR13","NR14","NR15","NR16","NR17","NR18","NR19",
                    "NR20","NR21","NR23","NR24","NR26","NR27"];
    zeroAdded = allCards;
    
    /*
        Iterates through every ID, updates html of
        of availabilityID depending on which
        availability array card's id is in
    */
    allCards.forEach(id => {
        let availabilityID;
        if(id.length<5){
            if(id.length===3){
                availabilityID = 'NRAmount'+id[id.length-1];
            }
            else {
                availabilityID = 'NRAmount'+id[id.length-2]+id[id.length-1];
            }    
        }
        else{
            if(id.length===8){
                availabilityID = 'n'+id[id.length-1];
            }
            else {
                availabilityID = 'n'+id[id.length-2]+id[id.length-1];
            }    
        }
        
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
             NR1:"background: url(img/cards_14.jpg) 64.5% 6% / 455% 331%; display: block;",
             NR2:"background: url(img/cards_14.jpg) 93.4% 6% / 455% 331%; display: block;",
             NR3:"background: url(img/cards_14.jpg) 6.65% 50% / 455% 331%; display: block;",
             NR4:"background: url(img/cards_14.jpg) 35.5% 50% / 455% 331%; display: block;",
             NR5:"background: url(img/cards_07.jpg) 64.5% 6% / 455% 331%; display: block;",
             NR6:"background: url(img/cards_07.jpg) 93.4% 6% / 455% 331%; display: block;",
             NR7:"background: url(img/cards_07.jpg) 6.65% 50% / 455% 331%; display: block;",
             NR8:"background: url(img/cards_07.jpg) 35.5% 50% / 455% 331%; display: block;",
             NR9:"background: url(img/cards_07.jpg) 64.5% 50% / 455% 331%; display: block;",
             NR10:"background: url(img/cards_07.jpg) 93.4% 50% / 455% 331%; display: block;",
             NR11:"background: url(img/cards_07.jpg) 6.65% 94% / 455% 331%; display: block;",
             NR12:"background: url(img/cards_07.jpg) 35.5% 94% / 455% 331%; display: block;",
             NR13:"background: url(img/cards_07.jpg) 64.5% 94% / 455% 331%; display: block;",
             NR14:"background: url(img/cards_07.jpg) 93.4% 94% / 455% 331%; display: block;",
             NR15:"background: url(img/cards_08.jpg) 6.65% 6% / 455% 331%; display: block;",
             NR16:"background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;",
             NR17:"background: url(img/cards_08.jpg) 64.5% 6% / 455% 331%; display: block;",
             NR18:"background: url(img/cards_08.jpg) 93.4% 6% / 455% 331%; display: block;",
             NR19:"background: url(img/cards_08.jpg) 6.65% 50% / 455% 331%; display: block;",
             NR20:"background: url(img/cards_08.jpg) 35.5% 50% / 455% 331%; display: block;",
             NR21:"background: url(img/cards_08.jpg) 64.5% 50% / 455% 331%; display: block;",
             NR22:"background: url(img/cards_08.jpg) 93.4% 50% / 455% 331%; display: block;",
             NR23:"background: url(img/cards_08.jpg) 6.65% 94% / 455% 331%; display: block;",
             NR24:"background: url(img/cards_08.jpg) 35.5% 94% / 455% 331%; display: block;",
             NR25:"background: url(img/cards_08.jpg) 64.5% 94% / 455% 331%; display: block;",
             NR26:"background: url(img/cards_08.jpg) 93.4% 94% / 455% 331%; display: block;",
             NR27:"background: url(img/cards_09.jpg) 6.65% 6% / 455% 331%; display: block;",
             NR28:"background: url(img/cards_09.jpg) 35.5% 6% / 455% 331%; display: block;"};
    
    // Leader cards
    document.getElementById('Lead1').style = "background: url(img/cards_13.jpg) 64.5% 94% / 455% 331%;";
    document.getElementById('Lead2').style = "background: url(img/cards_13.jpg) 93.4% 94% / 455% 331%;";
    document.getElementById('Lead3').style = "background: url(img/cards_14.jpg) 6.65% 6% / 455% 331%;";
    document.getElementById('Lead4').style = "background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%;";
    // Faction cards
    // Vernon Roche
    document.getElementById('NR1').style = "background: url(img/cards_14.jpg) 64.5% 6% / 455% 331%; display: block;";
    // John Natalis
    document.getElementById('NR2').style = "background: url(img/cards_14.jpg) 93.4% 6% / 455% 331%; display: block;";
    // Esterad Thyssen
    document.getElementById('NR3').style = "background: url(img/cards_14.jpg) 6.65% 50% / 455% 331%; display: block;";
    // Philippa Eilhart
    document.getElementById('NR4').style = "background: url(img/cards_14.jpg) 35.5% 50% / 455% 331%; display: block;";
    // Catapult
    document.getElementById('NR5').style = "background: url(img/cards_07.jpg) 64.5% 6% / 455% 331%; display: block;";
    // Dethmold
    document.getElementById('NR6').style = "background: url(img/cards_07.jpg) 93.4% 6% / 455% 331%; display: block;";
    // Trebuchet
    document.getElementById('NR7').style = "background: url(img/cards_07.jpg) 6.65% 50% / 455% 331%; display: block;";
    // Trebuchet
    document.getElementById('NR8').style = "background: url(img/cards_07.jpg) 35.5% 50% / 455% 331%; display: block;";
    // Ballista
    document.getElementById('NR9').style = "background: url(img/cards_07.jpg) 64.5% 50% / 455% 331%; display: block;";
    // Ballista
    document.getElementById('NR10').style = "background: url(img/cards_07.jpg) 93.4% 50% / 455% 331%; display: block;";
    // Siege Tower
    document.getElementById('NR11').style = "background: url(img/cards_07.jpg) 6.65% 94% / 455% 331%; display: block;";
    // Ves
    document.getElementById('NR12').style = "background: url(img/cards_07.jpg) 35.5% 94% / 455% 331%; display: block;";
    // Siegfried of Denesle
    document.getElementById('NR13').style = "background: url(img/cards_07.jpg) 64.5% 94% / 455% 331%; display: block;";
    // Kiera Metz
    document.getElementById('NR14').style = "background: url(img/cards_07.jpg) 93.4% 94% / 455% 331%; display: block;";
    // Sile de Tansarville
    document.getElementById('NR15').style = "background: url(img/cards_08.jpg) 6.65% 6% / 455% 331%; display: block;";
    // Prince Stennis
    document.getElementById('NR16').style = "background: url(img/cards_08.jpg) 35.5% 6% / 455% 331%; display: block;";
    // Crimson Reavers Dragon Hunter
    document.getElementById('NR17').style = "background: url(img/cards_08.jpg) 64.5% 6% / 455% 331%; display: block;";
    // Dun Banner Medic
    document.getElementById('NR18').style = "background: url(img/cards_08.jpg) 93.4% 6% / 455% 331%; display: block;";
    // Sigismund Dijkstra
    document.getElementById('NR19').style = "background: url(img/cards_08.jpg) 6.65% 50% / 455% 331%; display: block;";
    // Sabrina Glevissig
    document.getElementById('NR20').style = "background: url(img/cards_08.jpg) 35.5% 50% / 455% 331%; display: block;";
    // Sheldon Skaggs
    document.getElementById('NR21').style = "background: url(img/cards_08.jpg) 64.5% 50% / 455% 331%; display: block;";
    // Blue Stripes Commando
    document.getElementById('NR22').style = "background: url(img/cards_08.jpg) 93.4% 50% / 455% 331%; display: block;";
    // Yarpen Zigrin
    document.getElementById('NR23').style = "background: url(img/cards_08.jpg) 6.65% 94% / 455% 331%; display: block;";
    // Thaler
    document.getElementById('NR24').style = "background: url(img/cards_08.jpg) 35.5% 94% / 455% 331%; display: block;";
    // Poor Fucking Infantry
    document.getElementById('NR25').style = "background: url(img/cards_08.jpg) 64.5% 94% / 455% 331%; display: block;";
    // Redanian Foot Soldier
    document.getElementById('NR26').style = "background: url(img/cards_08.jpg) 93.4% 94% / 455% 331%; display: block;";
    // Redanian Foot Soldier
    document.getElementById('NR27').style = "background: url(img/cards_09.jpg) 6.65% 6% / 455% 331%; display: block;";
    // Kaedweni Siege Expert
    document.getElementById('NR28').style = "background: url(img/cards_09.jpg) 35.5% 6% / 455% 331%; display: block;";
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

let leader = 0;
function leaderSelected(id) {
    leader = +id[id.length-1];
    document.getElementById('Lead1').style.border = "none";
    document.getElementById('Lead2').style.border = "none";
    document.getElementById('Lead3').style.border = "none";
    document.getElementById('Lead4').style.border = "none";
    document.getElementById(id).style.borderStyle = "solid";
    document.getElementById(id).style.borderColor = "gold";
}

let deck = [];
function cardSelected(id) {
    let index;
    let availabilityID;
    if(id.length<5){
        if (id.length===3) {
            availabilityID = 'NRAmount'+id[id.length-1];
        }
        else {
            availabilityID = 'NRAmount'+id[id.length-2]+id[id.length-1];
        }
    }
    else{
        if (id.length===8) {
            availabilityID = 'n'+id[id.length-1];
        }
        else {
            availabilityID = 'n'+id[id.length-2]+id[id.length-1];
        }
    }
    
    const deckID = id+'CD';
    const addedID = availabilityID + "CD"; 
    
    // Add card to deck array
    deck.push(id);
    
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
        updateAddedCards(id,addedID);
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
        updateAddedCards(id,addedID);
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
        updateAddedCards(id,addedID);
    }

    // Show card in "current deck"
    document.getElementById(deckID).style = styles[id];
}

// Updates the added amounts on each card in deck
function updateAddedCards(id,addedID) {
    let index;
    if (twoAdded.includes(id)) {
        // Remove from oneAdded
        index = twoAdded.indexOf(id);
        if (index > -1) {
          twoAdded.splice(index, 1);
        }
        // Add to twoAdded
        threeAdded.push(id);
        document.getElementById(addedID).innerHTML = "x3";
    }
    else if (oneAdded.includes(id)) {
        // Remove from oneAdded
        index = oneAdded.indexOf(id);
        if (index > -1) {
          oneAdded.splice(index, 1);
        }
        // Add to twoAdded
        twoAdded.push(id);
        document.getElementById(addedID).innerHTML = "x2";
    }
    else {
        // Remove from zeroAdded
        index = zeroAdded.indexOf(id);
        if (index > -1) {
          zeroAdded.splice(index, 1);
        }
        // Add to oneAdded
        oneAdded.push(id);
        document.getElementById(addedID).innerHTML = "x1";
    }
}

function deckSelected(id) {
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
    
    // Remove card from deck array
    index = deck.indexOf(id);
    if (index > -1) {
      deck.splice(index, 1);
    }
    
    // Check if 3 have been added 
    if (threeAdded.includes(id)) {
        // Remove from threeAdded
        index = threeAdded.indexOf(id);
        if (index > -1) {
          threeAdded.splice(index, 1);
        }
        // Add to twoAdded
        twoAdded.push(id);
        document.getElementById(addedID).innerHTML = "x2";
        updateAvailableCards(id,availabilityID);
    }
    // Check if 2 have been added
    else if (twoAdded.includes(id)) {
        // Remove from twoAvailable
        index = twoAdded.indexOf(id);
        if (index > -1) {
          twoAdded.splice(index, 1);
        }
        // Add to oneAdded
        oneAdded.push(id);
        document.getElementById(addedID).innerHTML = "x1";
        updateAvailableCards(id,availabilityID);
    }
    // Must only be one of this card ID in deck
    else {
        // Remove from oneAdded
        index = oneAdded.indexOf(id);
        if (index > -1) {
          oneAdded.splice(index, 1);
        }
        // Add to zeroAdded
        zeroAdded.push(id);
        // Hide card
        document.getElementById(deckID).style="display: none;";
        updateAvailableCards(id,availabilityID);
    }

    // Show card in "current deck"
    document.getElementById(id).style = styles[id];
}

// Updates the available amounts on each card in deck
function updateAvailableCards(id,availabilityID) {
    let index;
    if (twoAvailable.includes(id)) {
        // Remove from oneAdded
        index = twoAvailable.indexOf(id);
        if (index > -1) {
          twoAvailable.splice(index, 1);
        }
        // Add to twoAdded
        threeAvailable.push(id);
        document.getElementById(availabilityID).innerHTML = "x3";
    }
    else if (oneAvailable.includes(id)) {
        // Remove from oneAdded
        index = oneAvailable.indexOf(id);
        if (index > -1) {
          oneAvailable.splice(index, 1);
        }
        // Add to twoAdded
        twoAvailable.push(id);
        document.getElementById(availabilityID).innerHTML = "x2";
    }
    else {
        // Remove from zeroAvailable
        index = zeroAvailable.indexOf(id);
        if (index > -1) {
          zeroAvailable.splice(index, 1);
        }
        // Add to oneAvailable
        oneAvailable.push(id);
        document.getElementById(availabilityID).innerHTML = "x1";
    }
}

function submit() {
    if (leader===0) {
        document.getElementById('info').innerHTML = "You need to select a leader first.";
    }
    else {
        // TODO: Add function which counts total unit cards instead of all cards
        if (deck.length<23) {
            document.getElementById('info').innerHTML = "Your deck is weak. Add at least 22 unit cards before proceeding.";
        }
        else {
            // Send player's deck, leader and SID info to server
            socket.emit('playerDeck',SID,leader,deck,faction);
        }
    }
}

socket.on('playerAssignment', (PID) => {
    // TESTING: localhost:5000
    // LIVE: gwent-io.herokuapp.com
    location.replace(`http://localhost:5000/game.html?SID=${SID}&player=${PID}`);
});
