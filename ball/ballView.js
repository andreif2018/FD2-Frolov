"use strict";

class BallView {
    constructor(container) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetLength = 600*this.zoom; // длина ворот
        this.ballX = 780*this.zoom; // 11 метровая отметка по x;
        this.ballY = 560*this.zoom; // 11 метровая отметка по y
    }

    drawBallJump = function () {

    }

    drawBall = function () {
        var img = new Image();   // Create new img element
        var self = this;
        img.onload = () => {self.ctx.drawImage(img, this.ballX, this.ballY);} // original image size 40x40
        img.src = 'ball/ball3.png';
        console.log(img.width, img.height);
    }

}