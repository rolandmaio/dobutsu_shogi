'use strict';

var LionPiece = require('./LionPiece'),
    GiraffePiece = require('./GiraffePiece'),
    ElephantPiece = require('./ElephantPiece'),
    ChickPiece = require('./ChickPiece'),
    HenPiece = require('./HenPiece');

module.exports = function(position, game, Game){

  var self = this;
  self.position = position;
  self.game = game;

  self.mentalGame = new Game('versus human', 'sky');
  self.maxDepth = 1;
  if(self.position == 'sky'){
    self.mentalSelf = self.mentalGame.skyPlayer;
    self.mentalOpponent = self.mentalGame.earthPlayer;
  } else {
    self.mentalSelf = self.mentalGame.earthPlayer;
    self.mentalOpponent = self.mentalGame.skyPlayer;
  }
  self.mentalGame.startGame();

  self.bench = [];
  self.inCheck = false;
  self.attackingPosition = null;
  self.lionPosition = null;
  self.lion = new LionPiece(position, self);
  self.pieces = [
    self.lion,
    new GiraffePiece(position, self),
    new ElephantPiece(position, self),
    new ChickPiece(position, self)
  ];
  self.takenTypeToPiece = {
    'EarthChick': ChickPiece,
    'SkyChick': ChickPiece,
    'EarthGiraffe': GiraffePiece,
    'SkyGiraffe': GiraffePiece,
    'EarthElephant': ElephantPiece,
    'SkyElephant': ElephantPiece,
    'EarthHen': ChickPiece,
    'SkyHen': ChickPiece,
    'EarthLion': LionPiece,
    'SkyLion': LionPiece
  };

  self.earthInitialization = function(){
    console.log('Entering ComputerPlayer.earthInitialization');
    self.game.board[3][0] = self.pieces[2];   // Set the Elephant's position.
    self.game.board[3][1] = self.pieces[0];   // Set the Lion's position.
    self.game.board[3][2] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[2][1] = self.pieces[3];   // Set the Chick's position.

    self.pieces[2].setPosition(3, 0);
    self.pieces[0].setPosition(3, 1);
    self.pieces[1].setPosition(3, 2);
    self.pieces[3].setPosition(2, 1);

    self.lionPosition = {'x': 3, 'y': 1};
    console.log('Exiting ComputerPlayer.earthInitialization');
  };
  self.skyInitialization = function(){
    console.log('Entering ComputerPlayer.skyInitialization');
    self.game.board[0][0] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[0][1] = self.pieces[0];     // Set the Lion's position.
    self.game.board[0][2] = self.pieces[2]; // Set the Elephant's position.
    self.game.board[1][1] = self.pieces[3];    // Set the Chick's position.

    self.pieces[1].setPosition(0, 0);
    self.pieces[0].setPosition(0, 1);
    self.pieces[2].setPosition(0, 2);
    self.pieces[3].setPosition(1, 1);

    self.lionPosition = {'x': 0, 'y': 1};
    console.log('Exiting ComputerPlayer.skyInitialization');
  };

  position == 'earth' ? self.earthInitialization() : self.skyInitialization();

  self.move = function(){
    console.log('Entering ComputerPlayer.move');
    if(self.inCheck){
      var moves = [];
      self.pieces.forEach(function(piece){
        moves = moves.concat(self.computeMoves(piece));
      });
      if(moves.length == 0){
        self.game.notifyDefeat(self);
        return;
      }
    }
    self.updateMentalGame();
    var move = self.max(Infinity, 0);
    self.mentalSelf.makeMove(move.moveInfo.piece, move.moveInfo.move);
    var prevPos = move.moveInfo.prevPos,
        piece = null;
    // Check if this piece was moved on to the board from the bench.
    if(prevPos.x == -1 && prevPos.y == -1){
      var bench = self.bench,
          found = false;
      for(var i = 0; i < bench.length; ++i){
        if(bench[i].type == move.moveInfo.piece.type){
          piece = bench[i];
          bench.splice(i, 1);
          found = true;
          break;
        }
      }
      if(!found){
        throw 'ComputerPlayer.momve unable to find the piece that was moved in the UI game.';
      }
    } else {
      piece = self.game.board[prevPos.x][prevPos.y];
    }

    self.makeMove(piece, move.moveInfo.move);
    console.log('Exiting ComputerPlayer.move');
  }
  self.makeMove = function(piece, move){
    console.log('Entering ComputerPlayer.makeMove');
    console.log('piece: ' + piece);
    if(piece.type == 'EarthLion' || piece.type == 'SkyLion'){
      self.lionPosition = move;
    }
    self.game.executeMove(piece, move);
    console.log('Exiting ComputerPlayer.makeMove');
  }
  self.computeMoves = function(piece){
    console.log('Entering ComputerPlayer.computeMoves');
    var moves = [];
    if(self.inCheck){
      // If this is not the Lion, check if it can attack the attacker.
      if(!(piece.type == 'EarthLion' || piece.type == 'SkyLion')){
        piece.generateMoves().forEach(function(move){
          if(move.x == self.attackingPosition.x && move.y == self.attackingPosition.y){
            moves.push(move);
          }
        });
      } else {
        // This is the Lion. We need to know for each possible move if:
        //    a) One of our own pieces blocks the move.
        //    b) If the tile to which we would move is threatened by another piece.
        var threatenedTiles = self.game.getThreatenedTiles();
        console.log('threatenedTiles: ' + JSON.stringify(threatenedTiles));
        piece.generateMoves().forEach(function(move){
          if((0 <= move.x && move.x <= 3 && 0 <= move.y && move.y <= 2) &&
             (game.board[move.x][move.y] == null ||
              game.board[move.x][move.y].side != position)){

            for(var i = 0; i < threatenedTiles.length; ++i){
              if(threatenedTiles[i].x == move.x && threatenedTiles[i].y == move.y){
                return;
              }
            }
            moves.push(move);
          }
        });
      }
    } else {
      if(piece.x == -1 && piece.y == -1){
        // This is a benched piece.
        return game.openTiles();
      } else if(!(piece.type == 'EarthLion' || piece.type == 'SkyLion')){
        piece.generateMoves().forEach(function(move){
          if((0 <= move.x && move.x <= 3 && 0 <= move.y && move.y <= 2) &&
             (game.board[move.x][move.y] == null ||
              game.board[move.x][move.y].side != position)){
            console.log('game.board[move.x][move.y]: ' + game.board[move.x][move.y]);
            if(game.board[move.x][move.y] != null){
              console.log('game.board[move.x][move.y] side: ' + game.board[move.x][move.y].side);
            }
            moves.push(move);
          }
        });
      } else {
        // This is the Lion. We need to know for each possible move if:
        //    a) One of our own pieces blocks the move.
        //    b) If the tile to which we would move is threatened by another piece.
        var threatenedTiles = self.game.getThreatenedTiles();
        console.log('threatenedTiles: ' + JSON.stringify(threatenedTiles));
        piece.generateMoves().forEach(function(move){
          if((0 <= move.x && move.x <= 3 && 0 <= move.y && move.y <= 2) &&
             (game.board[move.x][move.y] == null ||
              game.board[move.x][move.y].side != position)){

            for(var i = 0; i < threatenedTiles.length; ++i){
              if(threatenedTiles[i].x == move.x && threatenedTiles[i].y == move.y){
                return;
              }
            }
            moves.push(move);
          }
        });
      }
    }
    console.log('Exiting ComputerPlayer.computeMoves');
    return moves;
  };
  self.removePiece = function(piece){
    console.log('Entering ComputerPlayer.removePiece');
    console.log('self.pieces.length before: ' + self.pieces.length);
    for(var i = 0; i < self.pieces.length; i++){
      if(piece.type == self.pieces[i].type){ //&& piece.y == self.pieces[i].y){
        self.pieces.splice(i, 1);
        break;
      }
    }
    console.log('self.pieces.length after: ' + self.pieces.length);
    console.log('Exiting ComputerPlayer.removePiece');
  };
  self.addToBench = function(piece){
    console.log('Entering ComputerPlayer.addToBench');
    var constructor = self.takenTypeToPiece[piece.type],
        newPiece = new constructor(self.position, self);
    newPiece.setPosition(-1, -1);
    self.bench.push(newPiece);
    console.log('Exiting ComputerPlayer.addToBench');
  };
  self.removeFromBench = function(piece){
    console.log('Entering ComputerPlayer.removeFromBench');
    for(var i = 0; i < self.bench.length; i++){
      if(piece.type == self.bench[i].length){
        self.bench = self.bench.splice(i, 1);
        break;
      }
    }
    self.pieces.push(piece);
    console.log('Exiting ComputerPlayer.removeFromBench');
  }
  self.getBench = function(){
    return self.bench;
  }

  self.updateMentalGame = function(){
    console.log('Entering ComputerPlayer.updateMentalGame');
    var lastMove = self.game.history[self.game.history.length - 1],
        piece = null;

    if(lastMove.prevPos.x == -1 && lastMove.prevPos.y == -1){

      var bench = self.mentalOpponent.bench,
          found = false;
      for(var i = 0; i < bench.length; ++i){
        if(bench[i].type == lastMove['piece.type']){
          piece = bench[i];
          bench.splice(i, 1);
          found = true;
          break;
        }
      }
      if(!found){
        throw 'updateMentalGame unable to find the piece that was moved in the UI game.';
      }

    } else {
      piece = self.mentalGame.board[lastMove.prevPos.x][lastMove.prevPos.y];
    }
    self.mentalOpponent.makeMove(piece, lastMove.move);
    /*
    for(var i = 0; i < 4; i++){
      for(var j = 0; j < 3; j++){
        if(self.mentalGame.board[i][j] &&
           self.mentalGame.board[i][j].type == lastMove['piece.type']){
          var piece = self.mentalGame.board[i][j];
          self.mentalOpponent.makeMove(piece, lastMove.move);
        }
      }
    }
    */
    console.log('Exiting ComputerPlayer.updateMentalGame');
  }

  self.max = function(beta, curDepth){
    console.log('Entering ComputerPlayer.max');
    console.log('beta: ' + beta + ' curDepth: ' + curDepth);
    /* DO NOT DELETE
    if(curDepth == self.maxDepth){
      return {'score': self.staticEval(), 'moveInfo': null};
    }
    var memo = self.makeMentalMemo(),
        bestScore = -Infinity,
        bestMove = null;
    */

    var mentalMoves = self.computeMentalMoves('self'),
        moveProfile = null;

    for(var i = 0; i < mentalMoves.length; ++i){
      console.log(mentalMoves[i].piece.type + ' ' + JSON.stringify(mentalMoves[i].move));
    }
    // TEMP TO TEST
    var randomMove = mentalMoves[Math.floor(Math.random()*mentalMoves.length)];
    return {'score': 0, 'moveInfo': randomMove};

    /*
    for(var i = 0; i < mentalMoves.length; ++i){
      self.mentalSelf.makeMove(mentalMoves[i].piece, mentalMoves[i].move);
      moveProfile = self.min(bestScore, curDepth + 1);
      if(moveProfile.score > bestScore){
        bestScore = moveProfile.score;
        bestMove = mentalMoves[i];
      }
      if(bestScore > beta){
        return {'score': bestScore, 'move': bestMove };
      }
      self.restoreMentalState(memo);
    }

    return {'score': bestScore, 'moveInfo': bestMove };
    */

  }

  self.min = function(alpha, curDepth){
    if(curDepth == self.maxDepth){
      return self.staticEval();
    }
    var memo = self.makeMentalMemo(),
        bestScore = Infinity,
        bestMove = null;

    var mentalMoves = self.computeMentalMoves('opponent'),
        moveProfile = null;
    for(var i = 0; i < mentalMoves.length; i++){
      self.mentalOpponent.makeMove(mentalMoves[i].piece, mentalMoves[i].move);
      moveProfile = self.max(bestScore, curDepth + 1);
      if(moveProfile.score < bestScore){
        bestScore = moveProfile.score;
        bestMove = mentalMoves[i];
      }
      if(bestScore < alpha){
        return {'score': bestScore, 'move': bestMove };
      }
      self.restoreMentalState(memo);
    }

    return {'score': bestScore, 'move': bestMove };

  }

  self.makeMentalMemo = function(){
    /* Return a memo of the mental game's current state */
    // TODO
    return {};
  }

  self.restoreMentalState = function(memo){
    // TODO
  }

  self.staticEval = function(){
    // TODO
    return 10;
  }

  self.computeMentalMoves = function(mentalPlayer){
    console.log('Entering ComputerPlayer.computeMentalMoves');
    var moves = [],
        player = (mentalPlayer == 'self') ? self.mentalSelf : self.mentalOpponent,
        pieces = player.pieces.concat(player.bench);
    for(var i = 0; i < pieces.length; ++i){
      var pieceMoves = player.computeMoves(pieces[i]);
      for(var j = 0; j < pieceMoves.length; ++j){
        moves.push({'piece': pieces[i], 'move': pieceMoves[j],
                    'prevPos': {'x': pieces[i].x, 'y': pieces[i].y}});
      }
    }
    console.log('Exiting ComputerPlayer.computeMentalMoves');
    return moves;
  }

}
