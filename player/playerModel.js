"use strict";

class PlayerModel {
    constructor(view) {
        this.view = view;
    }

    start = function () {
        this.view.drawPlayer(false);
    }

    goalStage = function () {
        this.view.drawPlayer(true);
    }

    kickStage = function () {
        this.view.speedX = -7;
        this.view.drawPlayer(false);
    }
}