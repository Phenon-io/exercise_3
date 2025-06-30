/**
 * tracks current turn number. 
 * Required for turn zero, cosmetic afterwards 
 * @type {number} 
 * */
var turn = 0;
/** 
 * checks win state, true on win, false while playing 
 * @type {boolean} 
*/
var win = false;
/** 
 * whichever mark player two is using 
 * @type {string} 
*/
const playerTwoMark = "X";
/** 
 * whichever mark player one is using 
 * @type {string} 
 * */
const playerOneMark = "O";
/**
 * A collection of "winning" solutions when textContext matches
 * any of these a==b==c indicates a win (only in 3x3)
 * @type {number[][]}
 */
const winCombo = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Columns
  [0,4,8], [2,4,6]           // Diagonals
];

let buttons = [];
let lastMove = null;
let playerOneStarts = true;

/** 
 * toggle button between Start/Clear
 * @type {HTMLButtonElement}
 */
const startButton = document.getElementById("clearToggle");
startButton.textContent = "Start";

/** 
 * container, grid, holds buttons for the game
 * @type {HTMLElement} 
 * */
const grid = document.getElementById('grid');

/*
* Initial setup, creates 9 button elements
*/
for (let i = 1; i <= 9; i++) {
  const btn = document.createElement('button');
  btn.id = i;
  btn.onclick = toggle;
  grid.appendChild(btn);
  buttons[i-1] = btn;
}

/**
* Toggles the state of the Start/Clear button
* Also resolves clear and start tasks
* On start: opens dice modal to assign players
* On clear: resets board, disables buttons
*/
function startClear(){
  if(startButton.textContent === "Clear"){
    for(let i = 0; i<9; i++){
      buttons[i].textContent = "";
      buttons[i].style.color = "black";
    }
    startButton.textContent = "Start";
    turn = 0;
    win = false;
    buttonDisable(true);
    updateTurnDisplay();
  }
  else if(startButton.textContent === "Start"){
    // Open modal for dice roll
    document.getElementById("diceModal").style.display = "block";
    document.getElementById("diceResult").textContent = "";
    buttonDisable(true);
  }
}

/**
 * Simulates dice roll, decides first player, and enables grid
 */
function rollDice() {
  const result = Math.floor(Math.random() * 20) + 1;
  const firstPlayer = result % 2 === 0 ? "p1" : "p2";
  playerOneStarts = (firstPlayer === "p1");
  document.getElementById("diceResult").textContent = `Rolled ${result} — ${firstPlayer} goes first!`;

  // Set initial state and begin game
  turn = 1;
  win = false;
  startButton.textContent = "Clear";

  setTimeout(() => {
    document.getElementById("diceModal").style.display = "none";
    document.getElementById("diceResult").textContent = ""; // clear modal content
    buttonDisable(false);
    updateTurnDisplay();
  }, 2000);
}

/**
 * Updates the turn display dynamically based on player turn
 */
function updateTurnDisplay() {
  const display = document.getElementById("turnDisplay");
  if (win) {
    display.textContent = "Game Over";
    return;
  }

  if (turn === 0) {
    display.textContent = "Turn: -";
    return;
  }

  const currentPlayer = (turn % 2 === 1) === playerOneStarts ? "p1" : "p2";
  const currentMark = currentPlayer === "p1" ? playerOneMark : playerTwoMark;
  display.textContent = `${currentPlayer} (${currentMark})'s move`;
}

/**
 * button control for player turns
 * updates player choice, tracks turn, and checks for win
 */
function toggle() {
  if (!this.textContent && !win) {
    const currentPlayer = (turn % 2 === 1) === playerOneStarts ? playerOneMark : playerTwoMark;
    this.textContent = currentPlayer;
    lastMove = this;
    turn++;
    winCheck();
    updateTurnDisplay();
  }
}

/**
 * Undo the last move made (only most recent move supported)
 */
function undoMove() {
  if (lastMove && !win) {
    lastMove.textContent = "";
    lastMove = null;
    turn--;
    updateTurnDisplay();
  }
}

/**
 * Helper function to enable/disable the tic tac toe buttons
 * @param {boolean} status 
 */
function buttonDisable(status){
  for (let i = 0; i <= 8; i++) {
    buttons[i].disabled = status;
  }
}

/**
 * Checks for wins using defined patterns
 * If win found, highlights and ends game
 * Also detects draw
 */
function winCheck(){
  for (let i = 0; i < 9; i += 3) {
    if (
      buttons[i].textContent &&
      buttons[i].textContent === buttons[i + 1].textContent &&
      buttons[i + 1].textContent === buttons[i + 2].textContent
    ) {
      highlightWin(i, i + 1, i + 2);
      return;
    }
  }

  for (let i = 0; i < 3; i++) {
    if (
      buttons[i].textContent &&
      buttons[i].textContent === buttons[i + 3].textContent &&
      buttons[i + 3].textContent === buttons[i + 6].textContent
    ) {
      highlightWin(i, i + 3, i + 6);
      return;
    }
  }

  if (
    buttons[0].textContent &&
    buttons[0].textContent === buttons[4].textContent &&
    buttons[4].textContent === buttons[8].textContent
  ) {
    highlightWin(0, 4, 8);
    return;
  }

  if (
    buttons[2].textContent &&
    buttons[2].textContent === buttons[4].textContent &&
    buttons[4].textContent === buttons[6].textContent
  ) {
    highlightWin(2, 4, 6);
    return;
  }

  const allFilled = buttons.every(btn => btn.textContent);
  if (allFilled) {
    alert("Draw");
    win = true;
    updateTurnDisplay();
  }
}

/**
 * Highlights winning combo and ends the game
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 */
function highlightWin(a, b, c){
  win = true;
  buttons[a].style.color = "red";
  buttons[b].style.color = "red";
  buttons[c].style.color = "red";
  setTimeout(() => {
    alert(buttons[a].textContent + " Wins!");
  }, 100);
  updateTurnDisplay();
}

// Disable board on first load
window.onload = () => {
  buttonDisable(true);
  updateTurnDisplay();
};
