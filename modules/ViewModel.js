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
      self.clearBoard();
      self.clearHighlightedPieces();
      self.clearHighlightedPossibleMoves();
      self.displayBoard();
      self.displayBenches();
      if(!self.earthPlayerIsHuman){
        return;
      }
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
    },
    'gameDraw': function(){
      for(var i = 0; i < 4; i++){
        for(var j = 0; j < 3; j++){
          var selector = self.makeSelector(i, j);
          $(selector).off('click');
        }
      }
      var msg = 'Game over! It\'s a draw!';
      alert(msg);
    }
  };
  self.newGame = function(game){
    self.game = game;
    self.game.registerObserver(self);
    self.clearBoard();
    self.displayBoard();
    self.computeEntities();
  }
  self.notify = function(evt, data){
    self.eventCallbacks[evt](data);
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
    var selector = '#' + i + j;
    $(selector).append(self.pieceImages[piece.type]);
    $(selector).click(function(){
      if(!(self.game.currPlayer == piece.owner.position)){
        return;
      }
      var moves = piece.owner.computeMoves(piece);
      self.clearHighlightedPossibleMoves();
      self.clearHighlightedBenchPieces();
      self.clearHighlightedPieces();
      self.highlightedSelectPieces.push(selector);
      $(selector).toggleClass('highlighted-select');
      self.highlightPossibleMoves(piece, moves);
    });
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
    var selector = self.makeSelector(i, j);
    $(selector).empty();
    $(selector).off('click');
  };
  self.makeSelector = function(i, j){
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
      $(html).click(function(){
        if(!(self.game.currPlayer == piece.owner.position)){
          return;
        }
        var moves = piece.owner.computeMoves(piece);
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
