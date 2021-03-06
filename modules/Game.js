'use strict';

var HumanPlayer = require('./HumanPlayer'),
    ComputerPlayer = require('./ComputerPlayer'),
    HenPiece = require('./HenPiece');

module.exports = function(mode, computerPosition){

  var self = this;
  self.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  self.history = [];
  self.observers = [];
  self.mode = mode;
  self.computerPosition = computerPosition;
  self.cycleCounter = 0;
  if(mode === 'versus human'){

    self.earthPlayer = new HumanPlayer('earth', self);
    self.skyPlayer = new HumanPlayer('sky', self);

  } else if(mode === 'versus computer'){

    if(computerPosition === 'sky'){

      self.earthPlayer = new HumanPlayer('earth', self);
      self.skyPlayer = new ComputerPlayer('sky', self, module.exports);

    } else {

      self.earthPlayer = new ComputerPlayer('earth', self, module.exports);
      self.skyPlayer = new HumanPlayer('sky', self);

    }

  }
  self.currPlayer = 'earth';
  self.registerObserver = function(observer){
    self.observers.push(observer);
  };
  self.notifyObservers = function(evt, data){
    self.observers.forEach(function(observer){
      observer.notify(evt, data);
    })
  };
  self.startGame = function(){
    self.currPlayer = 'sky';
    self.nextMove();
  };
  self.nextMove = function(){
    if(self.currPlayer == 'earth'){
      self.currPlayer = 'sky';
      self.skyPlayer.move();
    } else {
      self.currPlayer = 'earth';
      self.earthPlayer.move();
    }
    self.notifyObservers(self.currPlayer == 'earth' ? 'skyPlayerMove' : 'earthPlayerMove');
  };
  self.executeMove = function(piece, move){
    var prevPos;
    // Check if an opponent's piece is in the new position and if there is,
    // remove it and add this piece to the current player's bench.
    if(self.board[move.x][move.y]){
      if(self.currPlayer == 'earth'){
        self.skyPlayer.removePiece(self.board[move.x][move.y]);
        self.earthPlayer.addToBench(self.board[move.x][move.y]);
      } else {
        self.earthPlayer.removePiece(self.board[move.x][move.y]);
        self.skyPlayer.addToBench(self.board[move.x][move.y]);
      }
    }
    // Check if this piece is coming off the bench.
    if(piece.x == -1 && piece.y == -1){
      for(var i = 0; i < piece.owner.bench.length; i++){
        if(piece.owner.bench[i].type == piece.type){
          piece.owner.bench.splice(i, 1);
          break;
        }
      }
      prevPos = {'x': -1, 'y': -1};
      piece.owner.pieces.push(piece);
    } else {
      prevPos = {'x': piece.x, 'y': piece.y};
      self.board[piece.x][piece.y] = null;
    }
    // Check if this piece is a Chick that has made it to the end zone
    // on the board, and not from the bench.
    if(((piece.type == 'EarthChick' && move.x == 0) ||
       (piece.type == 'SkyChick' && move.x == 3)) &&
       (piece.x != -1 && piece.y != -1)){
      piece.owner.removePiece(piece);
      piece = new HenPiece(piece.side, piece.owner);
      piece.owner.pieces.push(piece);
    }
    // Check if this piece is a Lion that has made it to the end zone.
    if(piece.type == 'EarthLion' && move.x == 0){
      self.notifyDefeat(self.skyPlayer);
    }
    if(piece.type == 'SkyLion' && move.x == 3){
      self.notifyDefeat(self.earthPlayer);
    }
    self.board[move.x][move.y] = piece;
    piece.setPosition(move.x, move.y);
    var threatens = piece.owner.computeMoves(piece);
    // Set the inCheck flag.
    if(self.currPlayer == 'earth'){
      self.skyPlayer.attackingPosition = move;
      var lionPosition = self.skyPlayer.lionPosition;
      //self.skyPlayer.inCheck = false;
      for(var i = 0; i < threatens.length; ++i){
        if(threatens[i].x == lionPosition.x && threatens[i].y == lionPosition.y){
          self.skyPlayer.inCheck = true;
        }
      }
    } else {
      self.earthPlayer.attackingPosition = move;
      var lionPosition = self.earthPlayer.lionPosition;
      //self.earthPlayer.inCheck = false;
      for(var i = 0; i < threatens.length; ++i){
        if(threatens[i].x == lionPosition.x && threatens[i].y == lionPosition.y){
          self.earthPlayer.inCheck = true;
        }
      }
    }
    self.history.push({'piece.type': piece.type, 'move': move, 'prevPos': prevPos});
    self.updateCycleCounter();
    self.nextMove();
  };
  self.openTiles = function(){
    var tiles = [];
    for(var i = 0; i < 4; ++i)
      for(var j = 0; j < 3; ++j)
        if(self.board[i][j] == null)
          tiles.push({'x': i, 'y': j});
    return tiles;
  };
  self.getMovablePieces = function(){
    if(self.currPlayer == 'sky'){
      return self.earthPlayer.pieces;
    } else {
      return self.skyPlayer.pieces;
    }
  };
  self.getThreatenedTiles = function(){
    var player = self.currPlayer == 'earth' ? self.skyPlayer : self.earthPlayer,
        tiles = [];
    player.pieces.forEach(function(piece){
      tiles = tiles.concat(piece.generateMoves());
    });
    return tiles;
  };
  self.notifyDefeat = function(player){
    self.notifyObservers('gameOver', player);
  };
  self.printHistory = function(){
    self.history.forEach(function(move){
      console.log(JSON.stringify(move));
    });
  };
  self.updateCycleCounter = function(){

    if(self.history.length < 3){
      return;
    }

    var curMove = self.history[self.history.length - 1],
        lastMove = self.history[self.history.length - 3];

    if(curMove['piece.type'] == lastMove['piece.type'] &&
       curMove.move.x == lastMove.prevPos.x &&
       curMove.move.y == lastMove.prevPos.y){
      ++self.cycleCounter;
    } else {
      self.cycleCounter = 0;
    }

    if(self.cycleCounter == 8){
      self.notifyObservers('gameDraw');
    }

  };

}
