(function(){
var r=function(){var e="function"==typeof require&&require,r=function(i,o,u){o||(o=0);var n=r.resolve(i,o),t=r.m[o][n];if(!t&&e){if(t=e(n))return t}else if(t&&t.c&&(o=t.c,n=t.m,t=r.m[o][t.m],!t))throw new Error('failed to require "'+n+'" from '+o);if(!t)throw new Error('failed to require "'+i+'" from '+u);return t.exports||(t.exports={},t.call(t.exports,t,t.exports,r.relative(n,o))),t.exports};return r.resolve=function(e,n){var i=e,t=e+".js",o=e+"/index.js";return r.m[n][t]&&t?t:r.m[n][o]&&o?o:i},r.relative=function(e,t){return function(n){if("."!=n.charAt(0))return r(n,t,e);var o=e.split("/"),f=n.split("/");o.pop();for(var i=0;i<f.length;i++){var u=f[i];".."==u?o.pop():"."!=u&&o.push(u)}return r(o.join("/"),t,e)}},r}();r.m = [];
r.m[0] = {
"modules/Game.js": function(module, exports, require){
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

},
"modules/Piece.js": function(module, exports, require){

},
"modules/index.js": function(module, exports, require){
'use strict';

var Game = require('./Game.js'),
    ViewModel = require('./ViewModel.js'),
    Application = require('./Application.js'),
    UIElement = require('./UIElement.js'),
    UIElements = {
      'newGameElement': UIElement('newGameButton'),
      'playAgainstHumanElement': UIElement('playAgainstHumanButton'),
      'playAgainstComputerElement': UIElement('playAgainstComputerButton'),
      'switchSidesElement': UIElement('switchSidesButton')
    };

var app = new Application(Game, ViewModel, UIElements);

},
"modules/Player.js": function(module, exports, require){

},
"modules/HenPiece.js": function(module, exports, require){
'use strict';

module.exports = function(side){

  var self = this;
  self.type = side == 'earth' ? 'EarthHen' : 'SkyHen';

}

},
"modules/LionPiece.js": function(module, exports, require){
'use strict';

module.exports = function(side){

  var self = this;
  self.type = side == 'earth' ? 'EarthLion' : 'SkyLion';

}

},
"modules/UIElement.js": function(module, exports, require){
'use strict';

module.exports = function(elementId){
  var selector = '#' + elementId;
  return {
    'bind': function(callback){
      console.log('Entering UIElement.bind');
      $(selector).bind('click', callback);
      console.log('Exiting UIElement.bind');
    }
  }
}

},
"modules/ViewModel.js": function(module, exports, require){
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

},
"modules/ChickPiece.js": function(module, exports, require){
'use strict';

module.exports = function(side){

  var self = this;
  self.type = side == 'earth' ? 'EarthChick' : 'SkyChick';

}

},
"modules/Application.js": function(module, exports, require){
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

},
"modules/HumanPlayer.js": function(module, exports, require){
'use strict';

var LionPiece = require('./LionPiece'),
    GiraffePiece = require('./GiraffePiece'),
    ElephantPiece = require('./ElephantPiece'),
    ChickPiece = require('./ChickPiece'),
    HenPience = require('./HenPiece');

module.exports = function(position, game){

  var self = this;
  self.game = game;
  self.pieces = {
    'Lion': new LionPiece(position),
    'Giraffe': new GiraffePiece(position),
    'Elephant': new ElephantPiece(position),
    'Chick': new ChickPiece(position)
  };

  self.earthInitialization = function(){
    console.log('Entering HumanPlayer.earthInitialization');
    self.game.board[3][0] = self.pieces.Elephant;
    self.game.board[3][1] = self.pieces.Lion;
    self.game.board[3][2] = self.pieces.Giraffe;
    self.game.board[2][1] = self.pieces.Chick;
    console.log('Exiting HumanPlayer.earthInitialization');
  };

  self.skyInitialization = function(){
    console.log('Entering HumanPlayer.skyInitialization');
    self.game.board[0][0] = self.pieces.Giraffe;
    self.game.board[0][1] = self.pieces.Lion;
    self.game.board[0][2] = self.pieces.Elephant;
    self.game.board[1][1] = self.pieces.Chick;
    console.log('Exiting HumanPlayer.skyInitialization');
  };

  position == 'earth' ? self.earthInitialization() : self.skyInitialization();

  self.move = function(){
    console.log('Entering HumanPlayer.move');
    console.log('Exiting HumanPlayer.move');
  }

  self.validateUIMove = function(move){
    console.log('Entering HumanPlayer.validateUIMove');
    // If the move is valid.
    // Execute the move.
    // Call the next player to move.
    console.log('Exiting HumanPlayer.validateUIMove');
  }

}

},
"modules/GiraffePiece.js": function(module, exports, require){
'use strict';

module.exports = function(side){

  var self = this;
  self.type = side == 'earth' ? 'EarthGiraffe' : 'SkyGiraffe';

}

},
"modules/ElephantPiece.js": function(module, exports, require){
'use strict';

module.exports = function(side){

  var self = this;
  self.type = side == 'earth' ? 'EarthElephant' : 'SkyElephant';

}

}
};
App = r("modules/index.js");}());
