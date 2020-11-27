"use strict";

class PlayerModel {
    constructor(view) {
        this.view = view;
    }

    start = function () {
        this.view.drawPlayer(false);
        var randomSpeed = this.getRandomSpeedDirection();
        this.view.speedX = randomSpeed[0];
        this.view.speedY = randomSpeed[1];
    }

    goalStage = function () {
        this.view.speedX = 0;
        this.view.drawPlayer(true);
    }

    kickStage = function () {
        this.view.drawPlayer(false);
    }

    getRandomSpeedDirection = function () { // возвращает случайную пару скоростей по X и Y
        var resultHash = {
            0: [-this.view.speedX, -this.view.speedY],
            1: [-this.view.speedX, this.view.speedY],
            2: [this.view.speedX, -this.view.speedY],
            3: [this.view.speedX, this.view.speedY],
        }
        return resultHash[Math.floor(Math.random() * (3 + 1))];
    }
}