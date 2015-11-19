'use strict';

module.exports = function(side, owner){

  console.log('Entering HenPiece constructor');
  var self = this;
  self.owner = owner;
  self.side = side;
  self.type = side == 'earth' ? 'EarthHen' : 'SkyHen';
  self.setPosition = function(x, y){
    self.x = x;
    self.y = y;
  };
  self.generateMoves = function(){
    var moves;
    if(self.side == 'earth'){
      moves = [
        {'x': self.x - 1, 'y': self.y},
        {'x': self.x - 1, 'y': self.y - 1},
        {'x': self.x - 1, 'y': self.y + 1},
        {'x': self.x, 'y':self.y - 1},
        {'x': self.x, 'y':self.y + 1},
        {'x': self.x + 1, 'y': self.y}
      ]
    } else {
      // This is a sky Hen.
      moves = [
        {'x': self.x + 1, 'y': self.y},
        {'x': self.x + 1, 'y': self.y + 1},
        {'x': self.x + 1, 'y': self.y - 1},
        {'x': self.x, 'y':self.y + 1},
        {'x': self.x, 'y':self.y - 1},
        {'x': self.x - 1, 'y': self.y}
      ]
    }
    return moves;
  };
  console.log('Exiting HenPiece constructor');

}
