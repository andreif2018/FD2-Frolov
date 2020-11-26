"use strict";

class BallController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        document.addEventListener('keydown', this.keyDownHandler, false);
        document.addEventListener('keyup', this.keyUpHandler, false);
    }

    start = function () {
        this.model.start();
    }

    kick = function () {
        this.model.kick();
    }

    goalStage = function () {
        this.model.goalStage();
    }

    keyDownHandler = function (event) {
        // if (event.key === 'ArrowUp') rightRacquetH.speedY = -3;
        // else if (event.key === 'ArrowDown') rightRacquetH.speedY = 3;
    }

    keyUpHandler = function (event) {
        if (event.key === 'Space') console.log("space");
        // if (event.key === 'ArrowUp') rightRacquetH.speedY = 0;
        // else if (event.key === 'ArrowDown') rightRacquetH.speedY = 0;
    }
}
