const socket = io();

// Get SID and faction ID from URL
const {SID, player} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('rejoinRequest', SID);
socket.emit('getPlayerDeck', SID, player);
socket.emit('startCheck', SID);

// Initialises neutral and NR faction styles
/*
    TODO change to be called styles
    and set the actual styles based 
    on faction rather than 4 different
    style objects. Call function for this around line 74
*/
let styles= {deck:"background: url(img/cards_16.jpg) 64.5% 94% / 455% 331%; display: block;",
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
    document.getElementById('pDeckSize').innerHTML = deck.length;
    document.getElementById('oDeckSize').innerHTML = opponentDeckSize;
    document.getElementById('pStats').style = "display: fixed;";
    document.getElementById('oStats').style = "display: fixed;";
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
    document.getElementById('playerLeader').style = styles[leader];
    document.getElementById('playerDeck').style = styles["deck"];
    
    // This will require opponent's faction to change styles appropriately
    document.getElementById('opponentLeader').style = styles[opponentLeader];
    document.getElementById('opponentDeck').style = styles["deck"];
    hideWaitingMsg();
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
        card.style = styles[deck[0]];
        card.setAttribute("id", deck[0]);
        hand.push(deck[0]);
        deck.shift();
    }
    if (replaceLimit >= 2) {
        handSelected();
    }
}

let handChosen = false;
function handSelected() {
    handChosen = true;
    document.getElementById('redrawMsg').style = "display: none;";
    document.getElementById('redrawMsg2').style = "display: none;";
    document.getElementById('hand').style = "bottom: 0%;";
    document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Hide Cards
                                                        &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;Skip Turn`;
    
    // Remove onclick functionality until opponent has reselected their cards
    cards = document.getElementsByClassName('card');
    for (let i=0; i<hand.length; i++) {
        cards[i].removeAttribute("onclick");
    }
    socket.emit('cardsRedrawn', SID, player);
}

// Informs player that their opponent still needs to confirm starting hand
socket.on('waiting', () => {
    document.getElementById('waitingMsg').innerHTML = "Waiting for opponent...";
    showWaitingMsg();
});

// Refers to the turn of the client running this script
let myTurn = false;
socket.on('firstTurn', (PID) => {
    // Inform player if they need to wait for opponent
    document.getElementById('waitingMsg').innerHTML = "Opponent's turn...";
    if (player != PID){
        showWaitingMsg();
    }
    else {
        hideWaitingMsg();
        myTurn = true;
    }
    
    // Adds new onclick functionality for player whos turn it is
    if (myTurn) {
        cards = document.getElementsByClassName('card');
        for (let i=0; i<hand.length; i++) {
            cards[i].setAttribute("onclick", "playCard(this)");
        }
    }
});

function playCard(card) {
    cardSelectedFlag = true;
    document.getElementById('cardSelected').style = styles[card.id];
    document.getElementById('hand').style = "display: none;"; 
    document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">Esc</button>&nbsp;&nbsp;Cancel`;
}

function showWaitingMsg() {
    document.getElementById('waitingMsg').style = "display: fixed;";
}

function hideWaitingMsg() {
    document.getElementById('waitingMsg').style = "display: none;";
}

socket.on('nextTurn', () => {
    cards = document.getElementsByClassName('card');
    if (myTurn) {
        myTurn = false;
        showWaitingMsg();
        for (let i=0; i<hand.length; i++) {
            cards[i].removeAttribute("onclick");
        }
    }
    else {
        myTurn = true;
        hideWaitingMsg();
        for (let i=0; i<hand.length; i++) {
            cards[i].setAttribute("onclick", "playCard(this)");
        }
    }
});

let handHiddenFlag = false;
let handSelectedFlag = false;
let cardSelectedFlag = false;
function keyPressed(event) {
    // Enter pressed and hand hasn't been selected
    if (event.keyCode === 13 && !handSelectedFlag) {
        handSelectedFlag = true;
        handSelected();
    }
    
    // E pressed AND hand has been chosen AND card has not been selected
    if (event.keyCode === 69 && handChosen && !cardSelectedFlag) {
        if (handHiddenFlag) {
            document.getElementById('hand').style = "display: fixed; bottom: 0%;";  
            document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Hide Cards                                                                    &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;Skip                                                              Turn`;
            handHiddenFlag = false;
        }
        else {
            document.getElementById('hand').style = "display: none;";           
            document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Show Cards
                                                                 &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;Skip Turn`;
            handHiddenFlag = true;
        }
    }
    
    // Esc pressed AND a card has been selected
    if (event.keyCode === 27 && cardSelectedFlag) {
        cardSelectedFlag = false;

        document.getElementById('cardSelected').style = "display: none;";
        document.getElementById('hand').style = "display: fixed; bottom: 0%;";
        document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">E</button>&nbsp;&nbsp;Show Cards
                                                             &nbsp;&nbsp;<button style="font-size: 70%;">⌴</button>&nbsp;&nbsp;Skip Turn`;
    }
    
    // Space pressed AND it is player's turn AND card is not selected
    if (event.keyCode===32 && myTurn && !cardSelectedFlag) {
        socket.emit('skipTurn', SID);
    }
}
