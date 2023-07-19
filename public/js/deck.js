const socket = io();

// Get SID and faction ID from URL
const {SID, faction} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('rejoinRequest', SID);

let unitCardsPicked = 0;

function createLeaderCard(i) {
    let leaderCard = document.createElement('div');
    leaderCard.className = "leaderCard";
    leaderCard.id = faction+"Leader"+i;
    leaderCard.setAttribute('onmouseenter', "showAbility('ability"+i+"')");
    leaderCard.setAttribute('onmouseleave', "hideAbility('ability"+i+"')");
    leaderCard.setAttribute('onclick', "leaderSelected('"+leaderCard.id+"')");
    let abilityDesc = document.createElement('p');
    abilityDesc.className = "abilityDesc";
    abilityDesc.id = "ability"+i;
    abilityDesc.innerHTML = abilityDescriptions[faction+"Leader"+i];
    leaderCard.appendChild(abilityDesc);
    return leaderCard;
}

function createNeutralCard(i, attribute, colNotation = "") {
    let neutralCard = document.createElement('div');
    neutralCard.className = "card";
    neutralCard.id = "neutral"+i+colNotation;
    neutralCard.setAttribute('onclick', attribute+"('neutral"+i+"');")
    let cardAmount = document.createElement('p');
    cardAmount.className = "cardAmount";
    cardAmount.id = "neutral"+i+"Amount"+colNotation;
    cardAmount.innerHTML = "x"+cardsAvailable["neutral"+i];
    neutralCard.appendChild(cardAmount);
    return neutralCard;
}

function createFactionCard(i, attribute, colNotation = "") {
    let factionCard = document.createElement('div');
    factionCard.className = "card";
    factionCard.id = faction+i+colNotation;
    factionCard.setAttribute('onclick', attribute+"('"+faction+i+"');")
    let cardAmount = document.createElement('p');
    cardAmount.className = "cardAmount";
    cardAmount.id = faction+i+"Amount"+colNotation;
    cardAmount.innerHTML = "x"+cardsAvailable[faction+i]; 
    factionCard.appendChild(cardAmount);
    return factionCard;
}

function setCardStyle(elementId, styleId){
    document.getElementById(elementId).style.background = styles[styleId].background; 
    document.getElementById(elementId).style.display = styles[styleId].display; 
}

function addCardStyles() {
    for (let id in styles){
        if(document.getElementById(id) !== null) setCardStyle(id,id);
    }
}

const factionCardAmount = factionCardAmounts[faction];
let leaderSection = document.getElementById('leaderSection');
let availableColumn = document.getElementById('availableCards');
let currentDeckColumn = document.getElementById('currentDeck');
let deck = [];

for(let i=1; i<=4; i++){
    let leaderCard = createLeaderCard(i);
    leaderSection.appendChild(leaderCard);
}

for(let i=1; i<=17; i++){
    let neutralCard = createNeutralCard(i, 'addToDeck');
    let neutralCardCD = createNeutralCard(i, 'removeFromDeck','CD');
    availableColumn.appendChild(neutralCard);
    currentDeckColumn.appendChild(neutralCardCD);
}

for(let i=1; i<=factionCardAmount; i++){
    let factionCard = createFactionCard(i, 'addToDeck');
    let factionCardCD = createFactionCard(i, 'removeFromDeck','CD');
    availableColumn.appendChild(factionCard);
    currentDeckColumn.appendChild(factionCardCD);
}

addCardStyles();

function showAbility(abilityDescId){
    document.getElementById(abilityDescId).style = "display: block";
}

function hideAbility(abilityDescId){
    document.getElementById(abilityDescId).style = "display: none";
}

let leader;
function leaderSelected(id) {
    leader = id;
    resetBorders();
    document.getElementById(id).style.borderStyle = "solid";
    document.getElementById(id).style.borderColor = "gold";
}

function resetBorders() {
    for(i=1; i<=4; i++){
        document.getElementById(faction+"Leader"+i).style.borderStyle = "solid";
        document.getElementById(faction+"Leader"+i).style.borderColor = "black";
    }
}

function addToDeck(id) {
    const availabilityID = id+'Amount';
    const deckID = id+'CD';
    const addedID = availabilityID + "CD"; 
    
    deck.push(id);
    cardsAvailable[id] -= 1;
    cardsAdded[id] += 1;
    document.getElementById(availabilityID).innerHTML = "x"+cardsAvailable[id];

    if(cardsAvailable[id] === 0) document.getElementById(id).style="display: none;";
    
    setCardStyle(deckID,id);
    document.getElementById(addedID).innerHTML = "x"+cardsAdded[id];
    if(unitCards.includes(id)) {
        unitCardsPicked += 1;
        document.getElementById('unitCardCount').innerText = `Unit Cards: ${unitCardsPicked}/22`
    }
}

function removeFromDeck(id) {
    const availabilityID = id+'Amount';
    const deckID = id+'CD';
    const addedID = availabilityID + "CD"; 
    
    // Remove card from deck array
    let index = deck.indexOf(id);
    if (index !== -1) deck.splice(index, 1);
    
    cardsAvailable[id] += 1;
    cardsAdded[id] -= 1;
    document.getElementById(addedID).innerHTML = "x"+cardsAdded[id];

    if(cardsAdded[id] === 0) document.getElementById(deckID).style="display: none;";
    
    setCardStyle(id,id);
    document.getElementById(availabilityID).innerHTML = "x"+cardsAvailable[id];
    
    if(unitCards.includes(id)) {
        unitCardsPicked -= 1;
        document.getElementById('unitCardCount').innerText = `Unit Cards: ${unitCardsPicked}/22`
    }
}

function submit() {
    if (leader===undefined) {
        document.getElementById('info').innerHTML = "You need to select a leader first.";
    }
    else {
        if (unitCardsPicked < 22) {
            document.getElementById('info').innerHTML = "Your deck is weak. Add at least 22 unit cards before proceeding.";
        }
        else {
            socket.emit('playerDeck',SID,leader,deck,faction);
        }
    }
}

socket.on('playerAssignment', (PID) => {
    location.replace(`/game.html?SID=${SID}&player=${PID}`);
});

var stickyContainer = $('.stickyPlaceholder');
var origOffsetY = stickyContainer.offset().top;

function onScroll() {
    if(window.scrollY >= origOffsetY ){
        stickyContainer.removeClass('stickyPlaceholder')
        stickyContainer.addClass('sticky') 
    }
    else{
        stickyContainer.removeClass('sticky');
        stickyContainer.addClass('stickyPlaceholder')
    }
}

$(document).on('scroll', onScroll);