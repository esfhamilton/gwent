const express = require('express');
const app = express();
//const path = require('path');
const PORT = process.env.PORT || 5000; 

app.use(express.static('public'))

server = app.listen(PORT);

const io = require('socket.io')(server);

let openRooms = [];
let startCheck = {};
let gameData = {};
let redrawnCheck = {};
let roomPassCount = {};
let roomFirstTurn = {};

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

io.on('connection', (socket) => {
    socket.on('joinRequest', (SID) => {                
        var numClients = io.sockets.adapter.rooms[''+SID];
        if (numClients != undefined || openRooms.includes(SID)){
            if (numClients.length<2){
                // Authorise join request
                socket.join(SID);
                // Emits to both (all) users in SID 
                io.in(SID).emit('continue', SID);
            } 
            else {
                socket.emit('full', SID);
            }
        } 
        else {
            // numClients should not be undefined and openRoom should contain SID
            socket.emit('invalidRoom', SID);
        }            
    });
    
    socket.on('createRequest', () => {
        // Generates random 5 digit SID 
        let SID = Math.floor(Math.random() * 89999) + 10000; 
        // Ensures new SID generated is not already in openRooms
        if (openRooms.includes(SID)){
            let repeat = true;
            while(repeat){
                SID = Math.floor(Math.random() * 89999) + 10000;
                repeat = openRooms.includes(SID) ? true : false;
            }
        }
        // Join room and add corresponding SID to openRooms
        socket.join(SID);
        socket.emit('validRoom', SID);
        openRooms.push(SID);     
    });
    
    // Reconnects user to room with each new page
    socket.on('rejoinRequest', (SID) => {         
        var numClients = io.sockets.adapter.rooms[''+SID];
        // Room needs to be recreated
        if (!openRooms.includes(SID)){
            socket.join(SID);
            openRooms.push(SID);   
        }
        if (numClients != undefined){
            if (numClients.length<2){
                socket.join(SID);
            } 
            else {
                socket.emit('full', SID);
            }
        }       
    });
    
    // Gets player details from client and stores them on server
    socket.on('playerDeck', (SID, leader, deck, faction) => {
        let playerA = SID +'A';
        let playerB = SID +'B'; 

        // Check if first player has already been added
        if (playerA in gameData) {
            // Add data under player B
            gameData[playerB] = {"faction":faction,"leader":leader,"deck":deck,"hand":[],"discarded":[], "fullDeck": deck};
            // Inform client which identifier their data is stored under
            socket.emit('playerAssignment', 'B');
        }
        else {
            // Add data under player A
            gameData[playerA] = {"faction":faction,"leader":leader,"deck":deck,"hand":[],"discarded":[], "fullDeck": deck};
            // Inform client which identifier their data is stored under
            socket.emit('playerAssignment', 'A');
        }
    });
    
    // Returns corresponding deck to the player
    socket.on('getPlayerDeck', (SID, player) => {
        let PID = SID + player;
        // Catch if game has been entered without a deck
        if(gameData[PID] != undefined){
            startCheck[PID] = "Added";
            if (player === 'A') { 
                socket.emit('playerAssigned', gameData[PID]["faction"], gameData[PID]["leader"], shuffle(gameData[PID]["fullDeck"]));
            }
            else {
                socket.emit('playerAssigned', gameData[PID]["faction"], gameData[PID]["leader"], shuffle(gameData[PID]["fullDeck"])); 
            }
        } 
        else{
            socket.emit('noDeck');
        }
    });

    // Checks whether both players are on the game.html page
    socket.on('startCheck', (SID) => {
        if(SID in roomFirstTurn) delete roomFirstTurn[SID];
        if ((SID+'A') in startCheck && (SID+'B') in startCheck) {
            delete startCheck[SID+'A'];
            delete startCheck[SID+'B'];
            roomPassCount[SID] = 0;
            io.in(SID).emit('startGame');
        } 
    });
    
    socket.on('getOpponentDeck', (SID, player) => {
        if(!(SID in roomFirstTurn)) roomFirstTurn[SID] = Math.random()>0.5 ? 'A':'B';
        let OID;
        if (player === 'A') {
            OID = SID + 'B';
            socket.emit('opponentDeck', gameData[OID]["faction"], gameData[OID]["leader"], gameData[OID]["deck"]);
        }
        else {
            OID = SID + 'A';
            socket.emit('opponentDeck', gameData[OID]["faction"], gameData[OID]["leader"], gameData[OID]["deck"]); 
        }
    });
    
    // Checks if players have redrawn the starting hand
    socket.on('cardsRedrawn', (SID, player, deck, firstTurn) => {
        gameData[SID + player]["deck"] = deck;
        if(firstTurn) roomFirstTurn[SID] = firstTurn;
        if(SID in redrawnCheck) {
            // Prevents crash from page refresh, should be true
            if (redrawnCheck[SID] != player) {
                delete redrawnCheck[SID];
                io.in(SID).emit('firstTurn', roomFirstTurn[SID]);
            }       
        }
        else {
            redrawnCheck[SID] = player;
            socket.emit('waiting');
        }
    });

    socket.on('passTurn', (SID) => {
        roomPassCount[SID] += 1;
        if (roomPassCount[SID] === 2) {
            roomPassCount[SID] = 0;
            io.in(SID).emit('endRound');
        }
        else {
            io.in(SID).emit('passedTurn');
        }
    });

    socket.on('sendMonsterCard', (SID, player, cardId, posId) => {
        let opPlayer = player === "A" ? "B" : "A";
        io.in(SID).emit('syncMonsterCard', opPlayer, cardId, 'op'+posId.substring(0,1).toUpperCase()+posId.substring(1));
    });

    socket.on('drawFromOpDisc', (SID , player, cardId) => {
        let opPlayer = player === "A" ? "B" : "A";
        io.in(SID).emit('syncDrawFromOpDisc', opPlayer, cardId);
    })

    socket.on('getOpponentHand', (SID, player) => {
        let opPlayer = player === "A" ? "B" : "A";
        io.in(SID).emit('opponentHandRequested', opPlayer);
    });
    
    socket.on('opponentHandRevealed', (SID, opPlayer, cardsToReveal) => {
        let player = opPlayer === "A" ? "B" : "A";
        io.in(SID).emit('revealOpHandToPlayer', player, cardsToReveal);
    });
    
    // Switches turn and passes on player choice to opponent 
    socket.on('switchTurn', (SID, cardIDs, posIDs, cardsInHand, abilityUsed) => {
        let switchedPosIDs = [];
        for (let i=0; i<posIDs.length; i++){
            // Amend capital and remove op if exists, else add op to string header
            if (posIDs[i].substring(0,2) === 'op') {
                switchedPosIDs.push(posIDs[i].substring(2,3).toLowerCase()+posIDs[i].substring(3));
            }
            else {
                switchedPosIDs.push('op'+posIDs[i].substring(0,1).toUpperCase()+posIDs[i].substring(1));
            }
        }
        
        // Return turn to player if opponent has passed their turn, else switch turn
        if (roomPassCount[SID] === 1){
            io.in(SID).emit('returnTurn', cardIDs, switchedPosIDs, cardsInHand, abilityUsed);
        }
        else {
            io.in(SID).emit('nextTurn', cardIDs, switchedPosIDs, cardsInHand, abilityUsed);
        }
    });
    
    socket.on('endGame', (SID, player) => {
        // Call only needs to be emit once to room
        if(player == 'A'){
            io.in(SID).emit('results');
        }   
    });
    
    socket.on('disconnect', () => {
        // Check each open room and remove SID if every user has disconnected 
        openRooms.forEach((SID, index) => {
            let numClients = io.sockets.adapter.rooms[''+SID];
            if (numClients === undefined){
                if (index > -1) {
                    openRooms.splice(index, 1);
                }
            }
        });
    });
});


