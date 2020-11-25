"use strict";

class FieldController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    run = function () {
        this.model.run();
    }

    goalStage = function () {
        this.model.goalStage();
    }

}
