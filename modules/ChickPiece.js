'use strict';

module.exports = function(side, owner){

  var self = this;
  self.owner = owner;
  self.side = side;
  self.type = side == 'earth' ? 'EarthChick' : 'SkyChick';
  self.setPosition = function(x, y){
    self.x = x;
    self.y = y;
  };
  self.generateMoves = function(){
    return [{'x': self.x + (self.side == 'earth' ? -1 : 1), 'y': self.y}];
  };

}
