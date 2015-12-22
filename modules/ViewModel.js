'use strict';

module.exports = function(){

  var self = this;
  self.highlightedSelectPieces = [];
  self.highlightedPossibleMovePieces = [];
  self.highlightedBenchPieces = [];
  self.game = null;
  self.eventCallbacks = {
    'skyPlayerMove': function(){
      self.clearBoard();
      self.clearHighlightedPieces();
      self.clearHighlightedPossibleMoves();
      self.displayBoard();
      self.displayBenches();
      if(!self.skyPlayerIsHuman){
        return;
      }
    },
    'earthPlayerMove': function(){
      console.log('Entering ViewModel.eventCallbacks.earthPlayerMove');
      self.clearBoard();
      self.clearHighlightedPieces();
      self.clearHighlightedPossibleMoves();
      self.displayBoard();
      self.displayBenches();
      if(!self.earthPlayerIsHuman){
        return;
      }
      console.log('Exiting ViewModel.eventCallbacks.earthPlayerMove');
    },
    'gameOver': function(player){
      for(var i = 0; i < 4; i++){
        for(var j = 0; j < 3; j++){
          var selector = self.makeSelector(i, j);
          $(selector).off('click');
        }
      }
      var msg = 'Game over! The ' + (player.position == 'earth' ? 'Sky' : 'Earth') + ' player wins!';
      alert(msg);
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
  self.notify = function(evt, data){
    console.log('Entering ViewModel.notify');
    self.eventCallbacks[evt](data);
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
      if(!(self.game.currPlayer == piece.owner.position)){
        return;
      }
      var moves = piece.owner.computeMoves(piece);
      console.log(JSON.stringify(moves));
      self.clearHighlightedPossibleMoves();
      self.clearHighlightedBenchPieces();
      self.clearHighlightedPieces();
      self.highlightedSelectPieces.push(selector);
      $(selector).toggleClass('highlighted-select');
      self.highlightPossibleMoves(piece, moves);
    });
    console.log('Exiting ViewModel.displayPiece');
  };
  self.highlightPossibleMoves = function(piece, moves){
    moves.forEach(function(move){
      var selector = self.makeSelector(move.x, move.y);
      $(selector).toggleClass('highlighted-possible');
      $(selector).click(function(){
        piece.owner.makeMove(piece, move);
      });
      self.highlightedPossibleMovePieces.push(selector);
    });
  };
  self.clearHighlightedPieces = function(){
    self.highlightedSelectPieces.forEach(function(selector){
      $(selector).toggleClass('highlighted-select');
    });
    self.highlightedSelectPieces = [];
  };
  self.clearHighlightedPossibleMoves = function(){
    self.highlightedPossibleMovePieces.forEach(function(selector){
      $(selector).toggleClass('highlighted-possible');
      $(selector).off('click');
    });
    self.highlightedPossibleMovePieces = [];
  };
  self.clearPosition = function(i, j){
    console.log('Entering ViewModel.clearPosition');
    var selector = self.makeSelector(i, j);
    console.log('clearing selector: ' + selector);
    $(selector).empty();
    $(selector).off('click');
    console.log('Exiting ViewModel.clearPosition');
  };
  self.makeSelector = function(i, j){
    console.log('Entering ViewModel.makeSelector');
    console.log('Exiting ViewModel.makeSelector');
    return '#' + i + j;
  };
  self.displayBenches = function(){
    $('#skyBench').empty();
    var skyBench = self.game.skyPlayer.getBench();
    skyBench.forEach(function(piece){
      var html = $(self.pieceImages[piece.type]),
          image = $(html).filter('img').get(0);
      $(html).click(function(){
        if(!(self.game.currPlayer == piece.owner.position)){
          return;
        }
        var moves = piece.owner.computeMoves(piece);
        console.log(JSON.stringify(moves));
        self.clearHighlightedPossibleMoves();
        self.clearHighlightedBenchPieces();
        self.clearHighlightedPieces();
        self.highlightPossibleMoves(piece, moves);
        self.highlightedBenchPieces.push(image);
        $(image).toggleClass('highlighted-bench');
      });
      $('#skyBench').append(html);
    });
    $('#earthBench').empty();
    var earthBench = self.game.earthPlayer.getBench();
    earthBench.forEach(function(piece){
      var html = $(self.pieceImages[piece.type]),
          image = $(html).filter('img').get(0);
      console.log('image: ' + image);
      $(html).click(function(){
        if(!(self.game.currPlayer == piece.owner.position)){
          return;
        }
        var moves = piece.owner.computeMoves(piece);
        console.log(JSON.stringify(moves));
        self.clearHighlightedPossibleMoves();
        self.clearHighlightedBenchPieces();
        self.clearHighlightedPieces();
        self.highlightedBenchPieces.push(image);
        $(image).toggleClass('highlighted-bench');
        self.highlightPossibleMoves(piece, moves);
      });
      $('#earthBench').append(html);
    });
  };
  self.clearHighlightedBenchPieces = function(){
    self.highlightedBenchPieces.forEach(function(selector){
      $(selector).toggleClass('highlighted-bench');
    });
    self.highlightedBenchPieces = [];
  };

}
