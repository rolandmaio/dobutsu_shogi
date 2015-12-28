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
    self.game.board[3][0] = self.pieces[2];   // Set the Elephant's position.
    self.game.board[3][1] = self.pieces[0];   // Set the Lion's position.
    self.game.board[3][2] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[2][1] = self.pieces[3];   // Set the Chick's position.

    self.pieces[2].setPosition(3, 0);
    self.pieces[0].setPosition(3, 1);
    self.pieces[1].setPosition(3, 2);
    self.pieces[3].setPosition(2, 1);

    self.lionPosition = {'x': 3, 'y': 1};
  };
  self.skyInitialization = function(){
    self.game.board[0][0] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[0][1] = self.pieces[0];     // Set the Lion's position.
    self.game.board[0][2] = self.pieces[2]; // Set the Elephant's position.
    self.game.board[1][1] = self.pieces[3];    // Set the Chick's position.

    self.pieces[1].setPosition(0, 0);
    self.pieces[0].setPosition(0, 1);
    self.pieces[2].setPosition(0, 2);
    self.pieces[3].setPosition(1, 1);

    self.lionPosition = {'x': 0, 'y': 1};
  };

  position == 'earth' ? self.earthInitialization() : self.skyInitialization();

  self.move = function(){
    if(self.inCheck){
      var moves = [];
      self.pieces.forEach(function(piece){
        moves = moves.concat(self.computeMoves(piece));
      });
      if(moves.length == 0){
        self.game.notifyDefeat(self);
      }
    }
  }
  self.makeMove = function(piece, move){
    self.inCheck = false;
    if(piece.type == 'EarthLion' || piece.type == 'SkyLion'){
      self.lionPosition = move;
    }
    self.game.executeMove(piece, move);
  }
  self.computeMoves = function(piece){
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
            if(game.board[move.x][move.y] != null){
            }
            moves.push(move);
          }
        });
      } else {
        // This is the Lion. We need to know for each possible move if:
        //    a) One of our own pieces blocks the move.
        //    b) If the tile to which we would move is threatened by another piece.
        var threatenedTiles = self.game.getThreatenedTiles();
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
    return moves;
  };
  self.removePiece = function(piece){
    for(var i = 0; i < self.pieces.length; i++){
      if(piece.type == self.pieces[i].type &&
         piece.x == self.pieces[i].x &&
         piece.y == self.pieces[i].y){
        self.pieces.splice(i, 1);
        break;
      }
    }
  };
  self.addToBench = function(piece){
    var constructor = self.takenTypeToPiece[piece.type],
        newPiece = new constructor(self.position, self);
    newPiece.setPosition(-1, -1);
    self.bench.push(newPiece);
  };
  self.removeFromBench = function(piece){
    for(var i = 0; i < self.bench.length; i++){
      if(piece.type == self.bench[i].length){
        self.bench = self.bench.splice(i, 1);
        break;
      }
    }
    self.pieces.push(piece);
  }
  self.getBench = function(){
    return self.bench;
  }

}
