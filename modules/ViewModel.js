'use strict';

module.exports = function(){

  var self = this;
  self.highlightedPieces = [];
  self.game = null;
  self.eventCallbacks = {
    'skyPlayerMove': function(){
      if(!self.skyPlayerIsHuman){
        return;
      }
    },
    'earthPlayerMove': function(){
      console.log('Entering ViewModel.eventCallbacks.earthPlayerMove');
      if(!self.earthPlayerIsHuman){
        return;
      }
      console.log('Exiting ViewModel.eventCallbacks.earthPlayerMove');
    }
  };
  self.newGame = function(game){
    console.log('Entering ViewModel.newGame');
    self.game = game;
    self.game.registerObserver(self);
    self.clearBoard();
    self.displayBoard();
    self.computeEntities();
    console.log('Exiting ViewModel.newGame');
  }
  self.notify = function(evt){
    console.log('Entering ViewModel.notify');
    self.eventCallbacks[evt]();
    console.log('Exiting ViewModel.notify');
  };
  self.computeEntities = function(){
    if(self.game.mode == 'versus human'){
      self.skyPlayerIsHuman = true;
      self.earthPlayerIsHuman = true;
    } else if(self.game.computerPosition == 'sky'){
      self.skyPlayerIsHuman = false;
      self.earthPlayerIsHuman = true;
    } else {
      self.skyPlayerIsHuman = true;
      self.earthPlayerIsHuman = false;
    }
  };
  self.displayBoard = function(){
    for(var i = 0; i < 4; i++)
      for(var j = 0; j < 3; j++)
        if(self.game.board[i][j])
          self.displayPiece(i, j, self.game.board[i][j]);
  };
  self.clearBoard = function(){
    for(var i = 0; i < 4; i++)
      for(var j = 0; j < 3; j++)
        if(self.game.board[i][j])
          self.clearPosition(i, j);
  };

  self.pieceImages = {
    'EarthLion': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/earthLion.png"></img>',
    'EarthGiraffe': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/earthGiraffe.png"></img>',
    'EarthElephant': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/earthElephant.png"></img>',
    'EarthChick': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/earthChick.png"></img>',
    'EarthHen': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/earthHen.png"></img>',
    'SkyLion': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/skyLion.png"></img>',
    'SkyGiraffe': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/skyGiraffe.png"></img>',
    'SkyElephant': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/skyElephant.png"></img>',
    'SkyChick': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/skyChick.png"></img>',
    'SkyHen': '<span class="helper"></span><img onmousedown="return false" class="centered" src="/images/skyHen.png"></img>'
  };

  self.displayPiece = function(i, j, piece){
    console.log('Entering ViewModel.displayPiece');
    console.log('Type: ' + self.pieceImages[piece.type]);
    var selector = '#' + i + j;
    $(selector).append(self.pieceImages[piece.type]);
    $(selector).click(function(){
      var moves = piece.owner.computeMoves(piece);
      console.log(JSON.stringify(moves));
      self.clearHighlightedPieces();
      self.highlightedPieces.push(selector);
      $(selector).toggleClass('highlighted-select');
    });
    console.log('Exiting ViewModel.displayPiece');
  };
  self.clearHighlightedPieces = function(){
    self.highlightedPieces.forEach(function(selector){
      $(selector).toggleClass('highlighted-select');
    });
    self.highlightedPieces = [];
  }
  self.clearPosition = function(i, j){
    console.log('Entering ViewModel.clearPosition');
    var selector = '#' + i + j;
    $(selector).empty();
    console.log('Exiting ViewModel.clearPosition');
  };

}
