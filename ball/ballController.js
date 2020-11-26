"use strict";

class BallController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    start = function () {
        this.model.start();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') this.view.speedX = -7*this.view.zoom;
            else if (event.key === 'ArrowRight') this.view.speedX = 7*this.view.zoom;
            console.log("qweqweqweqwwe");
        }, false);
        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft') this.view.speedX = 0;
            else if (event.key === 'ArrowRight') this.view.speedX = 0;
        }, false);
    }

    kick = function () {
        this.model.kick();
    }

    goalStage = function () {
        this.model.goalStage();
    }
}
