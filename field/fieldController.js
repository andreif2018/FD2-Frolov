"use strict";

class FieldController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    start = function () {
        this.model.start();
    }

    goalStage = function () {
        this.model.goalStage();
    }

}
