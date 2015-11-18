'use strict';

module.exports = function(side, owner){

  console.log('Entering LionPiece constructor.');
  var self = this;
  self.owner = owner;
  self.type = side == 'earth' ? 'EarthLion' : 'SkyLion';
  self.side = side;
  self.setPosition = function(x, y){
    self.x = x;
    self.y = y;
  };
  self.generateMoves = function(){
      return [ // Moves in clockwise order starting with 12 o'clock.
        {'x': self.x + 1, 'y': self.y},
        {'x': self.x + 1, 'y': self.y + 1},
        {'x': self.x, 'y': self.y + 1},
        {'x': self.x - 1, 'y': self.y + 1},
        {'x': self.x - 1, 'y': self.y},
        {'x': self.x - 1, 'y': self.y - 1},
        {'x': self.x, 'y': self.y - 1},
        {'x': self.x + 1, 'y': self.y - 1}
      ]
  };
  console.log('Exiting LionPiece constructor.');

}
