'use strict';

module.exports = function(Game, ViewModel, UIElements){

  var self = this;
  self.computerPosition = 'sky';
  self.mode = 'versus computer';
  self.viewModel = new ViewModel();

  self.switchPlayerSides = function(){
    console.log('Entering Application.switchPlayerSides');
    if(self.mode == 'versus computer')
      self.computerPosition = self.computerPosition == 'sky' ? 'earth' : 'sky';
    console.log('Exiting Application.switchPlayerSides');
  }

  self.switchModeToVersusComputer = function(){
    console.log('Entering Application.switchModeToVersusComputer');
    self.mode = 'versus computer';
    console.log('Exiting Application.switchModeToVersusComputer');
  }

  self.switchModeToVersusHuman = function(){
    console.log('Entering Application.switchModeToVersusHuman');
    self.mode = 'versus human';
    console.log('Exiting Application.switchModeToVersusHuman');
  }

  self.startNewGame = function(){
    console.log('Entering Application.startNewGame');
    self.viewModel.newGame(new Game(self.mode, self.computerPosition));
    console.log('Exiting Application.startNewGame');
  }

  UIElements.newGameElement.bind(function(){ self.startNewGame(); });
  UIElements.playAgainstHumanElement.bind(function(){ self.switchModeToVersusHuman(); });
  UIElements.playAgainstComputerElement.bind(function(){ self.switchModeToVersusComputer(); });
  UIElements.switchSidesElement.bind(function(){ self.switchPlayerSides(); });

}
