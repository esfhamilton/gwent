const socket = io();

// Get SID and faction ID from URL
const {SID, player} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('rejoinRequest', SID);
socket.emit('getPlayerDeck', SID, player);
socket.emit('startCheck', SID);

// Room full error
socket.on('full', (SID) => {
    document.getElementById('topMsg').innerHTML = `Error: Room ${SID} is full, please create a new room.`;
});

// No deck error
socket.on('noDeck', (SID) => {
    document.getElementById('topMsg').innerHTML = `Error: No Deck has been Built.`;
});

// Initialises player faction styles
let styles = {deck:"background: url(img/cards_16.jpg) 64.5% 94% / 455% 331%; display: block;",
              lead1:"background: url(img/cards_13.jpg) 64.5% 94% / 455% 331%; display: block;",
              lead2:"background: url(img/cards_13.jpg) 93.4% 94% / 455% 331%; display: block;",
              lead3:"background: url(img/cards_14.jpg) 6.65% 6% / 455% 331%; display: block;",
              lead4:"background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%; display: block;",
              neutral1:"background: url(img/cards_01.jpg) 6.65% 6% / 455% 331%; display: block;",
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

let opStyles = {deck:"background: url(img/cards_16.jpg) 64.5% 94% / 455% 331%; display: block;",
                lead1:"background: url(img/cards_13.jpg) 64.5% 94% / 455% 331%; display: block;",
                lead2:"background: url(img/cards_13.jpg) 93.4% 94% / 455% 331%; display: block;",
                lead3:"background: url(img/cards_14.jpg) 6.65% 6% / 455% 331%; display: block;",
                lead4:"background: url(img/cards_14.jpg) 35.5% 6% / 455% 331%; display: block;",
                neutral1:"background: url(img/cards_01.jpg) 6.65% 6% / 455% 331%; display: block;",
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

// Base power levels of every unit card (and decoy)
let cardPowers = {neutral1:0,
                neutral8:15,
                neutral9:15,
                neutral10:7,
                neutral11:7,
                neutral12:0,
                neutral13:7,
                neutral14:6,
                neutral15:5,
                neutral16:5,
                neutral17:2,
                NR1:10,
                NR2:10,
                NR3:10,
                NR4:10,
                NR5:8,
                NR6:6,
                NR7:6,
                NR8:6,
                NR9:6,
                NR10:6,
                NR11:6,
                NR12:5,
                NR13:5,
                NR14:5,
                NR15:5,
                NR16:5,
                NR17:5,
                NR18:5,
                NR19:4,
                NR20:4,
                NR21:4,
                NR22:4,
                NR23:2,
                NR24:1,
                NR25:1,
                NR26:1,
                NR27:1,
                NR28:1};

/* 
    Like styles, these will need 
    updating based on faction
    using NR as default for now
*/
// Groups cards based on the divs that they can be placed in
let combatCards = ["neutral8", "neutral9", "neutral11", "neutral13", "neutral14", "neutral15", "neutral16", "neutral17", 
                   "NR1", "NR2", "NR3", "NR12", "NR13", "NR22", "NR23", "NR 25", "NR26", "NR27"];
let rangedCards = ["neutral10", "NR4", "NR6", "NR14", "NR15", "NR17", "NR20", "NR21"];
let siegeCards = ["NR5", "NR7", "NR8", "NR9", "NR10", "NR11", "NR18", "NR28"];
let combatSpies = ["neutral12", "NR16", "NR19"];
let siegeSpies = ["NR24"];
let heroes = ["neutral1","neutral8", "neutral9", "neutral10", "neutral11", "neutral12","NR1","NR2","NR3","NR4"];
let medics = ["neutral10","NR18"];
let tightBonds = [];
let moraleBoosters = [];

/* 
    Decoy can allow player cards to be selected (except heroes) 
    Commander's horn divs for neutral2 
    All rows for Scorch and clear weather
    Corresponding positional player/opponent rows for everything else
*/
// Decoy = neutral1
// Commander's horn = neutral2
// Scorch = neutral3
// Biting Frost = neutral4
// Impenetrable fog = neutral5
// Torrential rain = neutral6
// Clear weather = neutral7

let faction;
let leader;
let deck;
let hand = [];
let cards;
let index;
socket.on('playerAssigned', (FID, leaderID, cards) => {
    faction = FID;
    leader = 'lead'+leaderID;
    deck = shuffle(cards);
});

function shuffle(deck) {
  var currentIndex = deck.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle
  while (0 !== currentIndex) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap remaining element with the current element.
    temporaryValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = temporaryValue;
  }
  return deck;
}

socket.on('startGame', () => {
    document.getElementById('topMsg').innerHTML = "Starting game...";
    socket.emit('getOpponentDeck', SID, player);
});

let opponentFaction;
let opponentLeader;
let opponentDeckSize;
socket.on('opponentDeck', (opponentFID, opponentLID, opDeckSize) => {
    opponentFaction = opponentFID;
    opponentLeader = 'lead'+opponentLID;
    opponentDeckSize = opDeckSize-10;
    setup();
});



// Amount of cards player draws at the start
let initDraw = 10;
// Sets up mulligan phase after both players have created their decks
function setup() {
    document.addEventListener("keydown",keyPressed);
    document.getElementById('topMsg').innerHTML = "Choose a card to redraw. 0/2";
    document.getElementById('topMsg2').style = "display: fixed;";
    document.getElementById('pDeckSize').innerHTML = deck.length-10;
    document.getElementById('oDeckSize').innerHTML = opponentDeckSize;
    document.getElementById('pStats').style = "display: fixed;";
    document.getElementById('oStats').style = "display: fixed;";
    document.getElementById('opTotalPower').innerHTML = 0;
    document.getElementById('opSiegePower').innerHTML = 0;
    document.getElementById('opRangedPower').innerHTML = 0;
    document.getElementById('opCombatPower').innerHTML = 0;
    document.getElementById('combatPower').innerHTML = 0;
    document.getElementById('rangedPower').innerHTML = 0;
    document.getElementById('siegePower').innerHTML = 0;
    document.getElementById('totalPower').innerHTML = 0;
    document.getElementById('stats').innerHTML = `${initDraw} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    document.getElementById('opponentStats').innerHTML = `${initDraw} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    
    
    // Styles based on player's faction
    for (let i=0; i<initDraw; i++){
        let card = document.createElement('div');
        card.style = styles[deck[0]];
        card.className = 'card';
        card.setAttribute("id", deck[0]);
        card.setAttribute("onclick", "replaceCard(this)");
        document.getElementById('hand').appendChild(card);
        hand.push(deck[0]);
        deck.shift();
    }
    document.getElementById('pLeader').style = styles[leader];
    document.getElementById('pDeck').style = styles["deck"];
    
    
    // This will require opponent's faction to change styles appropriately
    document.getElementById('oLeader').style = styles[opponentLeader];
    document.getElementById('oDeck').style = styles["deck"]; 
}

// Counter for how many cards have been replaced
let replaceCount = 0;
// Allows up to 2 replacements of initial draw
function replaceCard(card) {
    if (replaceCount < 2) {
        // Update limit counter and display to user
        replaceCount += 1;
        document.getElementById('topMsg').innerHTML = `Choose a card to redraw. ${replaceCount}/2`
        // Add card to deck
        deck.push(card.id);
        // Remove card from hand
        index = hand.indexOf(card.id);
        if (index > -1) {
            hand.splice(index, 1);
        }
        // Add new card to hand from deck
        card.style = styles[deck[0]];
        card.setAttribute("id", deck[0]);
        hand.push(deck[0]);
        deck.shift();
    }
    if (replaceCount >= 2) {
        handSelected();
    }
}

// Flag to check if starting hand has been confirmed
let handChosen = false;
// Second setup for after player has confirmed their starting hand
function handSelected() {
    handChosen = true;
    document.getElementById('topMsg2').style = "display: none;";
    document.getElementById('hand').style = "bottom: 0%;";
    document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Hide Cards
                                                        &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;End Turn`;
    
    // Remove onclick functionality until opponent has reselected their cards
    cards = document.getElementsByClassName('card');
    for (let i=0; i<hand.length; i++) {
        cards[i].removeAttribute("onclick");
    }
    socket.emit('cardsRedrawn', SID, player);
}

// Informs player that their opponent still needs to confirm starting hand
socket.on('waiting', () => {
    document.getElementById('topMsg').innerHTML = "Waiting for opponent...";
});

// Refers to the turn of the client running this script
let myTurn = false;
let hadFirst = false;
socket.on('firstTurn', (PID) => {
    // Inform players who's turn it is
    if (player != PID){    
        document.getElementById('topMsg').innerHTML = "Opponent's Turn";
    }
    else {
        document.getElementById('topMsg').innerHTML = "Your Turn";
        myTurn = true;
        hadFirst = true;
    }
    
    // Adds new onclick functionality for player whos turn it is
    if (myTurn) {
        cards = document.getElementsByClassName('card');
        for (let i=0; i<hand.length; i++) {
            cards[i].setAttribute("onclick", "selectCard(this)");
        }
    }
});

// Put Decoy on lane and put selected card back in hand
function decoyCard(card) {
    cardSelectedFlag = false;
    cancelCardSelection();
    
    let cardToHand = document.createElement('div');
    cardToHand.style = styles[card.id];
    cardToHand.className = 'card';
    cardToHand.setAttribute("id", card.id);
    cardToHand.setAttribute("onclick", "selectCard(this)");
    document.getElementById('hand').appendChild(cardToHand);
    hand.push(card.id);
        
    // Remove card from hand - As long as it's not from discard
    index = hand.indexOf(selectedCard);  
    if (index > -1) {
        hand.splice(index, 1);
    } 

    let boardPosID;
    
    // Put Decoy on corresponding row
    if(combatCards.includes(card.id) || combatSpies.includes(card.id)){
        boardPosID = 'combatLane';
    }
    else if (rangedCards.includes(card.id)){
        boardPosID = 'rangedLane';
    }
    else{
        boardPosID = 'siegeLane';
    }
    
    putCardOnBoard(boardPosID);
    
    let cardsInHand = document.getElementById("hand").childElementCount;
    document.getElementById('stats').innerHTML = `${cardsInHand} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
        
    socket.emit('switchTurn', SID, [selectedCard,card.id], [boardPosID], cardsInHand);
    card.remove();
}

const pRows = ["combatLane", "rangedLane", "siegeLane"];
const opRows = ["opCombatLane", "opRangedLane", "opSiegeLane"];
let selectedCard;
function selectCard(card) {
    cardSelectedFlag = true;
    selectedCard = card.id;
    document.getElementById('cardSelected').style = styles[selectedCard];
    document.getElementById('hand').style = "display: none;"; 
    document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">Esc</button>&nbsp;&nbsp;Cancel`;
    
    if(medicFlag){
        document.getElementById('discCards').innerHTML = "";
        document.getElementById('instructions').innerHTML = "";
    }
    else{
        // Remove card div from hand (this can be recreated if esc pressed)
        card.parentNode.removeChild(card);
    }
    
    // TODO - Check if the loop following code block is redundant
    // Resets available lanes (might be redundant due to this being in (cancelCardSelection()))
    let positions = document.querySelectorAll("combatLane, rangedLane, siegeLane, opCombatLane, opRangedLane, opSiegeLane");
    for (let i=0; i<positions.length; i++) {
        positions[i].removeAttribute("onclick");
    }

    // Highlight divs which are available for the card to be placed in
    if (combatCards.includes(selectedCard)) {
        document.getElementById('combatLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('combatLane').setAttribute('onclick','placeCard(this)');
    } 
    else if (rangedCards.includes(selectedCard)) {
        document.getElementById('rangedLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('rangedLane').setAttribute('onclick','placeCard(this)');
    }
    else if (siegeCards.includes(selectedCard)) {
        document.getElementById('siegeLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('siegeLane').setAttribute('onclick','placeCard(this)');
    }
    else if (combatSpies.includes(selectedCard)) {
        document.getElementById('opCombatLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opCombatLane').setAttribute('onclick','placeCard(this)');
    }
    else if (siegeSpies.includes(selectedCard)) {
        document.getElementById('opSiegeLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opSiegeLane').setAttribute('onclick','placeCard(this)');
    }
    // Decoy
    else if (selectedCard === "neutral1") {
        // Add functionality/ highlights to cards which can be decoyed
        pRows.forEach((row) => {
                    // Number of cards in each row
                    let len = $("."+row).find('.cardSmall')["length"];
                    for (let i=0; i<len; i++) {
                        if(!heroes.includes($("."+row).find('.cardSmall')[i]['id'])){
                            $("."+row).find('.cardSmall')[i].setAttribute("onclick","decoyCard(this)");    
                            $("."+row).find('.cardSmall')[i].style.border = "solid #0000FF";
                        }
                    }
        });
    }
    // Commander's Horn
    else if (selectedCard === "neutral2") {
        document.getElementById('combatHorn').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('rangedHorn').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('siegeHorn').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('combatHorn').setAttribute('onclick','placeCard(this)');
        document.getElementById('rangedHorn').setAttribute('onclick','placeCard(this)');
        document.getElementById('siegeHorn').setAttribute('onclick','placeCard(this)');
    }
    // Biting Frost
    else if (selectedCard === "neutral4") {
        document.getElementById('combatLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opCombatLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('combatLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('opCombatLane').setAttribute('onclick','placeCard(this)');

    }
    // Impenetrable Fog
    else if (selectedCard === "neutral5") {
        document.getElementById('rangedLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opRangedLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('rangedLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('opRangedLane').setAttribute('onclick','placeCard(this)');
    }
    // Torrential Rain
    else if (selectedCard === "neutral6") {
        document.getElementById('siegeLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opSiegeLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('siegeLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('opSiegeLane').setAttribute('onclick','placeCard(this)');
    }
    // Card must be Scorch or Clear Weather
    else {
        document.getElementById('combatLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opCombatLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('rangedLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opRangedLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('siegeLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('opSiegeLane').style = "background: rgba(255, 233, 0, 0.15);";
        document.getElementById('combatLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('opCombatLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('rangedLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('opRangedLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('siegeLane').setAttribute('onclick','placeCard(this)');
        document.getElementById('opSiegeLane').setAttribute('onclick','placeCard(this)');
    }
}

let medicFlag = false;
let revivedFlag = false;
let medicCards = []; // Placeholder for card IDs if medic is used
let medicPosIDs = []; // Placeholder for pos IDs if medic is used
function placeCard(boardPos) {
    let boardPosID = boardPos.id;
    cardSelectedFlag = false;
    cancelCardSelection();
    
    // Both medic and revived card have been placed
    if (medicFlag){
        medicCards.push(selectedCard);
        medicPosIDs.push(boardPosID);    
        medicFlag = false;
        revivedFlag = true;
        document.getElementById('hand').style = "display: fixed; bottom: 0%;";  
        document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Hide Cards
                                                                 &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;End Turn`;
        document.getElementById('pDisc').setAttribute("onclick", "showDiscard(this.id)");
        document.getElementById('oDisc').setAttribute("onclick", "showDiscard(this.id)");
        
        // Remove card from discard pile
        index = discardPiles["pDiscPile"].indexOf(selectedCard);  
        if (index > -1) {
            discardPiles["pDiscPile"].splice(index, 1);
        }   
    }

    // Displays card in corresponding location
    putCardOnBoard(boardPosID);
    
    // Updates power values on the board
    updatePowerValues();
            
    // Spy - Draw 2 cards from Deck
    if (combatSpies.concat(siegeSpies).includes(selectedCard)){
        for (let i=0;i<2;i++){
            if (deck.length != 0) {
                let card = document.createElement('div');
                card.style = styles[deck[0]];
                card.className = 'card';
                card.setAttribute("id", deck[0]);
                card.setAttribute("onclick", "selectCard(this)");
                document.getElementById('hand').appendChild(card);
                hand.push(deck[0]);
                deck.shift();
                document.getElementById('pDeckSize').innerHTML = deck.length;
            }
        }
    }
    
    // Medic - Choose a non-hero card from discard to play 
    else if(medics.includes(selectedCard)){
        let discPile = discardPiles["pDiscPile"];
        
        // Check if there are non-hero cards in the discard pile
        for (let i=0; i<discPile.length; i++){
                if(!heroes.includes(discPile[i])){
                    medicFlag = true;
                }
        }
                    
        // Can only use medic ability if there are non-hero cards in the discard pile
        if (medicFlag){
            // Prevents duplicate medic bug when chain reviving
            if(medicCards[medicCards.length-1] != selectedCard){
                medicCards.push(selectedCard);
                medicPosIDs.push(boardPosID);    
            }
            
            discSelectedFlag = true;
            revivedFlag = false;
            
            // Hide hand and instructions
            document.getElementById('hand').style = "display: none;"; 
            document.getElementById('instructions').innerHTML = "";
            
            // Prevent discards being opened while reviving
            document.getElementById('pDisc').removeAttribute("onclick");
            document.getElementById('oDisc').removeAttribute("onclick");
            
            // Show revivable unit cards
            document.getElementById('discCards').innerHTML = "";
            document.getElementById('topMsg').innerHTML = "Choose a card to revive";
            for (let i=0; i<discPile.length; i++){
                if(!heroes.includes(discPile[i])){
                    let card = document.createElement('div');
                    card.style = styles[discPile[i]];
                    card.className = 'card';
                    card.setAttribute("id", discPile[i]);
                    card.setAttribute("onclick","selectCard(this)")
                    document.getElementById('discCards').appendChild(card);   
                }
            }
        }
    }
    
    let cardsInHand = document.getElementById("hand").childElementCount;
    document.getElementById('stats').innerHTML = `${cardsInHand} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    
    // Prevents turn switch if medic has been played and player needs to revive a card
    if (!medicFlag && !revivedFlag){
        
        // Remove card from hand - As long as it's not from discard
        index = hand.indexOf(selectedCard);  
        if (index > -1) {
            hand.splice(index, 1);
        } 
        
        // Switch turn and pass data to opponent
        socket.emit('switchTurn', SID, [selectedCard], [boardPosID], cardsInHand);
    }
    
    // If a medic has been played, emit multiple cards played to the server
    else if (revivedFlag){
        revivedFlag = false;
        index = hand.indexOf(medicCards[0]);  
        if (index > -1) {
            hand.splice(index, 1);
        }   
        // Emit special switch turn with medicCards and positions and cardsinHand
        socket.emit('switchTurn', SID, medicCards, medicPosIDs, cardsInHand);
        
        medicCards = [];
        medicPosIDs = [];
    }
}

function switchWaitingMsg() {
    document.getElementById('topMsg').innerHTML = myTurn == false ? "Opponent's Turn" : "Your Turn";
}

// Switches turn after player has passed
socket.on('passedTurn', () => {
    if(!passedTurn){
        document.getElementById('oPass').innerHTML = "<p>Passed</p>";
    }
    switchTurn();
});

function updateOpDiscard(discCardID) {
    let discInd = discardPiles["opDiscPile"].indexOf(discCardID);
    discardPiles["opDiscPile"].splice(discInd,1);
    if(discardPiles["opDiscPile"].length==0){
        discEmpty("oDisc"); 
    }
    else{
        discNotEmpty(discardPiles["opDiscPile"],"oDisc");
    }
    document.getElementById('oDiscSize').innerHTML = discardPiles["opDiscPile"].length > 0 ? discardPiles["opDiscPile"].length : '';
}

// Switches turn after card has been played
socket.on('nextTurn', (cardArr, posArr, opHandSize) => {         
    if (!myTurn){
        // neutral1 is the only decoy card
        if (cardArr[0] == 'neutral1'){
            selectedCard = cardArr[0];
            putCardOnBoard(posArr[0]);
            cardsInRow = $('.'+posArr[0]).find('.cardSmall').length;
            for(let i=0; i<cardsInRow; i++){
                if($('.'+posArr[0]).find('.cardSmall')[i].id == cardArr[1]){
                    $('.'+posArr[0]).find('.cardSmall')[i].remove()
                    break;
                }
            }
        }
        else{
            for (let i=0; i<cardArr.length; i++){
                if (combatSpies.concat(siegeSpies).includes(cardArr[i])){
                    opponentDeckSize -= 2;
                    document.getElementById('oDeckSize').innerHTML = opponentDeckSize;
                }
                selectedCard = cardArr[i];
                putCardOnBoard(posArr[i]);
                document.getElementById('opponentStats').innerHTML = `${opHandSize} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;  
                if (i>0){
                    updateOpDiscard(cardArr[i]);
                }
            }    
        }
        
    }
    updatePowerValues();  
    document.getElementById("pDisc").style = styles[discardPiles["pDiscPile"][0]];
    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';
    switchTurn();
});

// Holds turn after card has been played
socket.on('returnTurn', (cardArr, posArr, opHandSize) => { 
    if (!myTurn){
        // neutral1 is the only decoy card
        if (cardArr[0] == 'neutral1'){
            selectedCard = cardArr[0];
            putCardOnBoard(posArr[0]);
            cardsInRow = $('.'+posArr[0]).find('.cardSmall').length;
            for(let i=0; i<cardsInRow; i++){
                if($('.'+posArr[0]).find('.cardSmall')[i].id == cardArr[1]){
                    $('.'+posArr[0]).find('.cardSmall')[i].remove()
                    break;
                }
            }
        }
        else{
            for (let i=0; i<cardArr.length; i++){
                selectedCard = cardArr[i];
                putCardOnBoard(posArr[i]);
                document.getElementById('opponentStats').innerHTML = `${opHandSize} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
                if (i>0){
                    updateOpDiscard(cardArr[i]);
                }
            }
        }
    }
    updatePowerValues();  
    document.getElementById("pDisc").style = styles[discardPiles["pDiscPile"][0]];
    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';
});
     
// Decide who round winner is based on total values and run any faction rules
let pLife = 2;
let oLife = 2;
socket.on('endRound', () => { 
    // Adjust lives for players and decide next turn
    removeLife();
    
    // Reset Scores
    for (let key in powerLevels){
        powerLevels[key] = 0;
        document.getElementById(key).innerHTML = 0;
    }
    
    document.getElementById('pPass').innerHTML = '';
    document.getElementById('oPass').innerHTML = '';
    passedTurn = false;
    
    // Move cards into discard arrays and remove from board
    clearCards();
});

socket.on('results', () => {
    document.getElementById('pDisc').removeAttribute("onclick");
    document.getElementById('oDisc').removeAttribute("onclick");
    document.getElementById('topMsg2').innerHTML = "Press F5 to play again";
    document.getElementById('topMsg2').style = "display:fixed;";
    
    if (pLife == 0 && oLife == 0){
        document.getElementById('topMsg').innerHTML = "Game is a Draw!";
    }
    else if(pLife > 0){
        document.getElementById('topMsg').innerHTML = "You Win!";
    }
    else{
        document.getElementById('topMsg').innerHTML = "You Lose!";
    }    
});

function removeLife() {
    // Player has won
    if(powerLevels["totalPower"] > powerLevels["opTotalPower"]) {
        document.getElementById('oHeart'+String(oLife)).style = "color:grey;";
        oLife -= 1;
        playersTurn(); // Player gets next turn if they win
    }
    // Tie
    else if(powerLevels["totalPower"] == powerLevels["opTotalPower"]) {
        document.getElementById('heart'+String(pLife)).style = "color:grey;";
        document.getElementById('oHeart'+String(oLife)).style = "color:grey;";
        oLife -= 1;
        pLife -= 1;
        // Player gets next turn if opponent had first turn initially
        if(hadFirst){
            opponentsTurn();
        }
        else{
            playersTurn();
        }
    }
    // Player has lost 
    else {
        document.getElementById('heart'+String(pLife)).style = "color:grey;";
        pLife -= 1;
        opponentsTurn(); // Opponent gets next turn if player loses round
    }
    
    // End game if a player has lost all their lives
    if(pLife == 0 || oLife == 0){
        socket.emit('endGame', SID, player);
    }
}

// Show cards in the discard pile
function showDiscard(pileID) {
    discSelectedFlag = true;
    document.getElementById('discCards').innerHTML = "";
    document.getElementById('topMsg').innerHTML = "Press Esc to Cancel";
    
    let discPile = pileID == "oDisc" ? discardPiles["opDiscPile"] : discardPiles["pDiscPile"];
    
    // Styles based on player's faction
    for (let i=0; i<discPile.length; i++){
        let card = document.createElement('div');
        card.style = styles[discPile[i]];
        card.className = 'card';
        card.setAttribute("id", discPile[i]);
        document.getElementById('discCards').appendChild(card);
    }
}

// Remove any attributes/ visuals 
function discEmpty(pileID) {
    document.getElementById(pileID).style = "display: none;";
    document.getElementById(pileID).removeAttribute("onclick");
}

// Add necessary attributes/ visuals
function discNotEmpty(discPile,pileID) {
    document.getElementById(pileID).style = styles[discPile[0]];
    document.getElementById(pileID).setAttribute("onclick","showDiscard(this.id)");
}

const rowIDs = ["combatLane", "rangedLane", "siegeLane", "opCombatLane", "opRangedLane", "opSiegeLane"];
let discardPiles = {"opDiscPile":[], "pDiscPile":[]};
function clearCards() {
    // Move cards into corresponding discard pile
    rowIDs.forEach((row) => {
                   let len = $("."+row).find('.cardSmall')["length"];
                   for (let i=0; i<len; i++){
                       if(row[0] == 'o'){
                           discardPiles["opDiscPile"].push($("."+row).find('.cardSmall')[i]['id']);
                       }
                       else{
                           discardPiles["pDiscPile"].push($("."+row).find('.cardSmall')[i]['id']);
                       }
                   }
                });
    
    if (discardPiles["pDiscPile"].length == 0){
        discEmpty("pDisc");
    }
    else{
        discNotEmpty(discardPiles["pDiscPile"],"pDisc");
    }
    
    if (discardPiles["opDiscPile"].length == 0){
        discEmpty("oDisc");
    }
    else{
        discNotEmpty(discardPiles["opDiscPile"],"oDisc");
    }
    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';
    document.getElementById('oDiscSize').innerHTML = discardPiles["opDiscPile"].length > 0 ? discardPiles["opDiscPile"].length : '';
    
    // Remove Cards from Board
    $('.cardSmall').remove();
}

function playersTurn() {
    myTurn = true;
    switchWaitingMsg();
    for (let i=0; i<hand.length; i++) {
        cards[i].setAttribute("onclick", "selectCard(this)");
    }
}

function opponentsTurn() {
    myTurn = false;
    switchWaitingMsg();
    for (let i=0; i<hand.length; i++) {
        cards[i].removeAttribute("onclick");
    }
}

function switchTurn() {
    cards = document.getElementsByClassName('card');
    if (myTurn) {
        opponentsTurn();
    }
    else {
        playersTurn();
    }
}

function putCardOnBoard(posID) {
    let card = document.createElement('div');
    card.style = styles[selectedCard];
    card.className = 'cardSmall';
    card.setAttribute("id", selectedCard);
    document.getElementById(posID).appendChild(card);
}

// Dictionaries for storing amount of twin/ morale cards and dandelion
let powMods = {};
let opPowMods = {};
// Array for storing rowIDs affected by commander's horns
let horns = []; // DO ELSEWHERE: THIS CAN BE ADDED TO IN "placeCard" FUNCTION
// Array storing rowIDs affected by weather
let weatherMods = []; // DO ELSEWHERE: THIS CAN BE ADDED TO IN "placeCard" FUNCTION
function getPowerModifiers() {
    /* 
        Iterate through all cards on board
        Get which weather cards are in effect
        Get which/ how many twin cards are in player and opponent lanes
        Get which commander's horn/ dandelion cards are down
        Get which/ how many morale cards are down
    */
    
    // Reset modifier placeholders
    powMods = {};
    opPowMods = {};
    
    // Iterate through each of the player's rows
    let cardID;
    let cardsInRow;
    pRows.forEach((row) =>{
        cardsInRow = $('.'+row).find('.cardSmall').length;
        for(let i=0; i<cardsInRow; i++){
            cardID = $('.'+row).find('.cardSmall')[i].id;
            if(tightBonds.includes(cardID) || moraleBoosters.includes(cardID)){
                if(powMods[cardID] == undefined){
                    powMods[cardID] = 1;
                }
                else{
                    powMods[cardID] += 1;
                }
            }
        }
    });
    
    opRows.forEach((row) =>{
        cardsInRow = $('.'+row).find('.cardSmall').length;
        for(let i=0; i<cardsInRow; i++){
            cardID = $('.'+row).find('.cardSmall')[i].id;
            if(tightBonds.includes(cardID) || moraleBoosters.includes(cardID)){
                if(opPowMods[cardID] == undefined){
                    opPowMods[cardID] = 1;
                }
                else{
                    opPowMods[cardID] += 1;
                }
            }
        }
    }); 
}
                   

let powerLevels = {"opSiegePower":0,
                  "opRangedPower":0,
                  "opCombatPower":0,
                  "opTotalPower":0,    
                  "combatPower":0,
                  "rangedPower":0,
                  "siegePower":0,
                  "totalPower":0};
function updatePowerValues() {  
    // Reset powerLevels with each update
    powerLevels = {"opSiegePower":0,
                  "opRangedPower":0,
                  "opCombatPower":0,
                  "opTotalPower":0,    
                  "combatPower":0,
                  "rangedPower":0,
                  "siegePower":0,
                  "totalPower":0};

    // Calculate power values for each row
    rowIDs.forEach((row) =>{
        let powerStr = row.substring(0,row.length-4)+"Power";
        let cardsInRow = $('.'+row).find('.cardSmall').length;
        for(let i=0; i<cardsInRow; i++){
            powerLevels[powerStr] += cardPowers[$('.'+row).find('.cardSmall')[i].id];
        }
        
        // Display power value for each row
        document.getElementById(powerStr).innerHTML = powerLevels[powerStr];
    });
    
    // Calculate total power values
    powerLevels["totalPower"] = powerLevels["combatPower"] + powerLevels["rangedPower"] + powerLevels["siegePower"];
    powerLevels["opTotalPower"] = powerLevels["opCombatPower"] + powerLevels["opRangedPower"] + powerLevels["opSiegePower"];
    
    // Display total power values
    document.getElementById("opTotalPower").innerHTML = powerLevels["opTotalPower"];
    document.getElementById("totalPower").innerHTML = powerLevels["totalPower"];
}

let handHiddenFlag = false;
let cardSelectedFlag = false;
let discSelectedFlag = false;
let passedTurn = false;
function keyPressed(event) {
    // Enter pressed and hand hasn't been selected AND card is not being revived
    if (event.keyCode === 13 && !handChosen){
        handSelected();
    }
    
    // E pressed AND hand has been chosen AND card has not been selected AND card is not being revived
    if (event.keyCode === 69 && handChosen && !cardSelectedFlag && !medicFlag){
        if (handHiddenFlag){
            document.getElementById('hand').style = "display: fixed; bottom: 0%;";  
            document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Hide Cards
                                                                 &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;End Turn`;
            handHiddenFlag = false;
        }
        else{
            document.getElementById('hand').style = "display: none;";           
            document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Show Cards
                                                                 &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;End Turn`;
            handHiddenFlag = true;
        }
    }
    
    // Esc pressed AND a card has been selected AND card is not being revived
    if (event.keyCode === 27 && cardSelectedFlag && !medicFlag){
        cardSelectedFlag = false;
        cancelCardSelection();
        
        // Recreate card in hand
        let card = document.createElement('div');
        card.style = styles[selectedCard];
        card.className = 'card';
        card.setAttribute("id", selectedCard);
        card.setAttribute("onclick", 'selectCard(this)');
        document.getElementById('hand').appendChild(card);
        
        // Remove any borders around cards (used for decoy card)
        pRows.forEach((row) => {
            // Number of cards in each row
            let len = $("."+row).find('.cardSmall')["length"];
            for (let i=0; i<len; i++) {
                $("."+row).find('.cardSmall')[i].style.border = '';
            }
        });
    }
    
    // Esc pressed AND discard is showing AND card is not being revived
    if (event.keyCode === 27 && discSelectedFlag && !medicFlag){
        discSelectedFlag = false;
        document.getElementById('topMsg').innerHTML = myTurn == false ? "Opponent's Turn" : "Your Turn";
        document.getElementById('discCards').innerHTML = "";
    }
    
    // Space pressed AND player's turn AND card is not selected AND card is not being revived
    if (event.keyCode===32 && myTurn && !cardSelectedFlag && !medicFlag){
        document.getElementById('pPass').innerHTML = "<p>Passed</p>";
        passedTurn = true;
        socket.emit('passTurn', SID);
    }
}

function cancelCardSelection() {
        // Remove card from placeholder at top
        document.getElementById('cardSelected').style = "display: none;";
        
        const boardIDs = ['combatLane','opCombatLane','rangedLane','opRangedLane','siegeLane','opSiegeLane','combatHorn','rangedHorn','siegeHorn'];
        
        // Remove any div highlights for where card can be placed and onclick attributes
        boardIDs.forEach((id) =>{
            document.getElementById(id).style = "background: none;";    
            document.getElementById(id).removeAttribute("onclick");
        });
    
        // Remove any borders around cards (used for decoy card)
        pRows.forEach((row) => {
            // Number of cards in each row
            let len = $("."+row).find('.cardSmall')["length"];
            for (let i=0; i<len; i++) {
                $("."+row).find('.cardSmall')[i].style.border = '';
            }
        });
    
        // Show hand and instructions again
        document.getElementById('hand').style = "display: fixed; bottom: 0%;";
        document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Hide Cards
                                                             &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;End Turn`;
}

