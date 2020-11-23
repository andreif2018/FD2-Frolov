"use strict";

var container = document.getElementById("container");
var fieldView = new FieldView(container);
var fieldModel = new FieldModel(fieldView);
var fieldController = new FieldController(fieldModel, fieldView);
fieldController.start();
//fieldController.model.goalStage();
//fieldController.model.stopGoalStage();

var goalKeeperView = new PlayerView(container, "goalKeeper");
var goalKeeperModel = new PlayerModel(goalKeeperView, "goalKeeper");
var goalKeeperController = new PlayerController(goalKeeperModel, goalKeeperView);

goalKeeperController.start();