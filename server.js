const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000; 

app.use(express.static('public'))

server = app.listen(PORT);

const io = require('socket.io')(server);

let openRooms = [];
let startCheck = {};
let gameData = {};
let redrawnCheck = {};

io.on('connection', (socket) => {
    socket.on('joinRequest', (SID) => {                
        var numClients = io.sockets.adapter.rooms[''+SID];
        if (numClients != undefined || openRooms.includes(SID)){
            if (numClients.length<2){
                // Authorise join request
                socket.join(SID);
                // Emits to both (all) users in SID 
                io.in(SID).emit('continue', SID);
                console.log(`Room: ${SID} successfully joined`);                
            } 
            else {
                // Room is full, only 2 people can enter a room at a time
                console.log("Room is full, only 2 people can enter a room at a time");
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
        console.log(`Room: ${SID} successfully created`);
        openRooms.push(SID);     
    });
    
    // Reconnects user to room with each new page
    socket.on('rejoinRequest', (SID) => {         
        if (openRooms.includes(SID)){
            socket.join(SID);    
            console.log(`Room: ${SID} successfully rejoined`);
        } 
        else {
            // Room needs recreating (pushing to openRooms)
            socket.join(SID);
            openRooms.push(SID);   
            console.log(`Room: ${SID} successfully recreated`);
        }           
    });
    
    // Gets player details from client and stores them on server
    socket.on('playerDeck', (SID, leader, deck, faction) => {
        let playerA = SID +'A';
        let playerB = SID +'B'; 
        // Check if first player has already been added
        if (playerA in gameData) {
            // Add data under player B
            gameData[playerB] = {"faction":faction,"leader":leader,"deck":deck,"hand":[],"discarded":[]};
            // Inform client which identifier their data is stored under
            socket.emit('playerAssignment', 'B');
        }
        else {
            // Add data under player A
            gameData[playerA] = {"faction":faction,"leader":leader,"deck":deck,"hand":[],"discarded":[]};
            // Inform client which identifier their data is stored under
            socket.emit('playerAssignment', 'A');
        }
    });
    
    // Returns corresponding deck to the player
    socket.on('getPlayerDeck', (SID, player) => {
        let PID = SID + player;
        startCheck[PID] = "Added";
        if (player === 'A') { 
            socket.emit('playerAssigned', gameData[PID]["faction"], gameData[PID]["leader"], gameData[PID]["deck"]);
        }
        else {
            socket.emit('playerAssigned', gameData[PID]["faction"], gameData[PID]["leader"], gameData[PID]["deck"]); 
        }
    });
    
    socket.on('getOpponentDeck', (SID, player) => {
        let OID;
        if (player === 'A') {
            OID = SID + 'B';
            socket.emit('opponentDeck', gameData[OID]["faction"], gameData[OID]["leader"], gameData[OID]["deck"].length);
        }
        else {
            OID = SID + 'A';
            socket.emit('opponentDeck', gameData[OID]["faction"], gameData[OID]["leader"], gameData[OID]["deck"].length);
            
        }
    });
    
    // Checks whether both players are on the game.html page
    socket.on('startCheck', (SID) => {
        if ((SID+'A') in startCheck && (SID+'B') in startCheck) {
            delete startCheck[SID+'A'];
            delete startCheck[SID+'B'];
            io.in(SID).emit('startGame');
        } 
    });
    
    // Checks if players have redrawn the starting hand
    socket.on('cardsRedrawn', (SID, player) => {
        if(SID in redrawnCheck) {
            // Prevents crash from page refresh, should be true
            if (redrawnCheck[SID] != player) {
                delete redrawnCheck[SID];
                io.in(SID).emit('firstTurn', Math.random()>0.5 ? 'A':'B');
            }       
        }
        else {
            redrawnCheck[SID] = player;
            socket.emit('waiting');
        }
    });
    
    // Informs both players to switch their myTurn variable
    socket.on('skipTurn', (SID) => {
        io.in(SID).emit('nextTurn');
    });
    
    socket.on('disconnect', () => {
        console.log('user disconnected'); // LOGGING
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


