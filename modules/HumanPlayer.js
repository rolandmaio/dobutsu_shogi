'use strict';

var LionPiece = require('./LionPiece'),
    GiraffePiece = require('./GiraffePiece'),
    ElephantPiece = require('./ElephantPiece'),
    ChickPiece = require('./ChickPiece'),
    HenPience = require('./HenPiece');

module.exports = function(position, game){

  var self = this;
  self.game = game;
  self.pieces = {
    'Lion': new LionPiece(position, self),
    'Giraffe': new GiraffePiece(position, self),
    'Elephant': new ElephantPiece(position, self),
    'Chick': new ChickPiece(position, self)
  };

  self.earthInitialization = function(){
    console.log('Entering HumanPlayer.earthInitialization');
    self.game.board[3][0] = self.pieces.Elephant;
    self.game.board[3][1] = self.pieces.Lion;
    self.game.board[3][2] = self.pieces.Giraffe;
    self.game.board[2][1] = self.pieces.Chick;

    self.pieces.Elephant.setPosition(3, 0);
    self.pieces.Lion.setPosition(3, 1);
    self.pieces.Giraffe.setPosition(3, 2);
    self.pieces.Chick.setPosition(2, 1);
    console.log('Exiting HumanPlayer.earthInitialization');
  };

  self.skyInitialization = function(){
    console.log('Entering HumanPlayer.skyInitialization');
    self.game.board[0][0] = self.pieces.Giraffe;
    self.game.board[0][1] = self.pieces.Lion;
    self.game.board[0][2] = self.pieces.Elephant;
    self.game.board[1][1] = self.pieces.Chick;

    self.pieces.Giraffe.setPosition(0, 0);
    self.pieces.Lion.setPosition(0, 1);
    self.pieces.Elephant.setPosition(0, 2);
    self.pieces.Chick.setPosition(1, 1);
    console.log('Exiting HumanPlayer.skyInitialization');
  };

  position == 'earth' ? self.earthInitialization() : self.skyInitialization();

  self.move = function(){
    console.log('Entering HumanPlayer.move');
    console.log('Exiting HumanPlayer.move');
  }

  self.validateUIMove = function(move){
    console.log('Entering HumanPlayer.validateUIMove');
    // If the move is valid.
    // Execute the move.
    // Call the next player to move.
    console.log('Exiting HumanPlayer.validateUIMove');
  }

  self.computeMoves = function(piece){
    console.log('Entering HumanPlayer.computeMoves');
    var moves = [];
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
    console.log('Exiting HumanPlayer.computeMoves');
    return moves;
  };

}
