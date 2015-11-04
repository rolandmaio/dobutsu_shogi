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
    'Lion': new LionPiece(position),
    'Giraffe': new GiraffePiece(position),
    'Elephant': new ElephantPiece(position),
    'Chick': new ChickPiece(position)
  };

  self.earthInitialization = function(){
    console.log('Entering HumanPlayer.earthInitialization');
    self.game.board[3][0] = self.pieces.Elephant;
    self.game.board[3][1] = self.pieces.Lion;
    self.game.board[3][2] = self.pieces.Giraffe;
    self.game.board[2][1] = self.pieces.Chick;
    console.log('Exiting HumanPlayer.earthInitialization');
  };

  self.skyInitialization = function(){
    console.log('Entering HumanPlayer.skyInitialization');
    self.game.board[0][0] = self.pieces.Giraffe;
    self.game.board[0][1] = self.pieces.Lion;
    self.game.board[0][2] = self.pieces.Elephant;
    self.game.board[1][1] = self.pieces.Chick;
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

}
