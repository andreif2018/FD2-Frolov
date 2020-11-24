"use strict";

var container = document.getElementById("container");
var ctx = container.getContext('2d');
var fieldView = new FieldView(container);
var fieldModel = new FieldModel(fieldView);
var fieldController = new FieldController(fieldModel, fieldView);

var goalKeeperView = new PlayerView(container, "goalKeeper");
var goalKeeperModel = new PlayerModel(goalKeeperView);
var goalKeeperController = new PlayerController(goalKeeperModel, goalKeeperView);

var playerView = new PlayerView(container, "player");
var playerModel = new PlayerModel(playerView);
var playerController = new PlayerController(playerModel, playerView);

var regularState = function () {
    ctx.clearRect(0, 0, container.width, container.height);
    fieldController.run();
    goalKeeperController.run();
    playerController.run();
}

var goalStage = function () {
        fieldController.model.goalStage();
        goalKeeperController.model.goalStage();
        playerController.model.goalStage();
}
goalStage();
var timeout = setTimeout( () => {regularState();}, 2500);

// clearTimeout(timeout);

