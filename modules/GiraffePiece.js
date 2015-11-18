'use strict';

module.exports = function(side, owner){

  console.log('Entering GiraffePiece constructor.');
  var self = this;
  self.type = side == 'earth' ? 'EarthGiraffe' : 'SkyGiraffe';
  self.owner = owner;
  self.side = side;
  self.setPosition = function(x, y){
    self.x = x;
    self.y = y;
  };
  self.generateMoves = function(){
    return [
      {'x': self.x + 1, 'y': self.y},
      {'x': self.x - 1, 'y': self.y},
      {'x': self.x, 'y': self.y + 1},
      {'x': self.x, 'y': self.y - 1}
    ]
  }
  console.log('Exiting GiraffePiece constructor.');

}
