"use strict";

class FieldModel { /* Model start */

    constructor(view) {
        this.view = view;
        this.interval = null;
        this.timeout = null;
    }

    start = function () {
        this.view.drawField();
    }

    goalStage = function () {
        var self = this;
        self.view.drawFieldShakeGrid();
        self.interval  = setInterval(() => { self.view.drawFieldShakeGrid();}, 100)
        setTimeout(() => {
            clearInterval(self.interval);
            self.start();
        }, 3000);
    }

    stopGoalStage = function () {
        clearTimeout(this.timeout);
    }
}