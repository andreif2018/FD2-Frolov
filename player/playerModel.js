"use strict";

class PlayerModel {
    constructor(view) {
        this.view = view;
        this.zoom = 1;
    }

    start = function () {
        this.view.start();
        this.view.angle = 1;// для анимации перемещения ног при смещеннии вратаря
        this.view.drawPlayer(false);
        if (this.view.role === "player") {
            this.view.speedX = 0;
            this.view.speedY = 0;
        }
        else {
            var randomSpeed = this.getRandomSpeedDirection();
            this.view.speedX = randomSpeed[0];
            this.view.speedY = randomSpeed[1];}
    }

    goalStage = function () {
        this.view.isKick = false;
        this.view.speedX = 0;
        this.view.speedY = 0;
        this.view.drawPlayer(true);
    }

    kickStage = function () {
        this.view.isKick = true;
        this.view.drawPlayer(false);
    }

    blockStage = function () {
        this.view.isKick = false;
        this.view.speedX = 0;
        this.view.speedY = 0;
        this.view.drawPlayer(false);
    }

    getRandomSpeedDirection = function () { // возвращает случайную пару скоростей по X и Y
        var resultHash = {
                0: [-3*this.zoom, 0.5*this.zoom/2],
                1: [0, 0],
                2: [3*this.zoom, 0],
                3: [3*this.zoom, 0.5*this.zoom/2],
            }
        return resultHash[Math.floor(Math.random() * (3 + 1))];
    }
}