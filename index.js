/*
*
* Variables
*
*/

var GLOBALTEST = 0;

/*
* Constant Variables
*/
const STATE_START = 0;
const STATE_GAME = 1;
const STATE_TURN = 2;
const STATE_END = 3;

const COLOUR_WATER = "#54A4DE";
const COLOUR_SHIP = "#AFAFAF";
const COLOUR_MISS = "#F39C12";
const COLOUR_HIT = "#DB3328";

const CELL_EMPTY = 0;
const CELL_MISS = 1;
const CELL_HIT = 2;

const CELL_SHIP_1 = 3;
const CELL_SHIP_2 = 4;
const CELL_SHIP_3 = 5;
const CELL_SHIP_4 = 6;

const COOKIE_LENGTH = 7; //How long cookies last in days.

const player1 = "Player One";
const player2 = "Player Two";

const FIRE_LIMIT = 1;  //Number of times a player can fire in a turn. Useful for testing purposes.

/*
* Game Information
*/
var gameState = STATE_START;
var turnPlayer = player1;
var fireCount = 0;

var shotsPlayer1 = 0;
var hitsPlayer1 = 0;

var shotsPlayer2 = 0;
var hitsPlayer2 = 0;

//Array of arrays holding the state of each player's grids
var gridPlayer1 = [];
var gridPlayer2 = [];

//5 member array, 0th index is total ships alive, 1-4 refer to the ships themselves and their parts
var shipSectionsPlayer1 = [];
var shipSectionsPlayer2 = [];

/*
*
* Event Handlers
*
*/

document.addEventListener("DOMContentLoaded", loadFunction, false);

document.getElementById("battleGridOpponent").addEventListener("click", fireAttempt, false);

document.getElementById("resetButton").addEventListener("click", gameEnd, false);
document.getElementById("startButton").addEventListener("click", startGame, false);
document.getElementById("turnButton").addEventListener("click", turnPage, false);
document.getElementById("buttonTurnConfirm").addEventListener("click", nextTurn, false);
document.getElementById("endResetButton").addEventListener("click", newGame, false);

/*
*
* Functions
*
*/

/*
* Handler Functions
*/

function loadFunction()
{//Page load
  if (getCookie("gameState") != "")
    readAllCookies();
  else
    gameState = STATE_START;
  
  console.log("Game State: " + gameState);
  
  if(gameState == STATE_GAME || gameState == STATE_TURN)
  {//If there is an ongoing game, switch to appropriate screen, deal with next turn button as necessary
    console.log("Attempting load");
    switchScreen(gameState);
    
    if (fireCount >= FIRE_LIMIT)
    {
      activateTurnButton(true);
    }
  }
  else
  {//Otherwise start a new game.
    console.log("Starting new game.");
    newGame();
  }
}

function fireAttempt(e)
{//Opponent grid clicked. Attempt to fire.
  if (fireCount >= FIRE_LIMIT)
  {//If they have already fired on this turn, they can not fire again.
    e.stopPropagation();
    return;
  }

  if (e.target !== e.currentTarget)
  {
    var clickedItem = e.target; //Get the cell that was clicked on in the grid
    
    //Cell coordinate data
    var x = parseInt(clickedItem.dataset.x);
    var y = parseInt(clickedItem.dataset.y);
    
    var opponentGrid = opponentPlayerGrid();
    var messageList = document.getElementById("messageList");
    var missed = false;
    
    switch (opponentGrid[y][x])
    {
      case CELL_MISS:
      case CELL_HIT:
        //If the cell has already been fired upon, leave this function without doing anything
        e.stopPropagation();
        return;
      case CELL_EMPTY:
        appendMessage(messageList, turnPlayer + " has missed.");
        opponentGrid[y][x] = CELL_MISS;
        e.target.style.backgroundColor = COLOUR_MISS;
        missed = true;
        break;
      case CELL_SHIP_1:
        appendMessage(messageList, turnPlayer + " has hit a ship!");
        shipHit(CELL_SHIP_1);
        break;
      case CELL_SHIP_2:
        appendMessage(messageList, turnPlayer + " has hit a ship!");
        shipHit(CELL_SHIP_2);
        break;
      case CELL_SHIP_3:
        appendMessage(messageList, turnPlayer + " has hit a ship!");
        shipHit(CELL_SHIP_3);
        break;
      case CELL_SHIP_4:
        appendMessage(messageList, turnPlayer + " has hit a ship!");
        shipHit(CELL_SHIP_4);
        break;
    }
    
    if (!missed)
    {//If the function did not return already, and did not miss, then a ship was hit.
      //Hit message is placed in the switch case instead of here because the sink message is in the shipHit function
      //Order looks weird if the hit message comes after the sink message.
      opponentGrid[y][x] = CELL_HIT;
      e.target.style.backgroundColor = COLOUR_HIT;
    }
    
    //Increment shot stats and activate next turn button
    hasFired();
    if (fireCount >= FIRE_LIMIT)
      activateTurnButton(true);
    
    createAllCookies()
  }
  
  e.stopPropagation();
}

function startGame()
{
  switchScreen(STATE_GAME);
  createAllCookies()
}

function turnPage()
{
  document.getElementById("messageEndTurn").innerHTML = turnPlayer + " has ended their turn.";
  
  if (fireCount >= FIRE_LIMIT)
  {
    switchScreen(STATE_TURN);
    activateTurnButton(false);
  }
  createAllCookies();
}

function resetGame()
{
  if(confirm("Are you sure you wish to restart the game?"))
    newGame();
}

/*
* Top-Level Functions
*/

function newGame()
{
  switchScreen(STATE_START);
  
  fillGrids();
  turnPlayer = player1;
  resetShipStats();
  resetShotData();
  
  document.getElementById("messageList").innerHTML = "";
  activateTurnButton(false);
  createAllCookies()
}

function fillGrids()
{
  gridPlayer1 = createEmptyGrid();
  gridPlayer2 = createEmptyGrid();
  populateShips();
}

function drawGrids()
{
  drawPlayerGrid();
  drawOpponentGrid();
}

/*
* Screen Functions
*/

function switchScreen(newGameState)
{//Changing screen states.

  gameState = newGameState;
  
  //Get all screens, we will need at least the one we are displaying specifically later
  //and it is easier to hide them all simultaneously
  var screenStart = document.getElementById("screenLobby");
  var screenGame = document.getElementById("screenGame");
  var screenTurn = document.getElementById("screenTurn");
  var screenEnd = document.getElementById("screenEnd");
  
  screenStart.style.display = "none";
  screenGame.style.display = "none";
  screenTurn.style.display = "none";
  screenEnd.style.display = "none";
  
  if (newGameState === STATE_START)
  {
    screenStart.style.display = "block";
  }
  else if (newGameState === STATE_GAME)
  {//Switching to the game screen requires redrawing the grids in addition to displaying the screen.
    turnPlayerMessage();
    drawGrids();
    screenGame.style.display = "block";
  }
  else if (newGameState === STATE_TURN)
  {
    screenTurn.style.display = "block";
  }
  else if (newGameState === STATE_END)
  {
    screenEnd.style.display = "block";
  }
}

function nextTurn()
{//Moving to the next turn
  //Set turn player
  if (turnPlayer === player1)
    turnPlayer = player2;
  else
    turnPlayer = player1;
  
  //Reset fire count and change to game screen
  fireCount = 0;
  createAllCookies();
  switchScreen(STATE_GAME);
}

function activateTurnButton(activateStatus)
{//Pass true or false to activate or deactivate the next turn button
  var turnButton = document.getElementById("turnButton");
  
  if (activateStatus)
  {
    turnButton.style.opacity = 1;
    turnButton.style.cursor = "pointer";
  }
  else
  {
    turnButton.style.opacity = 0.6;
    turnButton.style.cursor = "not-allowed";
  }
}

function gameEnd()
{
  var victoryMessage = document.getElementById("victoryHeader");
  
  if(shipSectionsPlayer1[0] > shipSectionsPlayer2[0])
  {
    victoryMessage.innerHTML = "Player 1 Wins!";
  }
  else if(shipSectionsPlayer1[0] < shipSectionsPlayer2[0])
  {
    victoryMessage.innerHTML = "Player 2 Wins!";
  }
  else
  {//Generic message for error catching.
    victoryMessage.innerHTML = "Congratulations!";
  }
  
  populateStats();
  switchScreen(STATE_END);
  createAllCookies()
}

function populateStats()
{//Fill the ul elements at the end screen with stats
  var listPlayer1 = document.getElementById("statsPlayer1List");
  var listPlayer2 = document.getElementById("statsPlayer2List");
  
  listPlayer1.innerHTML = "";
  listPlayer2.innerHTML = "";
  
  appendMessage(listPlayer1, "Shots Fired: " + shotsPlayer1);
  appendMessage(listPlayer2, "Shots Fired: " + shotsPlayer2);
  
  appendMessage(listPlayer1, "Shots Hit: " + hitsPlayer1);
  appendMessage(listPlayer2, "Shots Hit: " + hitsPlayer2);
  
  appendMessage(listPlayer1, "Shots Missed: " + (shotsPlayer1 - hitsPlayer1));
  appendMessage(listPlayer2, "Shots Missed: " + (shotsPlayer2 - hitsPlayer2));
  
  appendMessage(listPlayer1, "Enemy Ships Sunk: " + (4 - shipSectionsPlayer2[0]));
  appendMessage(listPlayer2, "Enemy Ships Sunk: " + (4 - shipSectionsPlayer1[0]));
  
  appendMessage(listPlayer1, "Surviving Ships: " + shipSectionsPlayer1[0]);
  appendMessage(listPlayer2, "Surviving Ships: " + shipSectionsPlayer2[0]);
}

/*
* Grid Functions
*/

function createEmptyGrid()
{
  var emptyGrid = [];
  
  for (var i = 0; i < 8; i++)
  {
    var emptyRow = [];
    for (var j = 0; j < 8; j++)
    {
      emptyRow.push(CELL_EMPTY);
    }
    emptyGrid.push(emptyRow);
  }
  return emptyGrid;
}

function drawPlayerGrid()
{
  var drawGrid = document.getElementById("battleGridPlayer");
  var gridCells = drawGrid.querySelectorAll("div.gridCell");

  var infoGrid = currentPlayerGrid();
  
  for (var y = 0; y < infoGrid.length; y++)
  {
    for (var x = 0; x < infoGrid[y].length; x++)
    {
      var index = coordsToIndex(x, y);
      
      if (infoGrid[y][x] === CELL_EMPTY)
      {
        gridCells[index].style.backgroundColor = COLOUR_WATER;
      }
      else if(infoGrid[y][x] === CELL_MISS)
      {
        gridCells[index].style.backgroundColor = COLOUR_MISS;
      }
      else if(infoGrid[y][x] === CELL_HIT)
      {
        gridCells[index].style.backgroundColor = COLOUR_HIT;
      }
      else
      {
        gridCells[index].style.backgroundColor = COLOUR_SHIP;
      }
    }
  }
}

function drawOpponentGrid()
{
  var drawGrid = document.getElementById("battleGridOpponent");
  var gridCells = drawGrid.querySelectorAll("div.gridCell");
  
  var infoGrid = opponentPlayerGrid();
  
  for (var y = 0; y < infoGrid.length; y++)
  {
    for (var x = 0; x < infoGrid[y].length; x++)
    {
      var index = coordsToIndex(x, y);

      if(infoGrid[y][x] === CELL_MISS)
      {
        gridCells[index].style.backgroundColor = COLOUR_MISS;
      }
      else if(infoGrid[y][x] === CELL_HIT)
      {
        gridCells[index].style.backgroundColor = COLOUR_HIT;
      }
      else
      {//The only information known about the opponent is shots fired. Anything else should show as empty.
        //i.e. skip rendering any ships.
        gridCells[index].style.backgroundColor = COLOUR_WATER;
      }
    }
  }
}

/*
* Ship Functions
*/

function populateShips()
{
  placeShip(createShipL(gridPlayer1), CELL_SHIP_1, gridPlayer1);
  placeShip(createShipSquare(gridPlayer1), CELL_SHIP_2, gridPlayer1);
  placeShip(createShipLine(gridPlayer1), CELL_SHIP_3, gridPlayer1);
  placeShip(createShipLine(gridPlayer1), CELL_SHIP_4, gridPlayer1);
  
  placeShip(createShipL(gridPlayer2), CELL_SHIP_1, gridPlayer2);
  placeShip(createShipSquare(gridPlayer2), CELL_SHIP_2, gridPlayer2);
  placeShip(createShipLine(gridPlayer2), CELL_SHIP_3, gridPlayer2);
  placeShip(createShipLine(gridPlayer2), CELL_SHIP_4, gridPlayer2);
}

function resetShipStats()
{
  shipSectionsPlayer1 = [4, 4, 4, 4, 4];
  shipSectionsPlayer2 = [4, 4, 4, 4, 4];
}

function checkValidPlacement(shipCoords, playerGrid)
{//Returns false if any cooordinates of a ship are outside the grid or overlap an existing ship
  for (var i = 0; i < shipCoords.length; i++)
  {
    var x = shipCoords[i].x;
    var y = shipCoords[i].y;
    
    if (x < 0 || x > 7)
      return false;
    
    if (y < 0 || y > 7)
      return false;
    
    if (playerGrid[y][x] != CELL_EMPTY)
      return false;
  }
  
  return true;
}

function placeShip(shipCoords, shipType, playerGrid)
{
  for(var i = 0 ; i < shipCoords.length; i++)
  {
    var x = shipCoords[i].x;
    var y = shipCoords[i].y;
    
    playerGrid[y][x] = shipType;
  }
}

function createShipL(playerGrid)
{
  var shipCoords = [];
  
  //Random variables to determine the rotation
  var axisOrientation = plusOrMinus();
  var longOrientation = plusOrMinus();
  
  do
  {
    shipCoords = [];
    shipCoords.push(coordRandom());
    if (axisOrientation > 0)
    {//Long end along the y-axis
      if (longOrientation > 0)
      {//Move positive along the axis
        shipCoords.push(coordDisplaced(shipCoords[0], 0, 1));
        shipCoords.push(coordDisplaced(shipCoords[0], 0, 2));
        shipCoords.push(coordDisplaced(shipCoords[0], -1, 2));
      }
      else
      {//Move negative along the axis
        shipCoords.push(coordDisplaced(shipCoords[0], 0, -1));
        shipCoords.push(coordDisplaced(shipCoords[0], 0, -2));
        shipCoords.push(coordDisplaced(shipCoords[0], 1, -2));
      }
    }
    else
    {//Long end along the x-axis
      if (longOrientation > 0)
      {//Move positive along the axis
        shipCoords.push(coordDisplaced(shipCoords[0], 1, 0));
        shipCoords.push(coordDisplaced(shipCoords[0], 2, 0));
        shipCoords.push(coordDisplaced(shipCoords[0], 2, -1));
      }
      else
      {//Move negative along the axis
        shipCoords.push(coordDisplaced(shipCoords[0], -1, 0));
        shipCoords.push(coordDisplaced(shipCoords[0], -2, 0));
        shipCoords.push(coordDisplaced(shipCoords[0], -2, 1));
      }
    }
    
    
  }
  while(!checkValidPlacement(shipCoords, playerGrid));
  
  return shipCoords;
}

function createShipSquare(playerGrid)
{
  var shipCoords = [];
    
  do
  {
    shipCoords = [];
    shipCoords.push(coordRandom());
    
    shipCoords.push(coordDisplaced(shipCoords[0], 0, 1));
    shipCoords.push(coordDisplaced(shipCoords[0], 1, 0));
    shipCoords.push(coordDisplaced(shipCoords[0], 1, 1));   
  }
  while(!checkValidPlacement(shipCoords, playerGrid));
  
  return shipCoords;
}

function createShipLine(playerGrid)
{
  var shipCoords = [];
    
  var axisOrientation = plusOrMinus();
  
  do
  {
    shipCoords = [];
    shipCoords.push(coordRandom());
    
    
    if (axisOrientation > 0)
    {//Along the y-axis
      shipCoords.push(coordDisplaced(shipCoords[0], 0, 1));
      shipCoords.push(coordDisplaced(shipCoords[0], 0, 2));
      shipCoords.push(coordDisplaced(shipCoords[0], 0, 3));   
    }
    else
    {//Along the x-axis
      shipCoords.push(coordDisplaced(shipCoords[0], 1, 0));
      shipCoords.push(coordDisplaced(shipCoords[0], 2, 0));
      shipCoords.push(coordDisplaced(shipCoords[0], 3, 0));   
    }
  }
  while(!checkValidPlacement(shipCoords, playerGrid));
  
  return shipCoords;
}

function shipHit(shipType)
{
  var currentSections;
  var shipIndex;
  var sinkMessage;
  
  //We want the ships of the opponent player, and increment hit counter for stats
  if (turnPlayer == player1)
  {
    hitsPlayer1++;
    currentSections = shipSectionsPlayer2;
  }
  else
  {
    hitsPlayer2++;
    currentSections = shipSectionsPlayer1;
  }
  
  switch (shipType)
  {
    case CELL_SHIP_1:
      shipIndex = 1;
      sinkMessage = " has sunk the enemy L ship!";
      break;
    case CELL_SHIP_2:
      shipIndex = 2;
      sinkMessage = " has sunk the enemy square ship!";
      break;
    case CELL_SHIP_3:
      shipIndex = 3;
      sinkMessage = " has sunk the enemy line ship one!";
      break;
    case CELL_SHIP_4:
      shipIndex = 4;
      sinkMessage = " has sunk the enemy line ship two!";
      break;
    default:
      console.log("Something has gone wrong in shipHit");
  }
  
  currentSections[shipIndex]--; //Ship now has less surviving sections
  
  if (currentSections[shipIndex] === 0)
  {//Check to see if the ship was sunk
    var messageList = document.getElementById("messageList");
    currentSections[0]--;
    appendMessage(messageList, turnPlayer + sinkMessage);
    
    if (currentSections[0] === 0)
    {//Check to see if the final ship has been sunk
      gameEnd();
    }
  }
}

/*
* Cookie Functions
*/

function createAllCookies()
{
  createBasicCookies();
  
  createGridCookie("gridPlayer1", gridPlayer1);
  createGridCookie("gridPlayer2", gridPlayer2);
  
  createShipCookie("shipSectionsPlayer1", shipSectionsPlayer1);
  createShipCookie("shipSectionsPlayer2", shipSectionsPlayer2);
}

function createBasicCookies()
{
  createCookie("gameState", gameState);
  createCookie("turnPlayer", turnPlayer);
  createCookie("fireCount", fireCount);
  
  createCookie("shotsPlayer1", shotsPlayer1);
  createCookie("hitsPlayer1", hitsPlayer1);
  
  createCookie("shotsPlayer2", shotsPlayer2);
  createCookie("hitsPlayer2", hitsPlayer2);
}

function createGridCookie(cookieName, playerGrid)
{
  var cookieValue = "";
  
  for (var i = 0; i < playerGrid.length; i++)
  {
    for (var j = 0; j < playerGrid[i].length; j++)
    {
      cookieValue = cookieValue + playerGrid[i][j];
    }
  }
  
  createCookie(cookieName, cookieValue);
}

function createShipCookie(cookieName, playerShips)
{
  var cookieValue = "";
  
  for (var i = 0; i < playerShips.length; i++)
  {
    cookieValue = cookieValue + playerShips[i];
  }
  
  createCookie(cookieName, cookieValue);
}

function readAllCookies()
{
  readBasicCookies();
  readGridCookies();
  readShipCookies();
}

function readBasicCookies()
{
  gameState = parseInt(getCookie("gameState"));
  turnPlayer = getCookie("turnPlayer");
  fireCount = parseInt(getCookie("fireCount"));
  
  shotsPlayer1 = parseInt(getCookie("shotsPlayer1"));
  hitsPlayer1 = parseInt(getCookie("hitsPlayer1"));
  
  shotsPlayer2 = parseInt(getCookie("shotsPlayer2"));
  hitsPlayer2 = parseInt(getCookie("hitsPlayer2"));
}

function readGridCookies()
{
  //Get cookie and create empty grids
  var cookieValue1 = getCookie("gridPlayer1");
  var cookieValue2 = getCookie("gridPlayer2");
  
  gridPlayer1 = createEmptyGrid();
  gridPlayer2 = createEmptyGrid();
  
  for (var i = 0; i < gridPlayer1.length; i++)
  {
    for (var j = 0; j < gridPlayer1[i].length; j++)
    {//Iterate through the array of arrays placing the appropriate values into place
      gridPlayer1[i][j] = parseInt(cookieValue1[(i * 8) + j]);
    }
  }
  
  for (var i = 0; i < gridPlayer2.length; i++)
  {
    for (var j = 0; j < gridPlayer2[i].length; j++)
    {//Iterate through the array of arrays placing the appropriate values into place
      gridPlayer2[i][j] = parseInt(cookieValue2[(i * 8) + j]);
    }
  }
}

function readShipCookies()
{
  //Get cookie and create base arrays
  var cookieValue1 = getCookie("shipSectionsPlayer1");
  var cookieValue2 = getCookie("shipSectionsPlayer2");
  
  shipSectionsPlayer1 = [4, 4, 4, 4, 4];
  shipSectionsPlayer2 = [4, 4, 4, 4, 4];
  
  for (var i = 0; i < shipSectionsPlayer1.length; i++)
  {
    shipSectionsPlayer1[i] = parseInt(cookieValue1[i]);
  }
  
  for (var i = 0; i < shipSectionsPlayer2.length; i++)
  {
    shipSectionsPlayer2[i] = parseInt(cookieValue2[i]);
  }
}

function createCookie(cookieName, cookieValue)
{//Create a cookie with a given name and value
  var cookieLength = new Date();
  cookieLength.setTime(cookieLength.getTime() + (COOKIE_LENGTH * 24 * 60 * 60 * 1000));
  var cookieExpiry = "expires="+cookieLength.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + cookieExpiry + ";path=/";
}

function getCookie(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }
        
        if (c.indexOf(name) == 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    
    return "";
}

/*
* Utility Functions
*/
/*
function coordsToIndex(coords)
{//Translate x and y coordinates into the array index of a grid cell.
  return coords.x + (coords.y * 8);
}
*/
function coordsToIndex(x, y)
{//Translate x and y coordinates into the array index of a grid cell.
  return x + (y * 8);
}

function coordRandom()
{//Create a random coordinate between (0,0) and (7,7)
  var coord = {x:0, y:0};
  
  coord.x = Math.floor(Math.random() * 8);
  coord.y = Math.floor(Math.random() * 8);
  
  return coord;
}

function coordDisplaced(coordOriginal, displaceX, displaceY)
{//Return a coordinate after displacement, used mostly for creating ships
  var coord = {x:coordOriginal.x, y:coordOriginal.y};
  coord.x += displaceX;
  coord.y += displaceY;
  
  return coord;
}

function currentPlayerGrid()
{
  if (turnPlayer == player1)
    return gridPlayer1;
  else
    return gridPlayer2;
}

function opponentPlayerGrid()
{
  if (turnPlayer == player1)
    return gridPlayer2;
  else
    return gridPlayer1;
}

function plusOrMinus()
{//Return either negative or positive one
  var result = Math.random();
  
  if (result < 0.5)
    return -1;
  else
    return 1;
}

function appendMessage(listElement, message)
{
  var newMessage = document.createElement("li");
  newMessage.innerHTML = message;
  listElement.appendChild(newMessage);
  listElement.scrollTo(0, listElement.scrollHeight);
}

function hasFired()
{
  fireCount++;
  
  if (turnPlayer == player1)
    shotsPlayer1++;
  else
    shotsPlayer2++;
}

function resetShotData()
{
  fireCount = 0;
  shotsPlayer1 = 0;
  shotsPlayer2 = 0;
  hitsPlayer1 = 0;
  hitsPlayer2 = 0;
}

function turnPlayerMessage()
{
  var playerHeader = document.getElementById("playerHeader");
  
  if (turnPlayer == player1)
    playerHeader = "Player 1's Turn";
  else
    playerHeader = "Player 2's Turn";
}