"use strict";

class FieldModel {
    constructor(view) {
        this.view = view;
        this.interval = null;
        this.timeout = null;
    }

    run = function () {
        this.view.drawField();
    }

    goalStage = function () {
        var self = this;
        self.view.drawFieldShakeGrid();
        self.interval  = setInterval(() => {self.view.drawFieldShakeGrid();}, 150)
        setTimeout(() => {
            clearInterval(self.interval);
            self.stopGoalStage();
            }, 2000);
    }

    stopGoalStage = function () {
        clearTimeout(this.timeout);
    }
}