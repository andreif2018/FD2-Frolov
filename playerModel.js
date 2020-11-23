"use strict";

class PlayerModel { /* Model start */

    constructor(view, role) {
        this.view = view;
        this.interval = null;
        this.timeout = null;
        this.role = role;
    }

    start = function () {
        this.view.drawPlayer(this.role);
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