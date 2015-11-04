

//Bool variable for converting to hens 
var wChickToHen = false; 
var bChickToHen = false; 

//Other variables 
var dangerousSquare = false;
var turn = "W"  //Determines whose turn it is "W" or "B"
//Board Model 
var boardSquare = {
  row: 0, 
  column: 0,
  occupied: false, 
  piece: NULL, 
  color: "",
  danger["W"]: 0,  
  danger["B"]: 0,
}

//Each Shogi piece declared as an object 
var Lion = {
  id: "L", 
  boardLocation: -1, 
  inDanger: false, 
  mobility: 8, 
  disToEnd: 4,
  color: "", 
};

var Chick = {
  id: "C", 
  boardLocation: -1, 
  backup: 2,
  inDanger: false, 
  mobility: 1,
  disToEnd: 3,
  color: "", 
}; 


var Elephant = {
  id: "E", 
  boardLocation: -1, 
  backup: 1,
  inDanger: false, 
  mobility: 4, 
  color: "", 
};

var Girrafe = {
  id: "G", 
  boardLocation: -1, 
  backup: 1,
  inDanger: false, 
  mobility: 4, 
  color: ""
}; 

var Hen = {
  id: "H", 
  boardLocation: -1, 
  backup: undefined,
  inDanger: undefined, 
  mobility: 6,
  color: "", 
};


//Initializing all pieces and thier locations on the board
var wLion = new Lion; 
wLion.color = "W";
wLion.boardLocation = 1;

var bLion = new Lion; 
bLion.color = "B";
bLion.boardLocation = 15; 

var elephants = new Elephant[2]; 
elephants[0].color = "W";
elephants[0].boardLocation = 0;

elephants[1].color = "B";
elephants[1].boardLocation = 14;

var giraffes = new Girrafe[2]; 
giraffes[0].color = "W"; 
giraffes[0].boardLocation = 2; 

giraffes[1].color = "B"; 
giraffes[1].boardLocation = 12; 

var chicks = new Chick[2]; 
chicks[0].color = "W"; 
chicks[0].boardLocation = 4; 

chicks[1].color= "B"; 
chicks[1].boardLocation = 10; 

var hens = new Hen[2]; 
hens[0].color = "W"; 
hens[1].color = "B";
//End of piece initialization 

var board = new boardSquare[15]; 
//Setting up the board 
board[0].row = 0; 
board[0].column = 0; 
board[0].occupied = true; 
board[0].piece = elephants[0]; 
board[0].color = "W";
board[0].danger["B"] = 1;

board[1].row = 0; 
board[1].column = 1; 
board[1].occupied = true; 
board[1].piece = wLion;
board[1].danger["B"] = 1;

board[2].row = 0; 
board[2].column = 2; 
board[2].occupied = true; 
board[2].piece = giraffes[0]; 
board[2].color = "W";
board[2].danger["B"] = 1; 

board[3].row = 1; 
board[3].column = 0; 
board[3].danger["B"] = 1; 

board[4].row = 1; 
board[4].column = 1; 
board[4].occupied = true; 
board[4].piece = chicks[0]; 
board[4].color = "W";
board[4].danger["B"] = 2; 

board[5].row = 1; 
board[5].column = 2; 
board[5].danger["B"] = 2; 

board[6].row = 2; 
board[6].column = 0; 

board[7].row = 2; 
board[7].column = 1; 
board[7].danger["B"] = 1; 
board[7].danger["W"] = 1;

board[8].row = 2; 
board[8].column = 2; 

board[9].row = 3; 
board[9].column = 0; 
board[9].danger["W"] = 2; 

board[10].row = 3; 
board[10].column = 1; 
board[10].occupied = true; 
board[10].piece = chicks[1]; 
board[10].color = "B";
board[10].danger["W"] = 2; 

board[11].row = 3; 
board[11].column = 2; 
board[11].danger["W"] = 1; 

board[12].row = 4; 
board[12].column = 0; 
board[12].occupied = true; 
board[12].piece = giraffes[1]; 
board[12].color = "B"; 
board[12].danger["W"] = 1; 

board[13].row = 4; 
board[13].column = 1; 
board[13].occupied = true; 
board[13].piece = bLion; 
board[13].color = "B";
board[13].danger["W"] = 1; 

board[14].row = 4; 
board[14].column = 2; 
board[14].occupied = true; 
board[14].piece = elephants[2]; 
board[14].color = "B";
board[14].danger["W"] = 1; 


//Goal of this function is to move the pieces around the board. Each turn this function will get called once. 
function movePiece( pieceName, boardLoc, board )
{
  //First lets check if the move is legal 
  if ( !isLegalMove(pieceName, boardLoc) ) 
  {
    //dont do anything
  }
  //End of checking for legal move 
  
  //Check if the board location is occupied, if so add peice to graveyard 
  if ( board[boardLoc].occupied == true ) 
  {
    if (turn = "W") 
    {
      board[boardLoc].piece.color = "W"; //The piece is captured by white
      wGrave.push(board[boardLoc].piece); //Piece is now stored in the graveyard
      
    } 
    if (turn = "B") 
    {
      board[boardLoc].piece.color = "B"; //The piece is captured by black 
      bGrave.push(board[boardLoc].piece); //The piece is now stored in the graveyard 
      
    } 
  }
  
  board[pieceName.boardLocation].piece = ""; 
  board[pieceName.boardLocation].color = "";
  board[pieceName.boardLocation].occupied = false; 
  
  //When player is moving piece, one is reduced from the squares it was endangering before
  if (pieceName.id = "C")
  {
    board[boardLoc+3].danger[turn]--;
  }
  if (pieceName.id = "E")
  {
    board[boardLoc + 4].danger[turn]--; 
    board[boardLoc + 2].danger[turn]--;
    board[boardLoc - 4].danger[turn]--;
    board[boardLoc - 2].danger[turn]--;
  }
  if (pieceName.id = "G") 
  {
    board[boardLoc + 3].danger[turn]--;
    board[boardLoc + 1].danger[turn]--;
    board[boardLoc - 1].danger[turn]--;
    board[boardLoc - 3].danger[turn]--;
  }
  if (pieceName.id = "L")
  {
    board[boardLoc + 3].danger[turn]--;
    board[boardLoc + 1].danger[turn]--;
    board[boardLoc - 1].danger[turn]--;
    board[boardLoc - 3].danger[turn]--;
    board[boardLoc + 4].danger[turn]--; 
    board[boardLoc + 2].danger[turn]--;
    board[boardLoc - 4].danger[turn]--;
    board[boardLoc - 2].danger[turn]--;
  }
  
  //Moving the piece in the board model... 
  pieceName.boardLocation = boardLoc; 
  board[boardLoc].occupied = true; 
  board[boardLoc].piece = pieceName; 
  board[boardLoc].color = pieceName.color;
  
  
//Calculate the dangers caused in each square with the move...    
  if (pieceName.id = "C")
  {
    board[boardLoc+3].danger[turn]++;
  }
  if (pieceName.id = "E")
  {
    board[boardLoc + 4].danger[turn]++; 
    board[boardLoc + 2].danger[turn]++;
    board[boardLoc - 4].danger[turn]++;
    board[boardLoc - 2].danger[turn]++;
  }
  if (pieceName.id = "G") 
  {
    board[boardLoc + 3].danger[turn]++;
    board[boardLoc + 1].danger[turn]++;
    board[boardLoc - 1].danger[turn]++;
    board[boardLoc - 3].danger[turn]++;
  }
  if (pieceName.id = "L")
  {
    board[boardLoc + 3].danger[turn]++;
    board[boardLoc + 1].danger[turn]++;
    board[boardLoc - 1].danger[turn]++;
    board[boardLoc - 3].danger[turn]++;
    board[boardLoc + 4].danger[turn]++; 
    board[boardLoc + 2].danger[turn]++;
    board[boardLoc - 4].danger[turn]++;
    board[boardLoc - 2].danger[turn]++;
  }

}
  
function isLegalMove( pieceName, boardLoc)
  {
    //Can't put two pieces on the same square
    if( Board[boardLoc].occupied && (Board[boardLoc].color == Board[pieceName.boardLocation].color) )
       return false; 
    //Can't move two squares at once no matter what 
    if( Math.abs(boardLoc - pieceName.boardLocation) > 5 ) 
      return false; 
    //Put contraints for the mobility of each piece 
    if( pieceName.id == "E" )
    {
      if( Math.abs(boardLoc - pieceName.boardLocation) != 2 || Math.abs(boardLoc - pieceName.boardLocation) != 4) 
        return false; 
    }
    if( pieceName.id == "G" )
    {
      if( Math.abs(boardLoc - pieceName.boardLocation) != 1 || Math.abs(boardLoc - pieceName.boardLocation) != 3) 
        return false; 
    }
    if( pieceName.id == "C" )
    {
      if( boardLoc - pieceName.boardLocation != 1) 
        return false; 
    }
    if( pieceName.id == "H" )
    {
      if( (boardLoc - pieceName.boardLocation == -4) || (boardLoc - pieceName.boardLocation == -2) ) 
        return false; 
    }
  }
    
    
    
  

function genNextMove ( board ) 
{
  //apply minimax here 
}
  
function evaluateBoard ( pieceName, board )
{
  var i; 
  for(i=0; i <15; i++) 
  {
    if (board[i].occupied && board[i].color =="W") 
      eval = eval + board[i].mobility + 
      // value = value(all pieces) - 2*danger*valueofpiece + 2*backup*valueof(opposingpiece) + WCdist + WLdist + valueof(GY pieces)  
}
      
function winGame()
{
  if ( wLion.disToEnd == 0 || 
}
    