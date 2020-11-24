"use strict";

class PlayerModel {
    constructor(view, role) {
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
        self.interval  = setInterval(() => { self.view.drawPlayer(true);}, 5)
        setTimeout(() => {
            clearInterval(self.interval);
            self.stopGoalStage();
        }, 2000);
    }

    stopGoalStage = function () {
        clearTimeout(this.timeout);
    }
}