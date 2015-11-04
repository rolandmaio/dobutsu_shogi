'use strict';

module.exports = function(){

  var self = this;
  self.game = null;

  self.newGame = function(game){
    console.log('Entering ViewModel.newGame');
    self.game = game;
    self.displayBoard();
    console.log('Exiting ViewModel.newGame');
  }

  self.displayBoard = function(){
    for(var i = 0; i < 4; i++)
      for(var j = 0; j < 3; j++)
        if(self.game.board[i][j])
          self.displayPiece(i, j, self.game.board[i][j]);
  }

  self.pieceImages = {
    'EarthLion': '<img src="/images/earthLion.png"></img>',
    'EarthGiraffe': '<img src="/images/earthGiraffe.png"></img>',
    'EarthElephant': '<img src="/images/earthElephant.png"></img>',
    'EarthChick': '<img src="/images/earthChick.png"></img>',
    'EarthHen': '<img src="/images/earthHen.png"></img>',
    'SkyLion': '<img src="/images/skyLion.png"></img>',
    'SkyGiraffe': '<img src="/images/skyGiraffe.png"></img>',
    'SkyElephant': '<img src="/images/skyElephant.png"></img>',
    'SkyChick': '<img src="/images/skyChick.png"></img>',
    'SkyHen': '<img src="/images/skyHen.png"></img>'
  }

  self.displayPiece = function(i, j, piece){
    console.log('Entering ViewModel.displayPiece');
    console.log('Type: ' + self.pieceImages[piece.type]);
    var selector = '#' + i + j;
    $(selector).append(self.pieceImages[piece.type]);
    console.log('Exiting ViewModel.displayPiece');
  }

}
