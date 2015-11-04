'use strict';

module.exports = function(Game, ViewModel, UIElements){

  var self = this;
  self.computerPosition = 'sky';
  self.mode = 'versus computer';
  self.viewModel = ViewModel();

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
    self.viewModel.newGame(Game(self.mode, self.computerPosition));
  }

  UIElements.newGameElement.

}
