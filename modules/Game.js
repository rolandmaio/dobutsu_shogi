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
    console.log('Entering Game.startGame');
    self.currPlayer = 'sky';
    self.nextMove();
    console.log('Exiting Game.startGame');
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
    console.log('Entering Game.executeMove');
    console.log('piece.type: ' + piece.type);
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
      //console.log('piece.x: ' + piece.x + ' piece.y: ' + piece.y);
      prevPos = {'x': piece.x, 'y': piece.y};
      self.board[piece.x][piece.y] = null;
      //console.log('self.board[piece.x][piece.y]: ' + self.board[piece.x][piece.y]);
    }
    // Check if this piece is a Chick that has made it to the end zone.
    if((piece.type == 'EarthChick' && move.x == 0) ||
       (piece.type == 'SkyChick' && move.x == 3)){
      piece.owner.removePiece(piece);
      piece = new HenPiece(piece.side, piece.owner);
      piece.owner.pieces.push(piece);
    }
    self.board[move.x][move.y] = piece;
    piece.setPosition(move.x, move.y);
    var threatens = piece.owner.computeMoves(piece);
    // Set the inCheck flag.
    if(self.currPlayer == 'earth'){
      self.skyPlayer.attackingPosition = move;
      var lionPosition = self.skyPlayer.lionPosition;
      self.skyPlayer.inCheck = false;
      for(var i = 0; i < threatens.length; ++i){
        if(threatens[i].x == lionPosition.x && threatens[i].y == lionPosition.y){
          self.skyPlayer.inCheck = true;
        }
      }
    } else {
      self.earthPlayer.attackingPosition = move;
      var lionPosition = self.earthPlayer.lionPosition;
      self.earthPlayer.inCheck = false;
      for(var i = 0; i < threatens.length; ++i){
        if(threatens[i].x == lionPosition.x && threatens[i].y == lionPosition.y){
          self.earthPlayer.inCheck = true;
        }
      }
    }
    self.history.push({'piece.type': piece.type, 'move': move, 'prevPos': prevPos});
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
  };
  self.getMovablePieces = function(){
    if(self.currPlayer == 'sky'){
      return self.earthPlayer.pieces;
    } else {
      return self.skyPlayer.pieces;
    }
  };
  self.getThreatenedTiles = function(){
    console.log('Entering Game.getThreatenedTiles');
    var player = self.currPlayer == 'earth' ? self.skyPlayer : self.earthPlayer,
        tiles = [];
    console.log('player.pieces.length: ' + player.pieces.length);
    player.pieces.forEach(function(piece){
      console.log('piece.type: ' + piece.type);
      console.log('piece.generateMoves(): ' + JSON.stringify(piece.generateMoves()));
      tiles = tiles.concat(piece.generateMoves());
    });
    console.log('Threatened tiles: ' + JSON.stringify(tiles));
    console.log('Exiting Game.getThreatenedTiles');
    return tiles;
  };
  self.notifyDefeat = function(player){
    self.notifyObservers('gameOver', player);
  }

}
