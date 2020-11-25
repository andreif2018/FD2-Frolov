"use strict";

class PlayerModel {
    constructor(view) {
        this.view = view;
        this.interval = null;
        this.timeout = null;
    }

    run = function () {
        this.view.drawPlayer(false);
    }

    goalStage = function () {
        var self = this;
        this.view.drawPlayer(true);
        self.interval  = setInterval(() => { self.view.drawPlayer(true);}, 0.05)
        this.timeout = setTimeout(() => {
            clearInterval(self.interval);
            self.stopGoalStage();
        }, 2000);
    }

    stopGoalStage = function () {
        clearTimeout(this.timeout);
    }
}