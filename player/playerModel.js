"use strict";

class PlayerModel {
    constructor(view) {
        this.view = view;
    }

    run = function () {
        this.view.drawPlayer(false);
    }

    goalStage = function () {
        this.view.drawPlayer(true);
    }
}