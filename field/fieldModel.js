"use strict";

class FieldModel {
    constructor(view) {
        this.view = view;
    }

    run = function () {
        this.view.drawField();
    }

    goalStage = function () {
        this.view.drawFieldShakeGrid();
    }
}