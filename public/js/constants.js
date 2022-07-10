const instructionTextShow = `<button style="font-size: 90%;">E</button>&nbsp;&nbsp;Show Cards
&nbsp;&nbsp;<button style="font-size: 90%;">Space</button>&nbsp;&nbsp;End Turn`;
const instructionTextHide = `<button style="font-size: 90%;">E</button>&nbsp;&nbsp;Hide Cards
&nbsp;&nbsp;<button style="font-size: 90%;">Space</button>&nbsp;&nbsp;End Turn`;


/*  
    6.65% First column
    35.5% Second column
    64.5% Third column
    93.4% Final column
    6% Top row
    50% Second row
    94% Final row
    455% 331% height width 
*/

// Initialises player faction styles
const styles = {deck:"background: url(img/cards_16.jpg) 64.5% 94% / 455% 331%; display: block;",
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

const opStyles = {deck:"background: url(img/cards_16.jpg) 64.5% 94% / 455% 331%; display: block;",
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
const cardPowers = {neutral1:0,
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


const initDraw = 10;

const combatCards = ["neutral8", "neutral9", "neutral11", "neutral13", "neutral14", "neutral15", "neutral16", "neutral17", 
                   "NR1", "NR2", "NR3", "NR12", "NR13", "NR22", "NR23", "NR25", "NR26", "NR27"];
const rangedCards = ["neutral10", "NR4", "NR6", "NR14", "NR15", "NR17", "NR20", "NR21"];
const siegeCards = ["NR5", "NR7", "NR8", "NR9", "NR10", "NR11", "NR18", "NR28"];
const combatSpies = ["neutral12", "NR16", "NR19"];
const siegeSpies = ["NR24"];
const heroes = ["neutral1","neutral3","neutral8","neutral9","neutral10","neutral11","neutral12","NR1","NR2","NR3","NR4"];
const medics = ["neutral10","NR18"];
const tightBonds = ["NR5","NR17","NR22","NR25"];
const moraleBoosters = ["NR28"];
const horns = ["neutral2", "neutral17"];
const weatherCards = ["neutral4","neutral5","neutral6"];
const decoy = "neutral1";
const commandersHorn = "neutral2";
const scorchId = "neutral3";
const bitingFrost = "neutral4";
const impenetrableFog = "neutral5";
const torrentialRain = "neutral6";
const clearWeather = "neutral7";
const villentretenmerth = "neutral13";
const dandelion = "neutral17";

const rowIDs = ["combatLane", "rangedLane", "siegeLane", "opCombatLane", "opRangedLane", "opSiegeLane"];
const hornIDs = ['combatHorn','rangedHorn','siegeHorn', "opCombatHorn", "opRangedHorn", "opSiegeHorn"];
const boardIDs = rowIDs.concat(hornIDs);
const powerIDs = ["opSiegePower","opRangedPower","opCombatPower","opTotalPower","combatPower","rangedPower","siegePower","totalPower"];

const modBase = {combatLane:{}, rangedLane:{}, siegeLane:{}, opCombatLane:{}, opRangedLane:{}, opSiegeLane:{}};
let tightBondMods = moraleMods = $.extend(true,{},modBase); // Deep clone