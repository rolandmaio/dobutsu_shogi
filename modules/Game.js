'use strict';

var HumanPlayer = require('./HumanPlayer');

module.exports = function(mode, computerPosition){

  var self = this;
  self.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  self.observers = [];
  self.mode = mode;
  self.computerPosition = computerPosition;
  self.earthPlayer = new HumanPlayer('earth', self);
  self.skyPlayer = new HumanPlayer('sky', self);
  self.currPlayer = 'earth';
  self.registerObserver = function(observer){
    self.observers.push(observer);
  };
  self.notifyObservers = function(evt){
    self.observers.forEach(function(observer){
      observer.notify(evt);
    })
  };
  self.startGame = function(){
    console.log('Entering Game.startGame');
    self.currPlayer = 'sky';
    self.nextMove();
    console.log('Exiting Game.startGame');
  };
  self.nextMove = function(){
    self.notifyObservers(self.currPlayer == 'earth' ? 'skyPlayerMove' : 'earthPlayerMove');
    if(self.currPlayer == 'earth'){
      self.currPlayer = 'sky';
      self.skyPlayer.move();
    } else {
      self.currPlayer = 'earth';
      self.earthPlayer.move();
    }
  };
  self.executeMove = function(piece, move){
    console.log('Entering Game.executeMove');
    console.log('piece.type: ' + piece.type);
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
    if(piece.x == -1 && piece.y == -1){
      for(var i = 0; i < piece.owner.bench.length; i++){
        if(piece.owner.bench[i].type == piece.type){
          piece.owner.bench.splice(i, 1);
          break;
        }
      }
    } else {
      self.board[piece.x][piece.y] = null;
    }
    self.board[move.x][move.y] = piece;
    piece.setPosition(move.x, move.y);
    self.nextMove();
    console.log('Exiting Game.executeMove');
  };
  self.openTiles = function(){
    var tiles = [];
    for(var i = 0; i < 4; ++i)
      for(var j = 0; j < 3; ++j)
        if(self.board[i][j] == null)
          tiles.push({'x': i, 'y': j});
    return tiles;
  }

}
