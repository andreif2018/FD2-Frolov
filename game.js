"use strict";
class Game {
    constructor() {
        this.kickInterval = null;
        this.kickTimeout = null;
        this.goalInterval = null;
        this.goalTimeout = null;
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
        this.fieldController.start();
        this.goalKeeperController.start();
        this.playerController.start();
        this.ballController.start();
    }

    regularStateNoBall = function () {
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.fieldController.start();
        this.goalKeeperController.start();
        this.playerController.start();
    }

    kickStage = function () {
        var self = this;
        self.regularStateNoBall();
        self.ballController.kick();
        self.kickInterval = requestAnimationFrame( () => {self.kickStage();});
        self.kickTimeout = setTimeout(() => {
            cancelAnimationFrame(self.kickInterval);
        }, 600);
    }

    goalStage = function () {
        clearTimeout(this.kickTimeout);
        var self = this;
        self.goalInterval  = setInterval(() => {
            self.fieldController.goalStage();
            self.goalKeeperController.goalStage();
            self.ballController.goalStage();
            self.playerController.goalStage();
        }, 150)
        self.goalTimeout = setTimeout(() => {
            clearInterval(self.goalInterval);
            self.stopGoalStage();
            self.regularState();
        }, 2000);
    }

    stopGoalStage = function () {
        clearTimeout(this.goalTimeout);
    }
}

var g = new Game();
//g.regularState();
g.kickStage();
//g.goalStage();
