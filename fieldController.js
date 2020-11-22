"use strict";

/* Controller start */
class FieldController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    start = function() {
        this.view.drawField();
        console.log(this.model);
    }
}/* Controller end */
