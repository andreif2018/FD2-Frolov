"use strict";

var container = document.getElementById("container");
var fieldView = new FieldView(container);
var fieldModel = new FieldModel(fieldView);
var fieldController = new FieldController(fieldModel, fieldView);
fieldController.start();
//fieldController.model.goalStage();
//fieldController.model.stopGoalStage();

var playerView = new PlayerView(container);
var playerModel = new PlayerModel(playerView);
var playerController = new PlayerController(playerModel, playerView);

playerController.start();