"use strict";

class FieldModel {
    constructor(view) {
        this.view = view;
    }

    start = function () {
        this.view.drawField();
    }

    goalStage = function () {
        this.view.drawFieldShakeGrid();
    }
}