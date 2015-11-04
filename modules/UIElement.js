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
