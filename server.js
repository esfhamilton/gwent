const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000; 

app.use(express.static('public'))

server = app.listen(PORT);

const io = require('socket.io')(server);

let openRooms = [];

io.on('connection', (socket) => {
    socket.on('joinRequest', (SID) => {                
        var numClients = io.sockets.adapter.rooms[''+SID];
        if (numClients != undefined || openRooms.includes(SID)){
            if (numClients.length<2){
                // Authorise join request
                socket.join(SID);
                io.in(SID).emit('continue', SID);
                console.log(`Room: ${SID} successfully joined`);
               
                // Save SID and immediately pass it into next page
                
            } else {
                // Room is full, only 2 people can enter a room at a time
                console.log("Room is full, only 2 people can enter a room at a time");
                socket.emit('full', SID);
            }
        } 
        else {
            // numClients should not be undefined and openRoom should contain SID
            socket.emit('invalidRoom', SID);
        }            
    })
    
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
    })
    
    // Reconnects user to room with each new page
    socket.on('rejoinRequest', (SID) => {                
        if (openRooms.includes(SID)){
            // Authorise join request
            socket.join(SID);    
            console.log(`Room: ${SID} successfully joined`);
        } else {
            // Room needs recreating
            socket.join(SID);
            openRooms.push(SID);   
            console.log(`Room: ${SID} successfully created`);
        }           
    })
    
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


