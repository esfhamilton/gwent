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

let faction;
let leader;
let deck;
let hand = [];
let index;
socket.on('playerAssigned', (FID, leaderID, cards) => {
    faction = FID;
    leader = leaderID;
    deck = cards;
});

socket.on('startGame', () => {
    document.getElementById('topMsg').innerHTML = "Starting game...";
    socket.emit('getOpponentDeck', SID, player);
});

let opponentFaction;
let opponentLeader;
let opponentDeck = [];
socket.on('opponentDeck', (opponentFID, opponentLID, opDeck) => {
    if(opponentDeck.length === 0){
        opponentFaction = opponentFID;
        opponentLeader = opponentLID;
        opponentDeck = opDeck;
        setup();
    }
    else{
        opponentDeck = opDeck;
    }
});

// Sets up mulligan phase after both players have created their decks
function setup() {
    document.addEventListener("keydown",keyPressed);
    document.getElementById('topMsg').innerHTML = "Choose a card to redraw. 0/2";
    document.getElementById('topMsg2').style = "display: fixed;";
    document.getElementById('pStats').style = "display: fixed;";
    document.getElementById('oStats').style = "display: fixed;";
    document.getElementById('pDeckSize').innerHTML = deck.length-10;
    document.getElementById('oDeckSize').innerHTML = opponentDeck.length-10;
    
    powerIDs.forEach((id) => {
        document.getElementById(id).innerHTML = 0;
    });
    
    document.getElementById('stats').innerHTML = `${initDraw} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    document.getElementById('opponentStats').innerHTML = `${initDraw} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;
    
    for (let i=0; i<initDraw; i++){
        drawCard('replaceCard(this)');
    }
    document.getElementById('pLeader').style = styles[leader];
    document.getElementById('pDeck').style = styles[faction];
    
    
    // This will require opponent's faction to change styles appropriately
    document.getElementById('oLeader').style = styles[opponentLeader];
    document.getElementById('oDeck').style = styles[opponentFaction]; 
}

function createCard(cardId, positionId, attribute, className = "card"){
    let card = document.createElement('div');
    card.style = styles[cardId];
    card.className = className;
    card.setAttribute('id', cardId);
    card.setAttribute('onclick', attribute);
    document.getElementById(positionId).appendChild(card);
}

function drawCard(attribute) {
    if(deck.length !== 0){
        createCard(deck[0], 'hand', attribute);
        hand.push(deck[0]);
        deck.shift();
    }
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
let cardElements;
// Second setup for after player has confirmed their starting hand
function handSelected() {
    handChosen = true;
    document.getElementById('topMsg2').style = "display: none;";
    document.getElementById('hand').style = "bottom: 0%;";
    document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
    document.getElementById('instructions').innerHTML = instructionTextHide;
    
    // Remove onclick functionality until opponent has reselected their cards
    cardElements = document.getElementsByClassName('card');
    for (let i=0; i<hand.length; i++) {
        cardElements[i].removeAttribute("onclick");
    }
    socket.emit('cardsRedrawn', SID, player, deck);
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
    cardToHand.style = styles[card.id];
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

const activateValidPositions = ((id) => {
    document.getElementById(id).style = "background: rgba(255, 233, 0, 0.15);";
    document.getElementById(id).setAttribute('onclick','placeCard(this)');
})

const pRows = rowIDs.slice(0,3);
const opRows = rowIDs.slice(3);
let selectedCard;
function selectCard(card) {
    cardSelectedFlag = true;
    selectedCard = card.id;
    document.getElementById('cardSelected').style = styles[selectedCard];
    document.getElementById('hand').style = "display: none;"; 
    document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
    document.getElementById('instructions').innerHTML = `<button style="font-size: 80%;">Esc</button>&nbsp;&nbsp;Cancel`;
    
    if(medicFlag){
        document.getElementById('discCards').innerHTML = "";
        document.getElementById('leaderInstructions').innerHTML = "";
        document.getElementById('instructions').innerHTML = "";
    }
    else{
        // Remove card div from hand (this can be recreated if esc pressed)
        card.parentNode.removeChild(card);
    }
    
    // Resets available lanes (might be redundant due to this being in (cancelCardSelection()))
    let positions = document.querySelectorAll("combatLane, rangedLane, siegeLane, opCombatLane, opRangedLane, opSiegeLane");
    for (let i=0; i<positions.length; i++) {
        positions[i].removeAttribute("onclick");
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
        hornIDs.slice(0,3).forEach((id) => {
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
        rowIDs.forEach((id) => {
            activateValidPositions(id);
        });
    }
}

let medicFlag = false;
let revivedFlag = false;
let medicCards = []; // Placeholder for card IDs if medic is used
let medicPosIDs = []; // Placeholder for pos IDs if medic is used
let doubledRows = []; // Positions with horns placed

function placeCard(boardPos) {
    const boardPosID = boardPos.id;
    cardSelectedFlag = false;
    cancelCardSelection();
    
    // Both medic and revived card have been placed
    if (medicFlag){
        medicCards.push(selectedCard);
        medicPosIDs.push(boardPosID);    
        medicFlag = false;
        revivedFlag = true;
        document.getElementById('hand').style = "display: fixed; bottom: 0%;";  
        document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
        document.getElementById('instructions').innerHTML = instructionTextHide;
        document.getElementById('pDisc').setAttribute("onclick", "showDiscard(this.id)");
        document.getElementById('oDisc').setAttribute("onclick", "showDiscard(this.id)");
        
        // Remove card from discard pile
        index = discardPiles["pDiscPile"].indexOf(selectedCard);  
        if (index > -1) {
            discardPiles["pDiscPile"].splice(index, 1);
        }   
    }

    if(weatherCards.includes(selectedCard)){
        if(!weatherEffects.includes(selectedCard)){
            weatherEffects.push(selectedCard);
            putCardOnBoard(boardPosID);
        }
        cardsPlaced([selectedCard], [boardPosID]);
        return;
    }

    if (selectedCard === clearWeather){
        resetWeather();
        cardsPlaced([selectedCard], [boardPosID]);
        return;
    }

    // Displays card in corresponding location
    if(selectedCard !== scorchId){
        putCardOnBoard(boardPosID);    
    }
    
    // Updates power values on the board
    updatePowerValues();
            
    // Spy - Draw 2 cards from Deck
    if (combatSpies.concat(siegeSpies).includes(selectedCard)){
        for (let i=0;i<2;i++){
            if (deck.length != 0) {
                drawCard();
            }
        }
    }
    
    else if(selectedCard === scorchId){
        scorch(targetRows=rowIDs);
    }
    
    else if(selectedCard === villentretenmerth){
        updatePowerValues();
        if(powerLevels["opCombatPower"] >= 10) scorch(targetRows=["opCombatLane"]);
    }
    
    else if(horns.includes(selectedCard)){
        doubledRows.push(boardPosID);
    }
    
    // Medic - Choose a non-hero card from discard to play 
    else if(medics.includes(selectedCard)){
        let discPile = discardPiles["pDiscPile"];
        
        // Check if there are non-hero cards in the discard pile
        for (let i=0; i<discPile.length; i++){
            if(!heroes.includes(discPile[i])) medicFlag = true;           
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
            document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
            document.getElementById('instructions').innerHTML = "";
            
            // Prevent discards being opened while reviving
            document.getElementById('pDisc').removeAttribute("onclick");
            document.getElementById('oDisc').removeAttribute("onclick");
            
            // Show revivable unit cards
            document.getElementById('discCards').innerHTML = "";
            document.getElementById('topMsg').innerHTML = "Choose a card to revive";
            for (let i=0; i<discPile.length; i++){
                if(!heroes.includes(discPile[i])){
                    createCard(discPile[i], 'discCards', 'selectCard(this)');
                }
            }
        }
    }
    
    // Prevents turn switch if medic has been played and player needs to revive a card
    if (!medicFlag && !revivedFlag){
        cardsPlaced([selectedCard], [boardPosID]);
    }
    
    // If a medic has been played, emit multiple cards played to the server
    else if (revivedFlag){
        cardsPlaced(medicCards, medicPosIDs);

        medicCards = [];
        medicPosIDs = [];
        revivedFlag = false;
    }
}

function cardsPlaced(cards, positions){
    index = hand.indexOf(selectedCard);  
    if (index > -1) hand.splice(index, 1); // Remove card from hand - If not in discard
    
    const cardsInHand = document.getElementById("hand").childElementCount;
    document.getElementById('stats').innerHTML = `${cardsInHand} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;    
    socket.emit('switchTurn', SID, cards, positions, cardsInHand, false);
}

function useLeaderAbility(useOpponentLeaderAbility=false){
    leaderFaction = useOpponentLeaderAbility ? opponentFaction : faction;
    leaderUsed = useOpponentLeaderAbility ? opponentLeader : leader;
    if(leaderFaction === "NR"){
        switch(leaderUsed){
            case "NRLeader1": // Doubles siege lane strength 
            useOpponentLeaderAbility ? doubledRows.push('opSiegeLane') : doubledRows.push('siegeLane');
                break;
            case "NRLeader2": // Plays impenetrable fog from deck
                if(useOpponentLeaderAbility && opponentDeck.includes(impenetrableFog)){
                    opponentDeck.splice(opponentDeck.indexOf(impenetrableFog),1);
                    selectedCard = impenetrableFog;
                    weatherEffects.push(impenetrableFog);
                    putCardOnBoard("weatherStats")
                }
                else if(!useOpponentLeaderAbility && deck.includes(impenetrableFog)){
                    deck.splice(deck.indexOf(impenetrableFog),1);
                    selectedCard = impenetrableFog;
                    weatherEffects.push(impenetrableFog);
                    putCardOnBoard("weatherStats")
                }
                break;
            case "NRLeader3": // Clears weather effects
                resetWeather();
                break;
            case "NRLeader4": // Destroy enemies strongest siege unit(s) if opSiegePower >= 10
                if(useOpponentLeaderAbility){
                    if(powerLevels["siegePower"] >= 10) scorch(targetRows=["siegeLane"]);
                } 
                else {
                    if(powerLevels["opSiegePower"] >= 10) scorch(targetRows=["opSiegeLane"]);
                }
                break;
        }
    }
    if(!useOpponentLeaderAbility){
        const cardsInHand = document.getElementById("hand").childElementCount;
        document.getElementById('stats').innerHTML = `${cardsInHand} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`; 
        socket.emit('switchTurn', SID, [], [], cardsInHand, true);
    }
}

function scorch(targetRows = []){
    // Get current power modifiers
    resetPowerLevels();
    getPowerModifiers();
    
    let topRowVals = {}; // Dictionary of strongest cards per row
    let strongestCards = {}; // Dictionary of rows/ strongest cards
    let moraleRowCount = {}; // Dictionary of morale boosters in each row
    
    // Iterate through each of the player's rows
    let cardID;
    let cardsInRow;
    let hornInRow;
    targetRows.forEach((row) => {
        cardsInRow = $('.'+row).find('.cardSmall').length;
        topRowVals[row] = 0;
        moraleRowCount[row] = 0;
        moraleBoosters.forEach((moraleCard) => {
            if (moraleMods[row][moraleCard] !== undefined){
                moraleRowCount[row] = moraleMods[row][moraleCard];
            }
        });
        
        hornInRow = $('.'+row.slice(0,-4).concat("Horn")).find('.cardSmall')[0];
        for(let i=0; i<cardsInRow; i++){
            cardID = $('.'+row).find('.cardSmall')[i].id;
            basePower = getBasePower(cardID);
            if(!heroes.includes(cardID)){
                let cardPow = basePower * (tightBondMods[row][cardID] ?? 1 ) + moraleRowCount[row];
                if(hornInRow !== undefined || dandelion === cardID) cardPow *= 2;
                if(hornInRow === undefined && doubledRows.includes(row)) cardPow -= basePower; 
                if(moraleBoosters.includes(cardID)) cardPow -= 1;
                
                if(cardPow>=topRowVals[row]){
                    topRowVals[row] = cardPow;
                    strongestCards[row] === undefined ? strongestCards[row] = [cardID] : strongestCards[row].push(cardID);
                }                
            }
        }
    });
    let maxVal = Object.keys(topRowVals).map(function(key){
        return topRowVals[key];
    });
    maxVal = Math.max(...maxVal);
    targetRows.forEach((row) => { 
        
        cardIdsInRow = $('.'+row).find('.cardSmall').map(function() {return this.id})
        let uniqueCardIdList = [];  
        for(let ID of cardIdsInRow){
            if(uniqueCardIdList.indexOf(ID)===-1){
                uniqueCardIdList.push(ID)
            }
        }
        
        cardsInRow = uniqueCardIdList.length;
        hornInRow = $('.'+row.slice(0,-4).concat("Horn")).find('.cardSmall')[0];
        for(let i=0; i<cardsInRow; i++){
            cardID = uniqueCardIdList[i];
            basePower = getBasePower(cardID);
            if(strongestCards[row] !== undefined){
                if(!strongestCards[row].includes(cardID)){
                    continue;
                }
                else{
                    strongestCards[row].forEach((sCard) => {
                        let cardPow = basePower * (tightBondMods[row][sCard] ?? 1) + moraleRowCount[row]; 
                        if(hornInRow !== undefined || dandelion === sCard) cardPow *= 2;
                        if(hornInRow === undefined && doubledRows.includes(row)) cardPow -= basePower;
                        if(moraleBoosters.includes(sCard)) cardPow -= 1;

                        if (cardPow === maxVal && sCard === cardID){
                            if(cardID === dandelion) doubledRows.splice(doubledRows.indexOf(row),1); 
                            $('.'+row).find('#'+sCard).remove();
                            opRows.includes(row) ? discardPiles["opDiscPile"].push(cardID) : discardPiles["pDiscPile"].push(cardID);
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
    discardPiles["opDiscPile"].length === 0 ? discEmpty("oDisc") : discNotEmpty(discardPiles["opDiscPile"],"oDisc");
    document.getElementById('oDiscSize').innerHTML = discardPiles["opDiscPile"].length > 0 ? discardPiles["opDiscPile"].length : '';
}

socket.on('nextTurn', (cardArr, posArr, opHandSize, abilityUsed) => {         
    syncWithOpponent(cardArr, posArr, opHandSize, abilityUsed)
    switchTurn();
});

socket.on('returnTurn', (cardArr, posArr, opHandSize, abilityUsed) => { 
    syncWithOpponent(cardArr, posArr, opHandSize, abilityUsed)
});

function syncWithOpponent(cardArr, posArr, opHandSize, abilityUsed) {
    if (!myTurn){
        if(abilityUsed) useLeaderAbility(true);

        if (cardArr[0] === dandelion){
            doubledRows.push(posArr[0]);
        }

        if (cardArr[0] === decoy){
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
        else if (scorchId === cardArr[0]){
            scorch(targetRows=rowIDs);
        }
        else if (villentretenmerth === cardArr[0]){
            if(powerLevels["combatPower"] >= 10) scorch(targetRows=["combatLane"]);
            selectedCard = cardArr[0];
            putCardOnBoard(posArr[0]);
        }
        else if(weatherCards.includes(cardArr[0])) {
            if(!weatherEffects.includes(cardArr[0])){
                selectedCard = cardArr[0];
                weatherEffects.push(selectedCard);
                putCardOnBoard(selectedCard);
            }
        }
        else if (cardArr[0] === clearWeather){
            resetWeather();
        }
        else{
            for (let i=0; i<cardArr.length; i++){
                if (combatSpies.concat(siegeSpies).includes(cardArr[i])){
                    opponentDeck.splice(0,2);
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
    document.getElementById('pDeckSize').innerHTML = deck.length;
    document.getElementById('oDeckSize').innerHTML = opponentDeck.length;

    document.getElementById("pDisc").style = styles[discardPiles["pDiscPile"][0]];
    document.getElementById('pDiscSize').innerHTML = discardPiles["pDiscPile"].length > 0 ? discardPiles["pDiscPile"].length : '';
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

function factionRoundWon() {
    if(faction==="NR") drawCard();
}

// Adjust lives for players and decide next turn
function updateLife() {
    // Player has won
    if(powerLevels["totalPower"] > powerLevels["opTotalPower"]) {
        document.getElementById('oHeart'+String(oLife)).style = "color:grey;";
        oLife -= 1;
        factionRoundWon()
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

function resetWeather(){
    weatherEffects = [];
    $('.weatherStats').find('.cardSmall').remove();
}

// Show cards in the discard pile
function showDiscard(pileID) {
    discSelectedFlag = true;
    document.getElementById('discCards').innerHTML = "";
    document.getElementById('topMsg').innerHTML = "Press Esc to Cancel";
    
    let discPile = pileID == "oDisc" ? discardPiles["opDiscPile"] : discardPiles["pDiscPile"];
    
    for (let i=0; i<discPile.length; i++){
        createCard(discPile[i], 'discCards', '');
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


let discardPiles = {"opDiscPile":[], "pDiscPile":[]};
function clearCards() {
    // Move cards into corresponding discard pile
    rowIDs.forEach((row) => {
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
}

function playersTurn() {
    myTurn = true;
    cardElements = document.getElementsByClassName('card');
    switchWaitingMsg();
    for (let i=0; i<hand.length; i++) {
        cardElements[i].setAttribute("onclick", "selectCard(this)");
    }
}

function opponentsTurn() {
    myTurn = false;
    cardElements = document.getElementsByClassName('card');
    switchWaitingMsg();
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

function putCardOnBoard(boardPosID) {
    const posID = weatherCards.includes(selectedCard) ? "weatherStats" : boardPosID;
    createCard(selectedCard, posID, '', 'cardSmall');
}

// Counts nonhero cards in each row for moralebooster
let nonHeroes;
function getPowerModifiers() {
    
    // Reset modifier placeholders
    tightBondMods = moraleMods = $.extend(true,{},modBase);
    nonHeroes = [0,0,0,0,0,0];
    
    // Iterate through each of the player's rows
    let cardID;
    let cardsInRow;
    let rowIndex = 0;
    rowIDs.forEach((row) =>{
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
            }
            if(!heroes.includes(cardID) && cardID !== decoy){
                nonHeroes[rowIndex] += 1;
            }
        }
        rowIndex += 1;
    });
}

let powerLevels = {};
const resetPowerLevels = (() => {
    powerIDs.forEach((id) => {
        powerLevels[id] = 0;
    })
})
function updatePowerValues() {  
    // Reset powerLevels with each update
    resetPowerLevels();
    
    // Update power modifiers
    getPowerModifiers();

    // Calculate power values for each row
    let rowIndex = 0;
    rowIDs.forEach((row) =>{
        let powerStr = row.substring(0,row.length-4)+"Power";
        let cardsInRow = $('.'+row).find('.cardSmall').length;
        let hornInRow = $('.'+row.slice(0,-4).concat("Horn")).find('.cardSmall')[0];
        for(let i=0; i<cardsInRow; i++){
            let cardID = $('.'+row).find('.cardSmall')[i].id;
            let basePower = getBasePower(cardID);
            if(!heroes.includes(cardID) && (hornInRow !== undefined || doubledRows.includes(row))){
                powerLevels[powerStr] += basePower * (tightBondMods[row][cardID] ?? 1);

                if(moraleBoosters.includes(cardID)) powerLevels[powerStr] += (nonHeroes[rowIndex]-1);
                if(dandelion === cardID && hornInRow === undefined) powerLevels[powerStr] -= basePower;
            }
            
            if(moraleBoosters.includes(cardID)){ 
                powerLevels[powerStr] += (nonHeroes[rowIndex]-1);
            }

            powerLevels[powerStr] += basePower * (tightBondMods[row][cardID] ?? 1);    
        }
        
        // Display power value for each row
        document.getElementById(powerStr).innerHTML = powerLevels[powerStr];
        rowIndex += 1;
    });
    
    // Calculate total power values
    powerLevels["totalPower"] = powerLevels["combatPower"] + powerLevels["rangedPower"] + powerLevels["siegePower"];
    powerLevels["opTotalPower"] = powerLevels["opCombatPower"] + powerLevels["opRangedPower"] + powerLevels["opSiegePower"];
    
    // Display total power values
    document.getElementById("opTotalPower").innerHTML = powerLevels["opTotalPower"];
    document.getElementById("totalPower").innerHTML = powerLevels["totalPower"];
}

let weatherEffects = [];
function getBasePower(cardID){
    if (combatCards.concat(combatSpies).includes(cardID) && weatherEffects.includes(bitingFrost) && !heroes.includes(cardID)) return 1;
    else if (rangedCards.includes(cardID) && weatherEffects.includes(impenetrableFog) && !heroes.includes(cardID)) return 1;
    else if (siegeCards.concat(siegeSpies).includes(cardID) && weatherEffects.includes(torrentialRain) && !heroes.includes(cardID)) return 1;
    else return cardPowers[cardID];
}

function getLeaderInstructionText(){
    return leaderAbilityUsed ? "" : leaderInstruction;
}

let [handHiddenFlag,cardSelectedFlag,discSelectedFlag,passedTurn,leaderAbilityUsed,gameEnded] = Array(6).fill(false);
function keyPressed(event) {
    if(!gameEnded){
        // Enter pressed and hand hasn't been selected AND card is not being revived
        if (event.keyCode === 13 && !handChosen){
            handSelected();
        }
        
        // E pressed AND hand has been chosen AND card has not been selected AND card is not being revived
        if (event.keyCode === 69 && handChosen && !cardSelectedFlag && !medicFlag){
            if (handHiddenFlag){
                document.getElementById('hand').style = "display: fixed; bottom: 0%;";  
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
        
        // Esc pressed AND a card has been selected AND card is not being revived
        if (event.keyCode === 27 && cardSelectedFlag && !medicFlag){
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
        
        // Esc pressed AND discard is showing AND card is not being revived
        if (event.keyCode === 27 && discSelectedFlag && !medicFlag){
            discSelectedFlag = false;
            document.getElementById('topMsg').innerHTML = myTurn == false ? "Opponent's Turn" : "Your Turn";
            document.getElementById('discCards').innerHTML = "";
        }

        // X Pressed
        if(event.keyCode===88 && myTurn && !cardSelectedFlag && !medicFlag && !leaderAbilityUsed){
            useLeaderAbility();
            leaderAbilityUsed = true;
            document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
            const cardsInHand = document.getElementById("hand").childElementCount;
            document.getElementById('stats').innerHTML = `${cardsInHand} <span class="iconify" data-icon="ion:tablet-portrait" data-inline="false"></span>`;    
            socket.emit('switchTurn', [], [], cardsInHand, true);
        }
        
        // Space pressed AND player's turn AND card is not selected AND card is not being revived
        if (event.keyCode===32 && myTurn && !cardSelectedFlag && !medicFlag){
            document.getElementById('pPass').innerHTML = "<p>Passed</p>";
            passedTurn = true;
            socket.emit('passTurn', SID);
        }
    }
}

function cancelCardSelection() {
        // Remove card from placeholder at top
        document.getElementById('cardSelected').style = "display: none;";
        
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
        document.getElementById('leaderInstructions').innerHTML = getLeaderInstructionText();
        document.getElementById('instructions').innerHTML = instructionTextHide;
}