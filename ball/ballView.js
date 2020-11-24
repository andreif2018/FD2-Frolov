"use strict";

class PlayerView {
    constructor(container) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetLength = 600*this.zoom; // длина ворот
        this.penaltyPointX = 800*this.zoom; // 11 метровая отметка по x
        this.penaltyPointY = 600*this.zoom; // 11 метровая отметка по y
    }

    drawBallJump = function () {

    }

    drawBall = function (goal) {
        if (goal) {
        }
        else {
        }
        this.drawHead();
    }

}