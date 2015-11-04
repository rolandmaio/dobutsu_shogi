'use strict';

var Game = require('./game/Game.js'),
    ViewModel = require('./viewmodel/ViewModel.js'),
    Application = require('Application.js'),
    UIElements = {
      
    };


var app = Application(Game, ViewModel);
