"use strict";

var container = document.getElementById("container");

var fieldView = new FieldView(container);
var fieldModel = new FieldModel(fieldView);
var fieldController = new FieldController(fieldModel, fieldView);

var goalKeeperView = new PlayerView(container, "goalKeeper");
var goalKeeperModel = new PlayerModel(goalKeeperView);
var goalKeeperController = new PlayerController(goalKeeperModel, goalKeeperView);

var playerView = new PlayerView(container, "player");
var playerModel = new PlayerModel(playerView);
var playerController = new PlayerController(playerModel, playerView);


fieldController.start();
goalKeeperController.start();
playerController.start();

var goalStage = function () {
    fieldController.model.goalStage();
    goalKeeperController.model.goalStage();
    playerController.model.goalStage();
    fieldController.model.stopGoalStage();
    goalKeeperController.model.stopGoalStage();
    playerController.model.stopGoalStage();
}
goalStage();

