"use strict";

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
socket.on('noDeck', () => {
    document.getElementById('topMsg').innerHTML = `Error: No Deck has been Built.`;
});

let factionId, leaderId, deck, index, firstTurn;
let hand = [];
socket.on('playerAssigned', (FID, leaderID, cards) => {
    factionId = FID;
    leaderId = leaderID;
    deck = cards;
});

socket.on('startGame', () => {
    document.getElementById('topMsg').innerHTML = "Starting game...";
    socket.emit('getOpponentDeck', SID, player);
});

function setCardStyle(elementId, styleId){
    document.getElementById(elementId).style.background = styles[styleId].background; 
    document.getElementById(elementId).style.display = styles[styleId].display; 
}

function factionPerkST() {
    // Get the modal
    let modal = document.getElementById("STModal");

    modal.style.display = "block";
    let playerFirstBtn = document.getElementById('playerFirstBtn');
    let opponentFirstBtn = document.getElementById('opponentFirstBtn');
    playerFirstBtn.onclick = function() {
        firstTurn = player;
        modal.style.display = "none";
        setup();
    }
    opponentFirstBtn.onclick = function() {
        firstTurn = player === 'A' ? 'B' : 'A';
        modal.style.display = "none";
        setup();
    }
}

let opFactionId, opLeaderId;
let opponentDeck = [];
socket.on('opponentDeck', (opponentFID, opponentLID, opDeck) => {
    if(opponentDeck.length === 0){
        opFactionId = opponentFID;
        opLeaderId = opponentLID;
        opponentDeck = opDeck;
        if(factionId === "ST" && opFactionId !== "ST") factionPerkST();
        else setup();
    }
    else{
        opponentDeck = opDeck;
    }
});

let opponentHandSize = baseDrawCount;
// Sets up mulligan phase after both players have created their decks
function setup() {
    const drawCount = (leaderId === "STLeader3") ? baseDrawCount+1 : baseDrawCount;
    const opDrawCount = (opLeaderId === "STLeader3") ? baseDrawCount+1 : baseDrawCount;

    grayscaleUsedLeaders();

    document.addEventListener("keydown",keyPressed);
    document.getElementById('topMsg').innerHTML = "Choose a card to redraw. 0/2";
    document.getElementById('topMsg2').style = "display: fixed;";
    document.getElementById('pStats').style = "display: fixed;";
    document.getElementById('oStats').style = "display: fixed;";
    document.getElementById('pDeckSize').innerHTML = deck.length-baseDrawCount;
    document.getElementById('oDeckSize').innerHTML = opponentDeck.length-opDrawCount;
    
    powerIds.forEach((id) => {
        document.getElementById(id).innerHTML = 0;
    });
    
    document.getElementById('stats').innerHTML = `${drawCount} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    document.getElementById('opponentStats').innerHTML = `${opDrawCount} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    
    for (let i=0; i<baseDrawCount; i++){
        drawCardFromDeck('replaceCard(this)');
    }
    document.getElementById('pLeaderContainer').setAttribute('onclick', "leaderSelected('"+leaderId+"')");
    document.getElementById('oLeaderContainer').setAttribute('onclick', "leaderSelected('"+opLeaderId+"')");
    setCardStyle('pLeader', leaderId);
    setCardStyle('oLeader', opLeaderId);
    setCardStyle('pDeck', factionId);
    setCardStyle('oDeck', opFactionId);
}

const grayscaleUsedLeaders = () => {
    if(leaderId === "NGLeader1" || opLeaderId === "NGLeader1"){
        document.getElementById('pLeader').style = "filter: grayscale(90%);"
        document.getElementById('oLeader').style = "filter: grayscale(90%);"
    }
    if (leaderId === "STLeader3") {
        document.getElementById('pLeader').style = "filter: grayscale(90%);"
    }
    if (opLeaderId === "STLeader3"){
        document.getElementById('oLeader').style = "filter: grayscale(90%);"
    }
}

const leaderSelected = (leaderId) => {
    if(handChosen && !cardSelectedFlag && !switchTurnLock && !gameEnded){
        document.getElementById('cardDetailView').style = "display: fixed;";
        setCardStyle('cardDetailView', leaderId);
        document.getElementById('topMsg').innerHTML = abilityDescriptions[leaderId];
        document.getElementById('topMsg2').innerHTML = "Press Esc to close";
    }
};

function createCard(cardId, positionId, attribute, className = "card") {
    let card = document.createElement('div');
    card.style.background = styles[cardId].background;
    card.style.display = styles[cardId].display;
    card.className = className;
    card.setAttribute('id', cardId);
    card.setAttribute('onclick', attribute);
    document.getElementById(positionId).appendChild(card);
}

function drawCardFromDeck(attribute) {
    if(deck.length !== 0){
        createCard(deck[0], 'hand', attribute);
        hand.push(deck[0]);
        deck.shift();
    }
}

function drawCardFromDiscard(card, drawFromOpDisc){
    let cardId = card.id;
    createCard(cardId, 'hand', "selectCard(this)");
    hand.push(cardId);
    drawFromOpDisc ? removeCardFromDiscard(cardId, "opDiscPile") : removeCardFromDiscard(cardId, "pDiscPile");
    displayTurnMessage();
    document.getElementById('highlightedCards').innerHTML = '';
    handHiddenFlag = false;
    document.getElementById('hand').style = "display: fixed; bottom: 1%;";
    document.getElementById('stats').innerHTML = `${hand.length} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;    
    document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
    document.getElementById('instructions').innerHTML = instructionTextHide;

    switchTurnLock = false;
    socket.emit('switchTurn', SID, [cardId], [], hand.length, true);
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
        card.style.background = styles[deck[0]].background;
        card.style.display = styles[deck[0]].display;
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
let cardElements;
// Second setup for after player has confirmed their starting hand
function handSelected() {
    handChosen = true;
    document.getElementById('topMsg2').innerHTML = '';
    document.getElementById('hand').style = "bottom: 1%;";
    document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
    document.getElementById('instructions').innerHTML = instructionTextHide;
    
    if(leaderId === "STLeader3") drawCardFromDeck("");

    // Remove onclick functionality until opponent has reselected their cards
    cardElements = document.getElementsByClassName('card');
    for (let i=0; i<hand.length; i++) {
        cardElements[i].removeAttribute("onclick");
    }
    socket.emit('cardsRedrawn', SID, player, deck, firstTurn);
}

// Informs player that their opponent still needs to confirm starting hand
socket.on('waiting', () => {
    document.getElementById('topMsg').innerHTML = "Waiting for opponent...";
});

// Refers to the turn of the client running this script
let myTurn = false;
let hadFirst = false;
socket.on('firstTurn', (PID) => {
    socket.emit('getOpponentDeck', SID, player);

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
        cardElements = document.getElementsByClassName('card');
        for (let i=0; i<hand.length; i++) {
            cardElements[i].setAttribute("onclick", "selectCard(this)");
        }
    }
});

// Put Decoy on lane and put selected card back in hand
function decoyCard(card) {
    cardSelectedFlag = false;
    cancelCardSelection();
    
    let cardToHand = document.createElement('div');
    cardToHand.style.background = styles[card.id].background;
    cardToHand.style.display = styles[card.id].display;
    cardToHand.className = 'card';
    cardToHand.setAttribute("id", card.id);
    cardToHand.setAttribute("onclick", "selectCard(this)");
    document.getElementById('hand').appendChild(cardToHand);
    hand.push(card.id);

    let boardPosID;
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
    cardsPlaced([selectedCard,card.id], [boardPosID]);
    card.remove();
}

function getMusterCategory(cardId) {
    let musterCategory = null;
    Object.keys(musterCategories).forEach(category => {
        if(musterCategories[category].includes(cardId)) musterCategory = category;
    });
    return musterCategory;
}

const activateValidPositions = ((id) => {
    document.getElementById(id).style.background = "rgba(255, 233, 0, 0.15)";
    document.getElementById(id).setAttribute('onclick','placeCard(this)');
})

let selectedCard;
function selectCard(card) {
    if(gameEnded) return;

    cardSelectedFlag = true;
    selectedCard = card.id;
    setCardStyle('cardSelected', selectedCard);
    document.getElementById('hand').style = "display: none;"; 
    document.getElementById('leaderInstructions').innerHTML = '';
    document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">Esc</button>&nbsp;&nbsp;Cancel`;
    
    if(switchTurnLock){
        document.getElementById('highlightedCards').innerHTML = '';
        document.getElementById('instructions').innerHTML = '';
    }
    else{
        card.parentNode.removeChild(card); // Remove card from hand
    }

    // Highlight divs which are available for the card to be placed in
    if (combatCards.includes(selectedCard)) {
        activateValidPositions('combatLane');
    } 
    if (rangedCards.includes(selectedCard)) {
        activateValidPositions('rangedLane');
    }
    if (siegeCards.includes(selectedCard)) {
        activateValidPositions('siegeLane');
    }
    if (combatSpies.includes(selectedCard)) {
        activateValidPositions('opCombatLane');
    }
    if (siegeSpies.includes(selectedCard)) {
        activateValidPositions('opSiegeLane');
    }
    if (selectedCard === decoy) {
        pRows.forEach((row) => {
                    let len = $("."+row).find('.cardSmall')["length"];
                    for (let i=0; i<len; i++) {
                        if(!heroes.includes($("."+row).find('.cardSmall')[i]['id'])){
                            $("."+row).find('.cardSmall')[i].setAttribute("onclick","decoyCard(this)");    
                            $("."+row).find('.cardSmall')[i].style.border = "solid #0000FF";
                        }
                    }
        });
    }
    if (selectedCard === commandersHorn) {
        hornIds.slice(0,3).forEach((id) => {
            if(!doubledRows.includes(id)) activateValidPositions(id);
        })
    }
    if (selectedCard === bitingFrost) {
        activateValidPositions('combatLane');
        activateValidPositions('opCombatLane');
    }
    if (selectedCard === impenetrableFog) {
        activateValidPositions('rangedLane');
        activateValidPositions('opRangedLane');
    }
    if (selectedCard === torrentialRain) {
        activateValidPositions('siegeLane');
        activateValidPositions('opSiegeLane');
    }

    // Card must be Scorch or Clear Weather
    if (selectedCard === scorchId || selectedCard === clearWeather) {
        rowIds.forEach((id) => {
            activateValidPositions(id);
        });
    }
}

let revivedFlag = false;
let medicCards = []; // Placeholder for card Ids if medic is used
let medicPosIDs = []; // Placeholder for pos Ids if medic is used
let doubledRows = []; // Positions with horns placed

async function placeCard(boardPos) {
    const firstSelectedCard = selectedCard;
    let boardPosId = boardPos.id;
    cardSelectedFlag = false;
    cancelCardSelection();
    
    // Both medic and revived card have been placed
    if (switchTurnLock){
        medicCards.push(selectedCard);
        medicPosIDs.push(boardPosId);    
        switchTurnLock = false;
        revivedFlag = true;
        document.getElementById('hand').style = "display: fixed; bottom: 1%;";  
        document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
        document.getElementById('instructions').innerHTML = instructionTextHide;
        document.getElementById('pDisc').setAttribute("onclick", "showDiscard(this.id)");
        document.getElementById('oDisc').setAttribute("onclick", "showDiscard(this.id)");
        
        removeCardFromDiscard(selectedCard, "pDiscPile")
    }

    let musterCategory = getMusterCategory(selectedCard);
    if (Object.keys(musterCategories).includes(musterCategory)){
        let cardsPlayed = [];
        let cardPositions  = [];
        if(selectedCard === arachasBehemoth){
            putCardOnBoard(boardPosId);
            cardsPlayed.push(selectedCard);
            cardPositions.push(boardPosId)
            musterCategory = "Arachas";
            boardPosId = "combatLane";
            hand.splice(hand.indexOf(selectedCard), 1);
        } 
        musterCategories[musterCategory].forEach(cardId => {
            if(deck.includes(cardId)){
                selectedCard = cardId;
                putCardOnBoard(boardPosId);
                deck.splice(deck.indexOf(cardId), 1);
                cardsPlayed.push(cardId);
                cardPositions.push(boardPosId)
            }

            if(hand.includes(cardId)){
                selectedCard = cardId;
                putCardOnBoard(boardPosId);
                hand.splice(hand.indexOf(cardId), 1);
                cardsPlayed.push(cardId);
                cardPositions.push(boardPosId)
                if(selectedCard !== firstSelectedCard) document.getElementsByClassName('card')[selectedCard].remove();
            }
        });

        cardsPlaced(cardsPlayed, cardPositions);
        return;
    }

    if(weatherCards.includes(selectedCard)){
        putCardOnBoard(boardPosId);
        weatherEffects.push(selectedCard);
        cardsPlaced([selectedCard], [boardPosId]);
        return;
    }

    if (selectedCard === clearWeather){
        resetWeather();
        cardsPlaced([selectedCard], [boardPosId]);
        return;
    }

    // Displays card in corresponding location
    if(selectedCard !== scorchId){
        putCardOnBoard(boardPosId);    
    }
    
    // Updates power values on the board
    updatePowerValues();
            
    // Spy - Draw 2 cards from Deck
    if (combatSpies.concat(siegeSpies).includes(selectedCard)){
        for (let i=0;i<2;i++){
            if (deck.length != 0) {
                drawCardFromDeck("selectCard(this)");
            }
        }
    }
    
    else if(selectedCard === scorchId){
        await scorch(rowIds);
    }
    
    else if(selectedCard === villentretenmerth){
        updatePowerValues();
        if(powerLevels["opCombatPower"] >= 10) await scorch(["opCombatLane"]);
    }
    
    else if(horns.includes(selectedCard)){
        doubledRows.push(boardPosId);
    }
    
    // Medic - Choose a non-hero card from discard to play 
    else if(medics.includes(selectedCard)){
        let discPile = discardPiles["pDiscPile"];
        
        // Lock turn switch if card can be revived
        for (let i=0; i<discPile.length; i++){
            if(!heroes.includes(discPile[i])) switchTurnLock = true;           
        }

        if (switchTurnLock){
            // Prevents duplicate medic bug when chain reviving
            if(medicCards[medicCards.length-1] != selectedCard){
                medicCards.push(selectedCard);
                medicPosIDs.push(boardPosId);    
            }
            
            revivedFlag = false;
            
            // Hide hand and instructions
            document.getElementById('hand').style = "display: none;"; 
            document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
            document.getElementById('instructions').innerHTML = '';
            
            // Show revivable unit cards
            document.getElementById('highlightedCards').innerHTML = '';
            document.getElementById('topMsg').innerHTML = "Choose a card to revive";
            for (let i=0; i<discPile.length; i++){
                if(!heroes.includes(discPile[i])){
                    createCard(discPile[i], 'highlightedCards', 'selectCard(this)');
                }
            }
        }
    }
    
    // Turn switch only occurs if not locked and card hasn't been revived (this is handled in next condition)
    if (!switchTurnLock && !revivedFlag){
        cardsPlaced([selectedCard], [boardPosId]);
    }
    
    // If a medic has been played, emit multiple cards played to the server
    else if (revivedFlag){
        cardsPlaced(medicCards, medicPosIDs);
        medicCards = [];
        medicPosIDs = [];
        switchTurnLock = false;
        revivedFlag = false;
    }
}

function cardsPlaced(cards, positions){
    index = hand.indexOf(cards[0]);  
    if (index > -1) hand.splice(index, 1); // Remove card from hand - If not in discard
    
    document.getElementById('stats').innerHTML = `${hand.length} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;    
    socket.emit('switchTurn', SID, cards, positions, hand.length, false);
}

function leaderHorn(row){
    let hornId = row.slice(0,-4).concat("Horn");
    let hornPlaced = $('.'+hornId).find('.cardSmall')[0];
    if(!hornPlaced){
        doubledRows.push(row)
        selectedCard = commandersHorn;
        putCardOnBoard(hornId);
    }
}

function playLeaderWeather(cardId, spliceDeck = false, switchTurn = false){
    if(spliceDeck) deck.splice(deck.indexOf(cardId),1);
    selectedCard = cardId;
    putCardOnBoard("weatherStats");
    weatherEffects.push(cardId);

    document.getElementById('highlightedCards').innerHTML = '';
    handHiddenFlag = false;
    document.getElementById('hand').style = "display: fixed; bottom: 1%;";
    document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
    document.getElementById('instructions').innerHTML = instructionTextHide;

    if(switchTurn){
        switchTurnLock = false;
        socket.emit('switchTurn', SID, [cardId], [], hand.length, true);
    } 
}

function playWeatherCardFromDeck(){
    switchTurnLock = true;
    document.getElementById('hand').style = "display: none;";           
    document.getElementById('instructions').innerHTML = '';
    
    let weatherCardsInDeck = [];
    weatherCards.forEach((cardId) => {
        if(deck.includes(cardId)) weatherCardsInDeck.push(cardId);
    });
    
    if(weatherCardsInDeck.length > 0){
        document.getElementById('topMsg').innerHTML = "Choose a card to play";
        weatherCardsInDeck.forEach((cardId) => {
            createCard(cardId, 'highlightedCards', 'playLeaderWeather(this.id, true, true)');
        });
    }
    else{
        document.getElementById('topMsg').innerHTML = "No weather cards in deck";
        document.getElementById('topMsg2').innerHTML = "Press Esc to continue";
        releaseTurnLockOnEsc = true;
    }
}

let discarded;
let chosenCards = [];
function discard2Draw1(){
    switchTurnLock = true;
    discarded = 0;
    if(deck.length < 1 || hand.length < 2){
        document.getElementById('topMsg').innerHTML = "Not enough cards available for leader ability";
        document.getElementById('topMsg2').innerHTML = "Press Esc to continue";
        releaseTurnLockOnEsc = true;
        return;
    }
    else{
        document.getElementById('topMsg').innerHTML = `Choose 2 cards to discard. ${discarded}/2`;
        document.getElementById('hand').innerHTML = '';
        hand.forEach((cardId) => {
            createCard(cardId, 'hand', 'discard(this)');
        });
    }
}

const discard = ((card) => {
    discarded += 1;
    chosenCards.push(card.id);
    document.getElementById('topMsg').innerHTML = `Choose 2 cards to discard. ${discarded}/2`;
    hand.splice(hand.indexOf(card.id), 1);
    card.parentNode.removeChild(card);
    discardPiles["pDiscPile"].push(card.id);
    card.remove();

    if(discarded === 2){
        discNotEmpty(discardPiles["pDiscPile"],"pDisc");
        document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';
        showCardsInDeck();
    }  
}); 

const showCardsInDeck = (() => {
    document.getElementById('topMsg').innerHTML = `Choose a card to draw`;
    document.getElementById("hand").style = "display: none;"

    for(let i=0; i<deck.length; i++){
        createCard(deck[i], 'highlightedCards', 'drawCardOfChoice(this.id)');
    }
}); 

const drawCardOfChoice = ((cardId) => {
    chosenCards.push(cardId);
    document.getElementById("highlightedCards").innerHTML = '';    
    
    hand.push(cardId);
    document.getElementById('hand').innerHTML = '';
    for (let i=0; i<hand.length; i++){
        createCard(hand[i], 'hand', 'selectCard(this)');
    }
    document.getElementById('hand').style = "display: fixed; bottom: 1%;";

    deck.splice(deck.indexOf(cardId),1);
    
    switchTurnLock = false;
    socket.emit('switchTurn', SID, chosenCards, [], hand.length, true);
}); 

async function useLeaderAbility(useOpponentLeaderAbility=false, cardIds=[]){
    switchTurnLock = false;

    if(useOpponentLeaderAbility) document.getElementById('oLeader').style = "filter: grayscale(90%);"
    else document.getElementById('pLeader').style = "filter: grayscale(90%);"
    setCardStyle('pLeader', leaderId);
    setCardStyle('oLeader', opLeaderId);

    let leaderUsed = useOpponentLeaderAbility ? opLeaderId : leaderId;
    switch(leaderUsed){
        case "NRLeader1": // Doubles siege lane strength 
            useOpponentLeaderAbility ? leaderHorn('opSiegeLane') : leaderHorn('siegeLane');
            break;
        case "NRLeader2": // Plays impenetrable fog from deck
            if(useOpponentLeaderAbility && opponentDeck.includes(impenetrableFog)){
                opponentDeck.splice(opponentDeck.indexOf(impenetrableFog),1)
                playLeaderWeather(impenetrableFog);
            }
            else if(!useOpponentLeaderAbility && deck.includes(impenetrableFog)){
                playLeaderWeather(impenetrableFog, true);
            }
            
            break;
        case "NRLeader3": // Clears weather effects
            resetWeather();
            break;
        case "NRLeader4": // Destroy enemies strongest siege unit(s) if opSiegePower >= 10
            if(useOpponentLeaderAbility){
                if(powerLevels["siegePower"] >= 10) await scorch(["siegeLane"]);
            } 
            else {
                if(powerLevels["opSiegePower"] >= 10) await scorch(["opSiegeLane"]);
            }
            break;
        
        case "NGLeader2": // Plays torrential rain from deck
            if(useOpponentLeaderAbility && opponentDeck.includes(torrentialRain)){
                opponentDeck.splice(opponentDeck.indexOf(torrentialRain),1)
                playLeaderWeather(torrentialRain);
            }
            else if(!useOpponentLeaderAbility && deck.includes(torrentialRain)){
                playLeaderWeather(torrentialRain, true);
            }
            break;
        case "NGLeader3": // Look at 3 random cards from opponent's hand
            if(!useOpponentLeaderAbility){
                handHiddenFlag = true;
                switchTurnLock = true;
                releaseTurnLockOnEsc = true;
                document.getElementById('hand').style = "display: none;";           
                document.getElementById('instructions').innerHTML = instructionTextShow;
                socket.emit('getOpponentHand', SID, player); 
            }
            break;
        case "NGLeader4": // Draw card from opponent's discard
            if(!useOpponentLeaderAbility){
                switchTurnLock = true;
                document.getElementById('hand').style = "display: none;";           
                document.getElementById('instructions').innerHTML = instructionTextShow;
                
                let opDiscPile = discardPiles["opDiscPile"];
                if(opDiscPile.length > 0){
                    document.getElementById('topMsg').innerHTML = "Choose a card to draw";
                    for (let i=0; i<opDiscPile.length; i++){
                        createCard(opDiscPile[i], 'highlightedCards', 'drawCardFromDiscard(this, true)');
                    }
                }
                else{
                    document.getElementById('topMsg').innerHTML = "Opponent's discard is empty";
                    document.getElementById('topMsg2').innerHTML = "Press Esc to continue";
                    releaseTurnLockOnEsc = true;
                }
            } else {
                if(cardIds.length === 1) removeCardFromDiscard(cardIds[0], "pDiscPile");
            }
            break;

        case "STLeader1": // Doubles ranged lane strength    
            useOpponentLeaderAbility ? leaderHorn('opRangedLane') : leaderHorn('rangedLane');
            break;
        case "STLeader2": // Play biting frost card from deck    
            if(useOpponentLeaderAbility && opponentDeck.includes(bitingFrost)){
                opponentDeck.splice(opponentDeck.indexOf(bitingFrost),1)
                playLeaderWeather(bitingFrost);
            }
            else if(!useOpponentLeaderAbility && deck.includes(bitingFrost)){
                playLeaderWeather(bitingFrost, true);
            }
            break; 
        case "STLeader4": // Destroy enemies strongest combat unit(s) if opCombatPower >= 10
            if(useOpponentLeaderAbility){
                if(powerLevels["combatPower"] >= 10) await scorch(["combatLane"]);
            } 
            else {
                if(powerLevels["opCombatPower"] >= 10) await scorch(["opCombatLane"]);
            }
            break;
        
        case "MOLeader1": // Draw card from discard
            if(!useOpponentLeaderAbility){
                switchTurnLock = true;
                document.getElementById('hand').style = "display: none;";           
                document.getElementById('instructions').innerHTML = instructionTextShow;
                
                let discPile = discardPiles["pDiscPile"];
                if(discPile.length > 0){
                    document.getElementById('topMsg').innerHTML = "Choose a card to draw";
                    for (let i=0; i<discPile.length; i++){
                        createCard(discPile[i], 'highlightedCards', 'drawCardFromDiscard(this, false)');
                    }
                }
                else{
                    document.getElementById('topMsg').innerHTML = "Discard is empty";
                    document.getElementById('topMsg2').innerHTML = "Press Esc to continue";
                    releaseTurnLockOnEsc = true;
                }
            } else {
                if(cardIds.length === 1) removeCardFromDiscard(cardIds[0], "opDiscPile");
            }
            break;
        case "MOLeader2": // Double combat lane strength
            useOpponentLeaderAbility ? leaderHorn('opCombatLane') : leaderHorn('combatLane');
            break;
        case "MOLeader3": // Pick any weather card from deck and play it instantly
            if(!useOpponentLeaderAbility)
            {
                playWeatherCardFromDeck();
            } else {
                if(cardIds.length === 1) {
                    opponentDeck.splice(opponentDeck.indexOf(cardIds[0]),1)
                    playLeaderWeather(cardIds[0]);
                }
            }

            break;
        case "MOLeader4": // Discard 2 cards and draw 1 card from deck
            if(!useOpponentLeaderAbility)
            {
                discard2Draw1();
            } else {
                if(cardIds.length === 3){
                    opponentDeck.splice(opponentDeck.indexOf(cardIds[2]),1);
                    discardPiles["opDiscPile"].push(cardIds[0]);                    
                    discardPiles["opDiscPile"].push(cardIds[1]);         
                    discNotEmpty(discardPiles["opDiscPile"],"opDisc");
                    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';           
                }
            }
            break;
    }

    if(!useOpponentLeaderAbility && !switchTurnLock){
        document.getElementById('stats').innerHTML = `${hand.length} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`; 
        socket.emit('switchTurn', SID, [], [], hand.length, true);
    }
}

socket.on('opponentHandRequested', (opPlayer) => {
    if(player === opPlayer){
        let cardsToReveal = [];
        for(let i=0; i<hand.length; i++){
            cardsToReveal.push(hand[i]);
            if(i === 2) break;
        }
        socket.emit('opponentHandRevealed', SID, opPlayer, cardsToReveal);
    }
})

socket.on('revealOpHandToPlayer', (playerId, cardsToReveal) => {
    if(player === playerId){
        if(cardsToReveal.length > 0){
            document.getElementById('topMsg').innerHTML = "Press Esc to continue";
            for (let i=0; i<cardsToReveal.length; i++){
                createCard(cardsToReveal[i], 'highlightedCards', '');
            }
        }
        else{
            document.getElementById('topMsg').innerHTML = "Opponent's hand is empty";
            document.getElementById('topMsg2').innerHTML = "Press Esc to continue";
        }
    }
});

async function scorch(targetRows = []){
    // Get current power modifiers
    resetPowerLevels();
    getPowerModifiers();
    
    let topRowVals = {}; // Dictionary of strongest cards per row
    let strongestCards = {}; // Dictionary of rows/ strongest cards
    let moraleRowCount = {}; // Dictionary of morale boosters in each row
    let scorchedCards = [];

    targetRows.forEach((row) => {
        let cardsInRow = $('.'+row).find('.cardSmall').length;
        topRowVals[row] = 0;
        moraleRowCount[row] = 0;
        moraleBoosters.forEach((moraleCard) => {
            if (moraleMods[row][moraleCard] !== undefined){
                moraleRowCount[row] = moraleMods[row][moraleCard];
            }
        });
        
        let hornInRow = $('.'+row.slice(0,-4).concat("Horn")).find('.cardSmall')[0];
        for(let i=0; i<cardsInRow; i++){
            let cardId = $('.'+row).find('.cardSmall')[i].id;
            let basePower = getBasePower(cardId, row);
            if(!heroes.includes(cardId)){
                let cardPow = basePower * (tightBondMods[row][cardId] ?? 1 ) + moraleRowCount[row];
                if(hornInRow !== undefined || dandelion === cardId) cardPow *= 2;
                if(hornInRow === undefined && doubledRows.includes(row)) cardPow -= basePower; 
                if(moraleBoosters.includes(cardId)) cardPow -= 1;
                
                if(cardPow>=topRowVals[row]){
                    topRowVals[row] = cardPow;
                    strongestCards[row] === undefined ? strongestCards[row] = [cardId] : strongestCards[row].push(cardId);
                }                
            }
        }
    });
    let maxVal = Object.keys(topRowVals).map(function(key){
        return topRowVals[key];
    });
    maxVal = Math.max(...maxVal);
    targetRows.forEach((row) => { 
        let cardIdsInRow = $('.'+row).find('.cardSmall').map(function() {return this.id})
        let uniqueCardIdList = [];  
        for(let ID of cardIdsInRow){
            if(uniqueCardIdList.indexOf(ID)===-1){
                uniqueCardIdList.push(ID)
            }
        }
        
        let cardsInRow = uniqueCardIdList.length;
        let hornInRow = $('.'+row.slice(0,-4).concat("Horn")).find('.cardSmall')[0];
        for(let i=0; i<cardsInRow; i++){
            let cardId = uniqueCardIdList[i];
            let basePower = getBasePower(cardId, row);
            if(strongestCards[row] !== undefined){
                if(!strongestCards[row].includes(cardId)){
                    continue;
                }
                else{
                    strongestCards[row].forEach(async (sCard) => {
                        let cardPow = basePower * (tightBondMods[row][sCard] ?? 1) + moraleRowCount[row]; 
                        if(hornInRow !== undefined || dandelion === sCard) cardPow *= 2;
                        if(hornInRow === undefined && doubledRows.includes(row)) cardPow -= basePower;
                        if(moraleBoosters.includes(sCard)) cardPow -= 1;

                        if (cardPow === maxVal && sCard === cardId){
                            if(cardId === dandelion) doubledRows.splice(doubledRows.indexOf(row),1); 
                            scorchedCards.push([row,cardId]);
                            opRows.includes(row) ? discardPiles["opDiscPile"].push(cardId) : discardPiles["pDiscPile"].push(cardId);
                        }
                    })
                }
            }
        }
    });
    
    if(discardPiles["opDiscPile"].length!==0){discNotEmpty(discardPiles["opDiscPile"],"oDisc")}
    document.getElementById('oDiscSize').innerHTML = discardPiles["opDiscPile"].length > 0 ? discardPiles["opDiscPile"].length : '';
    if(discardPiles["pDiscPile"].length!==0){discNotEmpty(discardPiles["pDiscPile"],"pDisc")}
    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';


    animateThenUpdatePowerValues(scorchedCards);
}

const animateThenUpdatePowerValues = async (scorchedCards) => {
    await Promise.all(scorchedCards.map(async (rowAndCard) => {
      await animateScorch($('.' + rowAndCard[0]).find('#' + rowAndCard[1])[0]);
      $('.' + rowAndCard[0]).find('#' + rowAndCard[1]).remove();
    }));
  
    updatePowerValues();
};

const animateScorch = async (scorchedCard) => {
        scorchedCard.style.backgroundImage = "url(img/anim_scorch.png)";
        scorchedCard.style.backgroundSize = "cover";

		fadeIn(scorchedCard, 300);
        await sleep(1300);
		fadeOut(scorchedCard, 300);
        await sleep(300);
		scorchedCard.style.backgroundSize = ""; 
        scorchedCard.style.backgroundImage = "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fade(fadeIn, elem, dur){
    await sleep(100);
	let op = fadeIn ?  0.1 : 1;
	elem.style.opacity = op;
	elem.style.filter = "alpha(opacity=" + (op * 100) + ")";
	if (fadeIn)
		elem.classList.remove("hide");
	let timer = setInterval( async function() {
		op += op * (fadeIn ? 0.1 : -0.1);
		if (op >= 1) {
			clearInterval(timer);
			return;
		} else if (op <= 0.1) {
			elem.classList.add("hide");
			elem.style.opacity = "";
			elem.style.filter = "";
			clearInterval(timer);
			return;
		}
		elem.style.opacity = op;
		elem.style.filter = "alpha(opacity=" + (op * 100) + ")";
	}, dur/24);
}

async function fadeOut(elem, duration) {
	await fade(false, elem, duration);
}

async function fadeIn(elem, duration){
	await fade(true, elem, duration);
}

function displayTurnMessage() {
    document.getElementById('topMsg').innerHTML = myTurn ? "Your Turn" : "Opponent's Turn";
}

// Switches turn after player has passed
socket.on('passedTurn', () => {
    if(!passedTurn){
        document.getElementById('oPass').innerHTML = "<p>Passed</p>";
    }
    switchTurn();
});

function removeCardFromDiscard(cardId, pile) {
    let discardId = pile === "pDiscPile" ? "pDisc" : "oDisc";
    let discSize = discardId + "Size"; 

    let index = discardPiles[pile].indexOf(cardId);
    if(index > -1){
        discardPiles[pile].splice(index,1);
        document.getElementById(discSize).innerHTML = discardPiles[pile].length > 0 ? discardPiles[pile].length : '';
        if(discardPiles[pile].length !== 0) setCardStyle(discardId, discardPiles[pile][0]);
        discardPiles[pile].length === 0 ? discEmpty(discardId) : discNotEmpty(discardPiles[pile], discardId);
    }
}

socket.on('nextTurn', (cardIds, posIds, opHandSize, abilityUsed) => {         
    syncWithOpponent(cardIds, posIds, opHandSize, abilityUsed)
    switchTurn();
});

socket.on('returnTurn', (cardIds, posIds, opHandSize, abilityUsed) => { 
    displayTurnMessage();
    syncWithOpponent(cardIds, posIds, opHandSize, abilityUsed)
});

async function syncWithOpponent(cardIds, posIds, opHandSize, abilityUsed) {
    if (!myTurn){
        if(abilityUsed) {
            useLeaderAbility(true, cardIds);
            cardIds = [];
        } 

        if (cardIds[0] === dandelion){
            doubledRows.push(posIds[0]);
        }

        if (cardIds[0] === decoy){
            selectedCard = cardIds[0];
            putCardOnBoard(posIds[0]);
            cardsInRow = $('.'+posIds[0]).find('.cardSmall').length;
            for(let i=0; i<cardsInRow; i++){
                if($('.'+posIds[0]).find('.cardSmall')[i].id == cardIds[1]){
                    $('.'+posIds[0]).find('.cardSmall')[i].remove()
                    break;
                }
            }
        }
        if (Object.keys(musterCategories).includes(getMusterCategory(cardIds[0]))){
            cardIds.forEach((cardId) => {if(opponentDeck.includes(cardId)) opponentDeck.splice(opponentDeck.indexOf(cardId),1)});
        }
        
        if (cardIds[0] === villentretenmerth){
            if(powerLevels["combatPower"] >= 10) await scorch(["combatLane"]);
        }

        // Conditionals before ELSE to prevent/ control card being played
        if (cardIds[0] === scorchId){
            await scorch(rowIds);
        }
        else if(weatherCards.includes(cardIds[0])) {
            if(!weatherEffects.includes(cardIds[0])){
                selectedCard = cardIds[0];
                weatherEffects.push(selectedCard);
                putCardOnBoard(selectedCard);
            }
        }
        else if (cardIds[0] === clearWeather){
            resetWeather();
        }
        else{
            for (let i=0; i<cardIds.length; i++){
                if (combatSpies.concat(siegeSpies).includes(cardIds[i])){
                    opponentDeck.splice(0,2);
                }
                selectedCard = cardIds[i];
                putCardOnBoard(posIds[i]);
                if (i>0){
                    removeCardFromDiscard(cardIds[i], "opDiscPile");
                }
            }    
        }
        opponentHandSize = opHandSize;
        document.getElementById('opponentStats').innerHTML = `${opHandSize} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;  
    }
    updatePowerValues();  
    document.getElementById('pDeckSize').innerHTML = deck.length;
    document.getElementById('oDeckSize').innerHTML = opponentDeck.length;
    
    discardPiles["pDiscPile"].length === 0 ? discEmpty("pDisc") : discNotEmpty(discardPiles["pDiscPile"],"pDisc");
    discardPiles["opDiscPile"].length === 0 ? discEmpty("oDisc") : discNotEmpty(discardPiles["opDiscPile"],"oDisc");
    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';
    document.getElementById('oDiscSize').innerHTML = discardPiles["opDiscPile"].length > 0 ? discardPiles["opDiscPile"].length : '';
}
     
// Decide who round winner is based on total values and run any faction rules
let pLife = 2;
let oLife = 2;
socket.on('endRound', () => { 
    updateLife();
    resetWeather();
    doubledRows = [];

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
    gameEnded = true;
    document.getElementById('topMsg2').innerHTML = "Press F5 to play again";
    
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

function roundWon() {
    if(factionId==="NR") drawCardFromDeck("selectCard(this)");
    document.getElementById('stats').innerHTML = `${hand.length} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`; 

    document.getElementById('oHeart'+String(oLife)).style.color = "grey";
    oLife -= 1;
    playersTurn(); // Player gets next turn if they win
}

function roundTie() {
    if(factionId === "NG" && opFactionId !== "NG"){
        roundWon();
    } 
    else if(factionId !== "NG" && opFactionId === "NG"){
        roundLost();
    }
    else{
        document.getElementById('heart'+String(pLife)).style.color = "grey";
        document.getElementById('oHeart'+String(oLife)).style.color = "grey";
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
}

function roundLost() {
    if(opFactionId === "NR") {
        opponentHandSize += 1;
        document.getElementById('opponentStats').innerHTML = `${opponentHandSize} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;  
    }
        
    document.getElementById('heart'+String(pLife)).style.color = "grey";
    pLife -= 1;
    opponentsTurn(); // Opponent gets next turn if player loses round
}

// Adjust lives for players and decide next turn
function updateLife() {
    if(powerLevels["totalPower"] > powerLevels["opTotalPower"]) {
        roundWon();
    }
    else if(powerLevels["totalPower"] === powerLevels["opTotalPower"]) {
        roundTie();
    }
    else {
        roundLost();
    }
    
    if(pLife === 0 || oLife === 0){
        socket.emit('endGame', SID, player);
    }
}

function resetWeather(){
    weatherEffects = [];
    $('.weatherStats').find('.cardSmall').remove();
}

function showDiscard(pileID) {
    if (gameEnded || switchTurnLock) return;

    document.getElementById('highlightedCards').innerHTML = '';
    document.getElementById('topMsg').innerHTML = "Press Esc to close";
    
    let discPile = pileID == "oDisc" ? discardPiles["opDiscPile"] : discardPiles["pDiscPile"];
    
    for (let i=0; i<discPile.length; i++){
        createCard(discPile[i], 'highlightedCards', '');
    }
}

function discEmpty(pileId) {
    document.getElementById(pileId).style = "display: none;";
    document.getElementById(pileId).removeAttribute("onclick");
}

function discNotEmpty(discPile,pileId) {
    setCardStyle(pileId, discPile[0]);
    document.getElementById(pileId).setAttribute("onclick","showDiscard(this.id)");
}

// Retain a random unit card for new round
function monstersFactionPerk() {
    let validCards = {};
    pRows.forEach((row) => {
        let len = $("."+row).find('.cardSmall')["length"];
        if(len>0){
            for (let i=0; i<len; i++){
                let cardId = $("."+row).find('.cardSmall')[i]['id'];
                if(!heroes.includes(cardId)){
                    if (validCards[row] === undefined) validCards[row] = [];
                    validCards[row].push(cardId);
                }
            }
        }
    })

    if(Object.keys(validCards).length !== 0){
        const validRows = Object.keys(validCards);
        const randomRowIndex = Math.floor(Math.random() * validRows.length);
        const randomRow = validCards[validRows[randomRowIndex]];
        const randomCardIndex = Math.floor(Math.random() * randomRow.length);
        
        $("."+validRows[randomRowIndex]).find('#'+randomRow[randomCardIndex]).addClass("cardTemp").removeClass("cardSmall");
        socket.emit('sendMonsterCard', SID, player, randomRow[randomCardIndex], validRows[randomRowIndex]);
    }
}

socket.on('syncMonsterCard', (opPlayer, cardId, posId) => { 
    if(player === opPlayer){
        selectedCard = cardId;
        putCardOnBoard(posId);
        removeCardFromDiscard(cardId, "opDiscPile");
    }

    updatePowerValues();
});

let discardPiles = {"opDiscPile":[], "pDiscPile":[]};
function clearCards() {
    if(factionId === "MO" && pLife !== 0 && oLife !== 0)  monstersFactionPerk();

    // Move cards into corresponding discard pile
    rowIds.forEach((row) => {
        let len = $("."+row).find('.cardSmall')["length"];
        for (let i=0; i<len; i++){
            opRows.includes(row) 
            ? discardPiles["opDiscPile"].push($("."+row).find('.cardSmall')[i]['id']) 
            : discardPiles["pDiscPile"].push($("."+row).find('.cardSmall')[i]['id']); 
        }
    });
    
    discardPiles["pDiscPile"].length === 0 ? discEmpty("pDisc") : discNotEmpty(discardPiles["pDiscPile"],"pDisc");
    discardPiles["opDiscPile"].length === 0 ? discEmpty("oDisc") : discNotEmpty(discardPiles["opDiscPile"],"oDisc");
    
    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';
    document.getElementById('oDiscSize').innerHTML = discardPiles["opDiscPile"].length > 0 ? discardPiles["opDiscPile"].length : '';
    
    // Remove Cards from Board
    $('.cardSmall').remove();

    // Re-add monster card
    $('.cardTemp').addClass("cardSmall").removeClass("cardTemp");
}

function playersTurn() {
    myTurn = true;
    cardElements = document.getElementsByClassName('card');
    displayTurnMessage();
    for (let i=0; i<hand.length; i++) {
        cardElements[i].setAttribute("onclick", "selectCard(this)");
    }
}

function opponentsTurn() {
    myTurn = false;
    cardElements = document.getElementsByClassName('card');
    displayTurnMessage();
    for (let i=0; i<hand.length; i++) {
        cardElements[i].removeAttribute("onclick");
    }
}

function switchTurn() {
    if (myTurn) {
        opponentsTurn();
    }
    else {
        playersTurn();
    }
}

function putCardOnBoard(boardPosId) {
    const posId = weatherCards.includes(selectedCard) ? "weatherStats" : boardPosId;
    if(!weatherEffects.includes(selectedCard)) createCard(selectedCard, posId, '', 'cardSmall');
}

// Counts nonhero cards in each row for moralebooster
let boostableCards;
function getPowerModifiers() {
    
    // Reset modifier placeholders
    tightBondMods = moraleMods = $.extend(true,{},modBase);
    boostableCards = [0,0,0,0,0,0];
    
    // Iterate through each of the player's rows
    let cardID;
    let cardsInRow;
    let rowIndex = 0;
    rowIds.forEach((row) =>{
        cardsInRow = $('.'+row).find('.cardSmall').length;
        for(let i=0; i<cardsInRow; i++){
            cardID = $('.'+row).find('.cardSmall')[i].id;
            if(tightBonds.includes(cardID)){
                tightBondMods[row][cardID] ??= 0;
                tightBondMods[row][cardID] += 1;
            }
            if (moraleBoosters.includes(cardID)){
                moraleMods[row][cardID] ??= 0;
                moraleMods[row][cardID] += 1;
                if(!heroes.includes(cardID)) boostableCards[rowIndex] -= 1;
            }
            if(!heroes.includes(cardID) && cardID !== decoy){
                boostableCards[rowIndex] += 1;
            }
        }
        rowIndex += 1;
    });
}

let powerLevels = {};
const resetPowerLevels = (() => {
    powerIds.forEach((id) => {
        powerLevels[id] = 0;
    })
})
async function updatePowerValues() {  
    // Reset powerLevels with each update
    resetPowerLevels();
    
    // Update power modifiers
    getPowerModifiers();

    // Calculate power values for each row
    let rowIndex = 0;
    rowIds.forEach((row) =>{
        let rowPowerValueId = row.substring(0,row.length-4)+"Power";
        let cardsInRow = $('.'+row).find('.cardSmall').length;
        let hornInRow = $('.'+row.slice(0,-4).concat("Horn")).find('.cardSmall')[0];
        for(let i=0; i<cardsInRow; i++){
            let cardId = $('.'+row).find('.cardSmall')[i].id;
            let basePower = getBasePower(cardId, row);
            if(!heroes.includes(cardId) && (hornInRow !== undefined || doubledRows.includes(row))){
                powerLevels[rowPowerValueId] += basePower * (tightBondMods[row][cardId] ?? 1);

                if(moraleBoosters.includes(cardId)) powerLevels[rowPowerValueId] += boostableCards[rowIndex];
                if(dandelion === cardId && hornInRow === undefined) powerLevels[rowPowerValueId] -= basePower;
            }
            
            if(moraleBoosters.includes(cardId)){ 
                powerLevels[rowPowerValueId] += boostableCards[rowIndex];
            }

            powerLevels[rowPowerValueId] += basePower * (tightBondMods[row][cardId] ?? 1);    
        }
        
        document.getElementById(rowPowerValueId).innerHTML = powerLevels[rowPowerValueId]; 
        rowIndex += 1;
    });
    
    powerLevels["totalPower"] = powerLevels["combatPower"] + powerLevels["rangedPower"] + powerLevels["siegePower"];
    powerLevels["opTotalPower"] = powerLevels["opCombatPower"] + powerLevels["opRangedPower"] + powerLevels["opSiegePower"];
    
    document.getElementById("opTotalPower").innerHTML = powerLevels["opTotalPower"];
    document.getElementById("totalPower").innerHTML = powerLevels["totalPower"];
}

let weatherEffects = [];
function getBasePower(cardId, row){
    if (row.toUpperCase().includes('COMBATLANE') && weatherEffects.includes(bitingFrost) && !heroes.includes(cardId)) return 1;
    else if (row.toUpperCase().includes('RANGEDLANE') && weatherEffects.includes(impenetrableFog) && !heroes.includes(cardId)) return 1;
    else if (row.toUpperCase().includes('SIEGELANE') && weatherEffects.includes(torrentialRain) && !heroes.includes(cardId)) return 1;
    else return cardPowers[cardId];
}

const getLeaderInstructionText = () => 
    (leaderId === "STLeader3" || leaderId === "NGLeader1" || leaderAbilityUsed) 
    ? "" 
    : leaderInstruction;

let [handHiddenFlag,cardSelectedFlag,switchTurnLock,releaseTurnLockOnEsc,passedTurn,leaderAbilityUsed,gameEnded] = Array(6).fill(false);
function keyPressed(event) {
    if(!gameEnded){
        // Enter 
        if (event.keyCode === 13 && !handChosen){
            handSelected();
        }
        
        // E 
        if (event.keyCode === 69 && handChosen && !cardSelectedFlag && !switchTurnLock){
            if (handHiddenFlag){
                document.getElementById('hand').style = "display: fixed; bottom: 1%;";
                document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
                document.getElementById('instructions').innerHTML = instructionTextHide;
                handHiddenFlag = false;
            }
            else{
                document.getElementById('hand').style = "display: none;";           
                document.getElementById('instructions').innerHTML = instructionTextShow;
                handHiddenFlag = true;
            }
        }
        
        // Esc - Card selected and sequence not in place
        if (event.keyCode === 27 && cardSelectedFlag && (!switchTurnLock || releaseTurnLockOnEsc)){
            cardSelectedFlag = false;
            cancelCardSelection();
            
            // Recreate card in hand
            createCard(selectedCard, 'hand', 'selectCard(this)');
            
            // Remove any borders around cards (used for decoy card)
            pRows.forEach((row) => {
                // Number of cards in each row
                let len = $("."+row).find('.cardSmall')["length"];
                for (let i=0; i<len; i++) {
                    $("."+row).find('.cardSmall')[i].style.border = '';
                }
            });
        }
        
        // Esc - A sequence isn't in place
        if (event.keyCode === 27 && (!switchTurnLock || releaseTurnLockOnEsc)){
            switchTurnLock = false;
            handHiddenFlag = false;
            displayTurnMessage();
            document.getElementById('topMsg2').innerHTML = '';
            document.getElementById('highlightedCards').innerHTML = '';
            document.getElementById('hand').style = "display: fixed; bottom: 1%;";
            document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
            document.getElementById('instructions').innerHTML = instructionTextHide;
            document.getElementById('cardDetailView').style  = "display: none;";
            if(releaseTurnLockOnEsc){
                releaseTurnLockOnEsc = false;
                socket.emit('switchTurn', SID, [], [], hand.length, true);
            }
        }

        // X  
        if(event.keyCode===88 && myTurn && !cardSelectedFlag && !leaderAbilityUsed && !switchTurnLock){
            if(opLeaderId === "NGLeader1") document.getElementById('topMsg').innerHTML = "The opponent leader ability disables this action";
            
            if(leaderId !== "NGLeader1" && leaderId !== "STLeader3" && opLeaderId !== "NGLeader1"){
                useLeaderAbility();
                leaderAbilityUsed = true;
                document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
            }
        }
        
        // Space  
        if (event.keyCode===32 && myTurn && !switchTurnLock && !cardSelectedFlag){
            document.getElementById('pPass').innerHTML = "<p>Passed</p>";
            passedTurn = true;
            socket.emit('passTurn', SID);
        }
    }
}

function cancelCardSelection() {
        document.getElementById('cardSelected').style.display = "none";
        
        boardPosIds.forEach((id) =>{
            document.getElementById(id).style.background = "none";    
            document.getElementById(id).removeAttribute("onclick");
        });
    
        // Remove any borders around cards (used for decoy card)
        pRows.forEach((row) => {
            let len = $("."+row).find('.cardSmall')["length"];
            for (let i=0; i<len; i++) {
                $("."+row).find('.cardSmall')[i].style.border = '';
            }
        });
    
        document.getElementById('hand').style = "display: fixed; bottom: 1%;";
        document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
        document.getElementById('instructions').innerHTML = instructionTextHide;
}