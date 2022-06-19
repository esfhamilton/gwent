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

// Set styles - Faction styles can be separated in conditional 
for (let id in styles){
    if(id !== 'deck') document.getElementById(id).style = styles[id];
}

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
}
/*
    Currently only northern realms is in use,
    other faction decks can be added in else ifs here
*/


let leader = 0;
function leaderSelected(id) {
    leader = +id[id.length-1];
    document.getElementById('lead1').style.border = "none";
    document.getElementById('lead2').style.border = "none";
    document.getElementById('lead3').style.border = "none";
    document.getElementById('lead4').style.border = "none";
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
