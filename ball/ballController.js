"use strict";

class BallController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    start = function () {
        this.model.start();
    }

    kick = function () {
        this.model.kick();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') this.view.speedX = -9*this.view.zoom;
            else if (event.key === 'ArrowRight') this.view.speedX = 9*this.view.zoom;
            if (event.key === 'ArrowUp') this.view.speedY = -15*this.view.zoom;
            else if (event.key === 'ArrowDown') this.view.speedY = -12*this.view.zoom;
        }, false);
        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowUp') this.view.speedY = -14*this.view.zoom;
            else if (event.key === 'ArrowDown') this.view.speedY = -14*this.view.zoom;
        }, false);
    }

    goalStage = function () {
        this.model.goalStage();
    }
}
