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
  self.maxDepth = 5;
  self.winningMove = false;
  if(self.position == 'sky'){
    self.mentalSelf = self.mentalGame.skyPlayer;
    self.mentalOpponent = self.mentalGame.earthPlayer;
  } else {
    self.mentalSelf = self.mentalGame.earthPlayer;
    self.mentalOpponent = self.mentalGame.skyPlayer;
  }
  self.mentalGame.startGame();

  self.eventCallbacks = {
    'gameOver': function(player){
      self.winningMove = true;
    },
    'skyPlayerMove': function(){},
    'earthPlayerMove': function(){}
  };
  self.notify = function(evt, data){
    self.eventCallbacks[evt](data);
  };
  self.mentalGame.registerObserver(self);

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
    self.game.board[3][0] = self.pieces[2];   // Set the Elephant's position.
    self.game.board[3][1] = self.pieces[0];   // Set the Lion's position.
    self.game.board[3][2] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[2][1] = self.pieces[3];   // Set the Chick's position.

    self.pieces[2].setPosition(3, 0);
    self.pieces[0].setPosition(3, 1);
    self.pieces[1].setPosition(3, 2);
    self.pieces[3].setPosition(2, 1);

    self.lionPosition = {'x': 3, 'y': 1};
  };
  self.skyInitialization = function(){
    self.game.board[0][0] = self.pieces[1];  // Set the Giraffe's position.
    self.game.board[0][1] = self.pieces[0];     // Set the Lion's position.
    self.game.board[0][2] = self.pieces[2]; // Set the Elephant's position.
    self.game.board[1][1] = self.pieces[3];    // Set the Chick's position.

    self.pieces[1].setPosition(0, 0);
    self.pieces[0].setPosition(0, 1);
    self.pieces[2].setPosition(0, 2);
    self.pieces[3].setPosition(1, 1);

    self.lionPosition = {'x': 0, 'y': 1};
  };

  position == 'earth' ? self.earthInitialization() : self.skyInitialization();

  self.move = function(){
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
          //bench.splice(i, 1);
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
  }
  self.makeMove = function(piece, move){
    if(piece.type == 'EarthLion' || piece.type == 'SkyLion'){
      self.lionPosition = move;
    }
    self.game.executeMove(piece, move);
  }
  self.computeMoves = function(piece){
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
            if(game.board[move.x][move.y] != null){
            }
            moves.push(move);
          }
        });
      } else {
        // This is the Lion. We need to know for each possible move if:
        //    a) One of our own pieces blocks the move.
        //    b) If the tile to which we would move is threatened by another piece.
        var threatenedTiles = self.game.getThreatenedTiles();
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
    return moves;
  };
  self.removePiece = function(piece){
    for(var i = 0; i < self.pieces.length; i++){
      if(piece.type == self.pieces[i].type){ //&& piece.y == self.pieces[i].y){
        self.pieces.splice(i, 1);
        break;
      }
    }
  };
  self.addToBench = function(piece){
    var constructor = self.takenTypeToPiece[piece.type],
        newPiece = new constructor(self.position, self);
    newPiece.setPosition(-1, -1);
    self.bench.push(newPiece);
  };
  self.removeFromBench = function(piece){
    for(var i = 0; i < self.bench.length; i++){
      if(piece.type == self.bench[i].length){
        self.bench = self.bench.splice(i, 1);
        break;
      }
    }
    self.pieces.push(piece);
  }
  self.getBench = function(){
    return self.bench;
  }

  self.updateMentalGame = function(){

    if(self.game.history.length == 0){
      return;
    }

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
  }

  self.max = function(beta, curDepth){
    // Base case.
    if(curDepth == self.maxDepth){
      return {'score': self.staticEval(), 'moveInfo': null};
    }

    var memo = self.makeMentalMemo(self.position),
        mentalMoves = self.computeMentalMoves('self'),
        bestScore = -Infinity,
        bestMove = mentalMoves[0],
        moveProfile = null;

    for(var i = 0; i < mentalMoves.length; ++i){
      self.winningMove = false;
      self.mentalSelf.makeMove(mentalMoves[i].piece, mentalMoves[i].move);
      if(self.winningMove){
        self.restoreMentalState(memo);
        self.winningMove = false;
        return {'score': Infinity, 'moveInfo': mentalMoves[i]};
      }
      moveProfile = self.min(bestScore, curDepth + 1);
      self.restoreMentalState(memo);
      if(moveProfile.score > bestScore){
        bestScore = moveProfile.score;
        bestMove = mentalMoves[i];
      }
      if(bestScore > beta || bestScore == Infinity){
        return {'score': bestScore, 'moveInfo': bestMove };
      }
    }

    return {'score': bestScore, 'moveInfo': bestMove };

  }

  self.min = function(alpha, curDepth){
    // Base case.
    if(curDepth == self.maxDepth){
      return {'score': self.staticEval(), 'moveInfo': null};
    }

    var memo = self.makeMentalMemo(self.position == 'sky' ? 'earth' : 'sky'),
        bestScore = Infinity,
        bestMove = null,
        mentalMoves = self.computeMentalMoves('opponent'),
        moveProfile = null;

    for(var i = 0; i < mentalMoves.length; i++){
      self.winningMove = false;
      self.mentalOpponent.makeMove(mentalMoves[i].piece, mentalMoves[i].move);
      if(self.winningMove){
        self.restoreMentalState(memo);
        self.winningMove = false;
        return {'score': -Infinity, 'moveInfo': mentalMoves[i]};
      }
      moveProfile = self.max(bestScore, curDepth + 1);
      self.restoreMentalState(memo);
      if(moveProfile.score < bestScore){
        bestScore = moveProfile.score;
        bestMove = mentalMoves[i];
      }
      if(bestScore < alpha || bestScore == -Infinity){
        return {'score': bestScore, 'moveInfo': bestMove };
      }
    }

    return {'score': bestScore, 'moveInfo': bestMove };

  }

  self.makeMentalMemo = function(currPlayer){
    /* Return a memo of the mental game's current state */
    var memo = {
      'mentalSelf.lionPosition': self.mentalSelf.lionPosition,
      'mentalOpponent.lionPosition': self.mentalOpponent.lionPosition,
      'board': [
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ],
      'mentalSelf.pieces': [],
      'mentalOpponent.pieces': [],
      'mentalSelf.bench': self.mentalSelf.bench.concat(),
      'mentalOpponent.bench': self.mentalOpponent.bench.concat(),
      'currPlayer': currPlayer
    };
    for(var i = 0; i < 4; ++i){
      for(var j = 0; j < 3; ++j){
        memo['board'][i][j] = self.mentalGame.board[i][j];
      }
    }
    for(var i = 0; i < self.mentalSelf.pieces.length; ++i){
      memo['mentalSelf.pieces'].push(self.mentalSelf.pieces[i]);
    }
    for(var i = 0; i < self.mentalOpponent.pieces.length; ++i){
      memo['mentalOpponent.pieces'].push(self.mentalOpponent.pieces[i]);
    }
    return memo;
  }

  self.restoreMentalState = function(memo){
    // Restore the player's lion's position.
    self.mentalSelf.lionPosition = memo['mentalSelf.lionPosition'];
    self.mentalOpponent.lionPosition = memo['mentalOpponent.lionPosition'];
    // Restore the board state.
    for(var i = 0; i < 4; ++i){
      for(var j = 0; j < 3; ++j){
        self.mentalGame.board[i][j] = memo['board'][i][j];
        if(self.mentalGame.board[i][j]){
          self.mentalGame.board[i][j].setPosition(i, j);
        }
      }
    }
    // Restore the player's pieces.
    self.mentalSelf.pieces = memo['mentalSelf.pieces'].concat();
    self.mentalOpponent.pieces = memo['mentalOpponent.pieces'].concat();
    // Restore the player's benches.
    self.mentalSelf.bench = memo['mentalSelf.bench'].concat();
    for(var i = 0; i < self.mentalSelf.bench.length; ++i){
      self.mentalSelf.bench[i].setPosition(-1, -1);
    }
    self.mentalOpponent.bench = memo['mentalOpponent.bench'].concat();
    for(var i = 0; i < self.mentalOpponent.bench.length; ++i){
      self.mentalOpponent.bench[i].setPosition(-1, -1);
    }
    // Restore the current player.
    self.mentalGame.currPlayer = memo['currPlayer'];
    // Pop the last move off of the history.
    self.mentalGame.history.pop();
  }

  self.staticEval = function(){
    // Parameters of the static evaluation function.
    var alpha = 1,
        beta = 1,
        gamma = 5,
        delta = 5;

    // Local variables to be used in the computation.
    var score = 0,
        selfMoves = self.computeMentalMoves('self'),
        numSelfMoves = selfMoves.length,
        opponentMoves = self.computeMentalMoves('opponent'),
        numOpponentMoves = opponentMoves.length,
        counter = 0,
        x,
        y,
        i;

    // Having more pieces is better.
    score += alpha*(self.mentalSelf.pieces.length + self.mentalSelf.bench.length);
    // Having more moves available than your opponent is better.
    score += beta*(numSelfMoves - numOpponentMoves);
    // Threatening the opponent's pieces is good.
    for(i = 0; i < numSelfMoves; ++i){
      x = selfMoves[i].move.x;
      y = selfMoves[i].move.y;
      if(self.mentalGame.board[x][y] &&
         self.mentalGame.board[x][y].owner == self.mentalOpponent){
        ++counter;
      }
    }
    score += gamma*counter;
    // Having your pieces threated is bad.
    counter = 0;
    for(i = 0; i < numOpponentMoves; ++i){
      x = opponentMoves[i].move.x;
      y = opponentMoves[i].move.y;
      if(self.mentalGame.board[x][y] &&
         self.mentalGame.board[x][y].owner == self.mentalSelf){
        ++counter;
      }
    }
    score -= gamma*counter;
    // Protecting your pieces is good.
    counter = 0;
    for(i = 0; i < numSelfMoves; ++i){
      x = selfMoves[i].move.x;
      y = selfMoves[i].move.y;
      if(self.mentalGame.board[x][y] &&
         self.mentalGame.board[x][y].owner == self.mentalSelf){
        ++counter;
      }
    }
    score += delta*counter;

    return score;
  }

  self.computeMentalMoves = function(mentalPlayer){
    var moves = [],
        player = (mentalPlayer == 'self') ? self.mentalSelf : self.mentalOpponent,
        pieces = player.pieces.concat(player.bench),
        pieceMoves = null;

    if(player.inCheck){
      pieceMoves = player.computeMoves(player.lion);
      for(var i = 0; i < pieceMoves.length; ++i){
        moves.push({
          'piece': player.lion,
          'move': pieceMoves[i],
          'prevPos': {'x': player.lion.x, 'y': player.lion.y}
        })
      }
      for(var i = 0; i < pieces.length; ++i){
        if(pieces[i].type == 'EarthLion' || pieces[i].type == 'SkyLion'){
          continue;
        }
        pieceMoves = player.computeMoves(pieces[i]);
        for(var j = 0; j < pieceMoves.length; ++j){
          if(pieceMoves[j].x == player.attackingPosition.x &&
             pieceMoves[j].y == player.attackingPosition.y){
            moves.push({
              'piece': pieces[i],
              'move': pieceMoves[j],
              'prevPos': {'x': pieces[i].x, 'y': pieces[i].y}
            });
          }
        }
      }
    } else {
      for(var i = 0; i < pieces.length; ++i){
        pieceMoves = player.computeMoves(pieces[i]);
        for(var j = 0; j < pieceMoves.length; ++j){
          moves.push({
            'piece': pieces[i],
            'move': pieceMoves[j],
            'prevPos': {'x': pieces[i].x, 'y': pieces[i].y}
          });
        }
      }
    }

    return moves;
  }

}
