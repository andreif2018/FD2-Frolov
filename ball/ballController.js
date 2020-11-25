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
    }

    goalStage = function () {
        this.model.goalStage();
    }
}
