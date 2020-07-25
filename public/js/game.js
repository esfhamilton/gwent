const socket = io();

// Get SID and faction ID from URL
const {SID, player} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('rejoinRequest', SID);
socket.emit('getPlayerDeck', SID, player);
socket.emit('startCheck', SID);

// Initialises neutral and NR faction styles
let stylesNR = {deck:"background: url(img/cards_16.jpg) 64.5% 94% / 455% 331%; display: block;",
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
              faction28:"background: url(img/cards_09.jpg) 35.5% 6% / 455% 331%; display: block;"};

let faction;
let leader;
let deck;
let hand = [];
socket.on('playerAssigned', (FID, leaderID, cards) => {
    faction = FID;
    leader = 'lead'+leaderID;
    deck = shuffle(cards);
});

let opponentFaction;
let opponentLeader;
let opponentDeckSize;
socket.on('opponentDeck', (opponentFID, opponentLID, opDeckSize) => {
    opponentFaction = opponentFID;
    opponentLeader = 'lead'+opponentLID;
    opponentDeckSize = opDeckSize;
    setup()
});

socket.on('startGame', () => {
    document.getElementById('waitingMsg').innerHTML = "Starting game...";
    socket.emit('getOpponentDeck', SID, player);
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

// The amount of cards the player draws at the start
let initDraw = 10;
function setup() {
    document.addEventListener("keydown",keyPressed);
    document.getElementById('redrawMsg').style = "display: fixed;";
    document.getElementById('redrawMsg2').style = "display: fixed;";
    document.getElementById('pStats').style = "display: fixed;";
    document.getElementById('oStats').style = "display: fixed;";
    document.getElementById('stats').innerHTML = `${initDraw} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    document.getElementById('opponentStats').innerHTML = `${initDraw} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    
    
    // Styles based on player's faction
    for (let i=0; i<initDraw; i++){
        let card = document.createElement('div');
        card.style = stylesNR[deck[0]];
        card.className = 'card';
        card.setAttribute("id", deck[0]);
        card.setAttribute("onclick", "replaceCard(this)");
        document.getElementById('hand').appendChild(card);
        hand.push(deck[0]);
        deck.shift();
    }
    document.getElementById('playerLeader').style = stylesNR[leader];
    document.getElementById('playerDeck').style = stylesNR["deck"];
    
    // This will require opponent's faction to change styles appropriately
    document.getElementById('opponentLeader').style = stylesNR[opponentLeader];
    document.getElementById('opponentDeck').style = stylesNR["deck"];
    document.getElementById('waitingMsg').style = "display: none;";
}

let replaceLimit = 0;
function replaceCard(card) {
    if (replaceLimit < 2) {
        // Update limit counter and display to user
        replaceLimit += 1;
        document.getElementById('redrawMsg').innerHTML = `Choose a card to redraw. ${replaceLimit}/2`
        // Add card to deck
        deck.push(card.id);
        // Remove card from hand
        index = hand.indexOf(card.id);
        if (index > -1) {
          hand.splice(index, 1);
        }
        // Add new card to hand from deck
        card.style = stylesNR[deck[0]];
        card.setAttribute("id", deck[0]);
        hand.push(deck[0]);
        deck.shift();
    }
    if (replaceLimit >= 2) {
        handSelected();
    }
}

function keyPressed(event) {
    if (event.keyCode === 13) {
        handSelected();
    }
}

function handSelected() {
    document.getElementById('redrawMsg').style = "display: none;";
    document.getElementById('redrawMsg2').style = "display: none;";
    document.getElementById('hand').style = "bottom: 0%;";
    
    // Change onclick functionality
    cards = document.getElementsByClassName('card');
    for (let i=0; i<hand.length; i++) {
        cards[i].setAttribute("onclick", "test(this)");
    }
    
    /*TODO
        Add deck (on card) counters (in setup())
        Add text and key press event to show/ hide hand 
        Socket emit to show player is ready
        When both players have reselected, server decides who goes first 
    */
}

function test(card) {
    console.log(card);
}

