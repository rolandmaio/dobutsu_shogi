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
