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
  self.earthPlayer = new HumanPlayer('earth', self);
  self.skyPlayer = new HumanPlayer('sky', self);
  self.currPlayer = null;
  self.startGame = function(){
    console.log('Entering Game.startGame');
    self.currPlayer = self.earthPlayer;
    earthPlayer.move();
    console.log('Exiting Game.startGame');
  };
  /*
  self.startGame = function(){
    console.log('Entering Game.startGame');
    var currPlayer = 'earthPlayer',
        nextMove = null;
    while(true){
      if(currPlayer == 'earthPlayer'){
        nextMove = earthPlayer.move(board);
        nextMove.gameOver ? break : self.executeMove(nextMove);
        currPlayer = 'skyPlayer';
      } else {
        nextMove = skyPlayer.move(board);
        nextMove.gameOver ? break : self.executeMove(nextMove);
        currPlayer = 'earthPlayer';
      }
    }
    console.log('Exiting Game.startGame');
  }
  */

  self.executeMove = function(move){
    console.log('Entering Game.executeMove');
    console.log('Exiting Game.executeMove');
  }

}
