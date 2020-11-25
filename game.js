"use strict";
class Game {
    constructor() {
        this.interval = null;
        this.timeout = null;
        this.container = document.getElementById("container");
        this.ctx = this.container.getContext('2d');
        this.fieldView = new FieldView(this.container);
        this.fieldModel = new FieldModel(this.fieldView);
        this.fieldController = new FieldController(this.fieldModel, this.fieldView);

        this.goalKeeperView = new PlayerView(this.container, "goalKeeper");
        this.goalKeeperModel = new PlayerModel(this.goalKeeperView);
        this.goalKeeperController = new PlayerController(this.goalKeeperModel, this.goalKeeperView);

        this.playerView = new PlayerView(this.container, "player");
        this.playerModel = new PlayerModel(this.playerView);
        this.playerController = new PlayerController(this.playerModel, this.playerView);

        this.ballView = new BallView(this.container);
        this.ballModel = new BallModel(this.ballView);
        this.ballController = new BallController(this.ballModel, this.ballView);
    }

    regularState = function () {
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.fieldController.run();
        this.goalKeeperController.run();
        this.playerController.run();
        this.ballController.run();
    }

    goalStage = function () {
        var self = this;
        this.regularState();
        self.interval  = setInterval(() => {
            this.fieldController.model.goalStage();
            this.goalKeeperController.model.goalStage();
            this.playerController.model.goalStage();
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

var g = new Game();
g.regularState();
g.goalStage();
