"use strict";

class PlayerModel { /* Model start */

    constructor(view, role) {
        this.view = view;
        this.interval = null;
        this.timeout = null;
    }

    start = function () {
        this.view.drawPlayer();
    }

    goalStage = function () {
        var self = this;
        this.view.drawPlayer();
        self.interval  = setInterval(() => { self.view.drawPlayer();}, 25)
        setTimeout(() => {
            clearInterval(self.interval);
            self.start();
        }, 2000);
    }

    stopGoalStage = function () {
        clearTimeout(this.timeout);
    }

    handsUp = function () {
        var self = this;
        self.view.handsUp();
        setTimeout(() => { self.start();}, 4000);
    }

    handsDown = function () {
        this.view.drawPlayer();
        clearTimeout(this.timeout);
    }
}