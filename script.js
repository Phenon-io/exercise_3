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
 * The mark ('X' or 'O') used by player two.
 * These marks are a failsafe, as they should be decided
 * dynamically after game start.
 * @type {string}
 */
let playerTwoMark = "X";
/** 
 * whichever mark player one is using 
 * @type {string} 
 * */
let playerOneMark = "O";
/**
 * which player is assigned the 'O' mark
 * @type {string}
 */
let oPlayer = "p1";
/**
 * which player is assigned the 'X' mark
 * @type {string}
 */
let xPlayer = "p2";

/**
 * tracks the last move made so it can be undone
 * @type {{index: number, mark: string}|null}
 */
let lastMove = null;

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
const startButton = document.getElementById("clearToggle");
const grid = document.getElementById('grid');
const turnDisplay = document.getElementById("turnDisplay");
const undoButton = document.getElementById("undoButton");
const diceModal = document.getElementById("diceModal");
const diceResult = document.getElementById("diceResult");

let playerOneStarts = true;

for (let i = 1; i <= 9; i++) {
  const btn = document.createElement('button');
  btn.id = i;
  btn.onclick = toggle;
  grid.appendChild(btn);
  buttons[i-1] = btn;
}

/**
 * Starts or clears the game
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
    lastMove = null;
    turnDisplay.textContent = "Turn: -";
    buttonDisable(true);
  } else {
    diceResult.textContent = "";
    diceModal.style.display = "block";
  }
}

/**
 * Rolls a die to determine who starts (and therefore who is O)
 */
function rollDice() {
  const roll = Math.ceil(Math.random() * 20);
  const firstPlayer = roll % 2 === 0 ? "p1" : "p2";

  // Determine mark assignments
  playerOneStarts = (firstPlayer === "p1");
  oPlayer = firstPlayer;
  xPlayer = firstPlayer === "p1" ? "p2" : "p1";

  playerOneMark = (firstPlayer === "p1") ? "O" : "X";
  playerTwoMark = (firstPlayer === "p1") ? "X" : "O";

  diceResult.textContent = `Dice rolled a ${roll}. ${firstPlayer} (O) goes first.`;
  setTimeout(() => {
    diceModal.style.display = "none";
    startButton.textContent = "Clear";
    turn = 1;
    turnDisplay.textContent = `Turn ${turn}: ${oPlayer}(O)'s move`;
    buttonDisable(false);
  }, 2000);
}

/**
 * Player button interaction
 */
function toggle() {
  if (this.textContent || win) return;

  const mark = (turn % 2 === 1) ? "O" : "X";
  this.textContent = mark;
  lastMove = { index: parseInt(this.id) - 1, mark };

  winCheck();
  if (!win) {
    turn++;
    const currentPlayer = (mark === "O") ? xPlayer : oPlayer;
    turnDisplay.textContent = `Turn ${turn}: ${currentPlayer}(${turn % 2 === 1 ? "O" : "X"})'s move`;
  } else {
    buttonDisable(true);
  }
}

/**
 * Disables or enables the tic tac toe grid buttons
 * @param {boolean} status 
 */
function buttonDisable(status){
  buttons.forEach(btn => btn.disabled = status);
}

/**
 * Undoes the last move played, if available
 */
function undoMove() {
  if (!lastMove || win) return;
  buttons[lastMove.index].textContent = "";
  turn--;
  win = false;
  turnDisplay.textContent = `Turn ${turn}: ${(turn % 2 === 1 ? oPlayer : xPlayer)}(${turn % 2 === 1 ? "O" : "X"})'s move`;
  lastMove = null;
  buttonDisable(false);
}

/**
 * Checks for win conditions or a draw
 */
function winCheck(){
  for (const [a, b, c] of winCombo) {
    if (
      buttons[a].textContent &&
      buttons[a].textContent === buttons[b].textContent &&
      buttons[b].textContent === buttons[c].textContent
    ) {
      highlightWin(a, b, c);
      return;
    }
  }
  const allFilled = buttons.every(btn => btn.textContent);
  if (allFilled) {
    win = true;
    turnDisplay.textContent = "Draw!";
    buttonDisable(true);
  }
}

/**
 * Highlights the winning combination
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 */
function highlightWin(a, b, c){
  win = true;
  buttons[a].style.color = "red";
  buttons[b].style.color = "red";
  buttons[c].style.color = "red";
  turnDisplay.textContent = `${buttons[a].textContent} Wins!`;
}
