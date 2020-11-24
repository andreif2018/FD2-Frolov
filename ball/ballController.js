"use strict";

class BallController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    run = function () {
        this.model.run();
    }

}
