"use strict";

class BallModel {
    constructor(view) {
        this.view = view;
    }

    start = function () {
        this.view.drawBall();
    }

    kick = function () {
        this.view.ballKick();
    }

    goalStage = function () {
        this.view.ballInTarget();
    }

    blockedStage = function () {
        this.view.ballBlocked();
    }


}