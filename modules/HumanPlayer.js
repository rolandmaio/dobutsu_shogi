'use strict';

var LionPiece = require('./LionPiece'),
    GiraffePiece = require('./GiraffePiece'),
    ElephantPiece = require('./ElephantPiece'),
    ChickPiece = require('./ChickPiece'),
    HenPiece = require('./HenPiece');

module.exports = function(position, game){

  var self = this;
  self.position = position;
  self.game = game;
  self.bench = [];
  self.inCheck = false;
  self.attackingPosition = null;
  self.lionPosition = null;
  self.lion = new LionPiece(position, self);
  self.pieces = [
    self.lion,
    new GiraffePiece(position, self),
    new ElephantPiece(position, self),
    new ChickPiece(position, self)
  ];
  self.takenTypeToPiece = {
    'EarthChick': ChickPiece,
    'SkyChick': ChickPiece,
    'EarthGiraffe': GiraffePiece,
    'SkyGiraffe': GiraffePiece,
    'EarthElephant': ElephantPiece,
    'SkyElephant': ElephantPiece,
    'EarthHen': ChickPiece,
    'SkyHen': ChickPiece,
    'EarthLion': LionPiece,
    'SkyLion': LionPiece
  };

  self.earthInitialization = function(){
    console.log('Entering HumanPlayer.earthInitialization');
    self.game.board[3][0] = self.pieces[2];   // Set the Elephant's position.
    self.game.board[3][1] = self.pieces[0];   // Set the Lion's position.
    self.game.board[3][2] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[2][1] = self.pieces[3];   // Set the Chick's position.

    self.pieces[2].setPosition(3, 0);
    self.pieces[0].setPosition(3, 1);
    self.pieces[1].setPosition(3, 2);
    self.pieces[3].setPosition(2, 1);

    self.lionPosition = {'x': 3, 'y': 1};
    console.log('Exiting HumanPlayer.earthInitialization');
  };
  self.skyInitialization = function(){
    console.log('Entering HumanPlayer.skyInitialization');
    self.game.board[0][0] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[0][1] = self.pieces[0];     // Set the Lion's position.
    self.game.board[0][2] = self.pieces[2]; // Set the Elephant's position.
    self.game.board[1][1] = self.pieces[3];    // Set the Chick's position.

    self.pieces[1].setPosition(0, 0);
    self.pieces[0].setPosition(0, 1);
    self.pieces[2].setPosition(0, 2);
    self.pieces[3].setPosition(1, 1);

    self.lionPosition = {'x': 0, 'y': 1};
    console.log('Exiting HumanPlayer.skyInitialization');
  };

  position == 'earth' ? self.earthInitialization() : self.skyInitialization();

  self.move = function(){
    console.log('Entering HumanPlayer.move');
    if(self.inCheck){
      var lionMoves = self.computeMoves(self.lion);
      if(lionMoves.length == 0){
        self.game.notifyDefeat(self);
      }
    }
    console.log('Exiting HumanPlayer.move');
  }
  self.makeMove = function(piece, move){
    console.log('Entering HumanPlayer.makeMove');
    console.log('piece: ' + piece);
    if(piece.type == 'EarthLion' || piece.type == 'SkyLion'){
      self.lionPosition = move;
    }
    self.game.executeMove(piece, move);
    console.log('Exiting HumanPlayer.makeMove');
  }
  self.computeMoves = function(piece){
    console.log('Entering HumanPlayer.computeMoves');
    var moves = [];
    if(self.inCheck){
      // If this is not the Lion, check if it can attack the attacker.
      if(!(piece.type == 'EarthLion' || piece.type == 'SkyLion')){
        piece.generateMoves().forEach(function(move){
          if(move.x == self.attackingPosition.x && move.y == self.attackingPosition.y){
            moves.push(move);
          }
        });
      } else {
        // This is the Lion. We need to know for each possible move if:
        //    a) One of our own pieces blocks the move.
        //    b) If the tile to which we would move is threatened by another piece.
        var threatenedTiles = self.game.getThreatenedTiles();
        console.log('threatenedTiles: ' + JSON.stringify(threatenedTiles));
        piece.generateMoves().forEach(function(move){
          if((0 <= move.x && move.x <= 3 && 0 <= move.y && move.y <= 2) &&
             (game.board[move.x][move.y] == null ||
              game.board[move.x][move.y].side != position)){

            for(var i = 0; i < threatenedTiles.length; ++i){
              if(threatenedTiles[i].x == move.x && threatenedTiles[i].y == move.y){
                return;
              }
            }
            moves.push(move);
          }
        });
      }
    } else {
      if(piece.x == -1 && piece.y == -1){
        // This is a benched piece.
        return game.openTiles();
      } else if(!(piece.type == 'EarthLion' || piece.type == 'SkyLion')){
        piece.generateMoves().forEach(function(move){
          if((0 <= move.x && move.x <= 3 && 0 <= move.y && move.y <= 2) &&
             (game.board[move.x][move.y] == null ||
              game.board[move.x][move.y].side != position)){
            console.log('game.board[move.x][move.y]: ' + game.board[move.x][move.y]);
            if(game.board[move.x][move.y] != null){
              console.log('game.board[move.x][move.y] side: ' + game.board[move.x][move.y].side);
            }
            moves.push(move);
          }
        });
      } else {
        // This is the Lion. We need to know for each possible move if:
        //    a) One of our own pieces blocks the move.
        //    b) If the tile to which we would move is threatened by another piece.
        var threatenedTiles = self.game.getThreatenedTiles();
        console.log('threatenedTiles: ' + JSON.stringify(threatenedTiles));
        piece.generateMoves().forEach(function(move){
          if((0 <= move.x && move.x <= 3 && 0 <= move.y && move.y <= 2) &&
             (game.board[move.x][move.y] == null ||
              game.board[move.x][move.y].side != position)){

            for(var i = 0; i < threatenedTiles.length; ++i){
              if(threatenedTiles[i].x == move.x && threatenedTiles[i].y == move.y){
                return;
              }
            }
            moves.push(move);
          }
        });
      }
    }
    console.log('Exiting HumanPlayer.computeMoves');
    return moves;
  };
  self.removePiece = function(piece){
    console.log('Entering HumanPlayer.removePiece');
    console.log('self.pieces.length before: ' + self.pieces.length);
    for(var i = 0; i < self.pieces.length; i++){
      if(piece.type == self.pieces[i].type){ //&& piece.y == self.pieces[i].y){
        self.pieces.splice(i, 1);
        break;
      }
    }
    console.log('self.pieces.length after: ' + self.pieces.length);
    console.log('Exiting HumanPlayer.removePiece');
  };
  self.addToBench = function(piece){
    console.log('Entering HumanPlayer.addToBench');
    var constructor = self.takenTypeToPiece[piece.type],
        newPiece = new constructor(self.position, self);
    newPiece.setPosition(-1, -1);
    self.bench.push(newPiece);
    console.log('Exiting HumanPlayer.addToBench');
  };
  self.removeFromBench = function(piece){
    console.log('Entering HumanPlayer.removeFromBench');
    for(var i = 0; i < self.bench.length; i++){
      if(piece.type == self.bench[i].length){
        self.bench = self.bench.splice(i, 1);
        break;
      }
    }
    self.pieces.push(piece);
    console.log('Exiting HumanPlayer.removeFromBench');
  }
  self.getBench = function(){
    return self.bench;
  }

}
