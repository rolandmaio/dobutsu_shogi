'use strict';

module.exports = function(Game, ViewModel, UIElements){

  var self = this;
  self.computerPosition = 'sky';
  self.mode = 'versus human';
  self.viewModel = new ViewModel();
  self.game;

  self.switchPlayerSides = function(){
    if(self.mode == 'versus computer')
      self.computerPosition = self.computerPosition == 'sky' ? 'earth' : 'sky';
  }

  self.switchModeToVersusComputer = function(){
    self.mode = 'versus computer';
  }

  self.switchModeToVersusHuman = function(){
    self.mode = 'versus human';
  }

  self.startNewGame = function(){
    self.game = new Game(self.mode, self.computerPosition);
    self.viewModel.newGame(self.game);
    self.game.startGame();
  }

  UIElements.newGameElement.bind(function(){ self.startNewGame(); });
  UIElements.playAgainstHumanElement.bind(function(){ self.switchModeToVersusHuman(); });
  UIElements.playAgainstComputerElement.bind(function(){ self.switchModeToVersusComputer(); });
  UIElements.switchSidesElement.bind(function(){ self.switchPlayerSides(); });

  self.boardsAreSynced = function(){
    var synced = true;
    for(var i = 0; i < 4; ++i){
      for(var j = 0; j < 3; ++j){
        if((self.game.board[i][j] == null && self.game.skyPlayer.mentalGame.board[i][j] == null)
            || self.game.board[i][j].type == self.game.skyPlayer.mentalGame.board[i][j].type){
          continue;
        } else {
          console.log('Deviation at ' + i + ' ' + j);
          console.log('self.game.board[i][j]: ' + self.game.board[i][j]);
          console.log('self.game.skyPlayer.mentalGame.board[i][j]: ' + self.game.skyPlayer.mentalGame.board[i][j]);
          synced = false;
        }
      }
    }
    return true;
  }

}
