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
      self.skyPlayer.move();
    } else {
      self.earthPlayer.move();
    }
    self.currPlayer = self.currPlayer == 'earth' ? 'sky' : 'earth';
  };
  self.executeMove = function(move){
    console.log('Entering Game.executeMove');
    console.log('Exiting Game.executeMove');
  };

}
