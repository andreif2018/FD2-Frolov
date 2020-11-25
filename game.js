"use strict";
class Game {
    constructor() {
        this.interval = null;
        this.timeout = null;
    }

    regularState = function () {
        ctx.clearRect(0, 0, container.width, container.height);
        fieldController.run();
        goalKeeperController.run();
        playerController.run();
        ballController.run();
    }

    goalStage = function () {
        var self = this;
        this.regularState();
        self.interval  = setInterval(() => {
            fieldController.model.goalStage();
            goalKeeperController.model.goalStage();
            playerController.model.goalStage();
        }, 150)
        this.timeout = setTimeout(() => {
            clearInterval(self.interval);
            self.stopGoalStage();
        }, 2000);
    }

    stopGoalStage = function () {
        clearTimeout(this.timeout);
    }
}
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

var ballView = new BallView(container);
var ballModel = new BallModel(ballView);
var ballController = new BallController(ballModel, ballView);

var g = new Game();
g.regularState();
g.goalStage();
