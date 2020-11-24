"use strict";

class BallModel {
    constructor(view) {
        this.view = view;
        this.interval = null;
        this.timeout = null;
    }

    run = function () {
        this.view.drawBall();
    }

    goalStage = function () {
        var self = this;
        self.view.drawBallJump();
        self.interval  = setInterval(() => {self.view.drawBallJump();}, 150)
        setTimeout(() => {
            clearInterval(self.interval);
            self.stopGoalStage();
            }, 2000);
    }

    stopGoalStage = function () {
        clearTimeout(this.timeout);
    }
}