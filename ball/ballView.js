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
        this.img = new Image();
        this.speedX = 0;
        this.speedY = 0;
        this.scaleX = 0;
        this.scaleY = 0;
        this.ballWidth = 40;// original image size 40x40
        this.ballHeight = 40;
    }

    drawBall = function (x = this.ballX, y = this.ballY, width = this.ballWidth, height = this.ballHeight) {
        // this.img.onload = () => {this.ctx.drawImage(this.img, x, y, width, height);}
        // this.img.src = 'ball/ball3.png';
        // console.log(this.img.width, this.img.height);

        this.ctx.fillStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI*2);
        this.ctx.fill();
    }

    ballKick = function () {
        this.speedX += 10;
        this.speedY += 10;
        this.scaleX -= 0;
        this.scaleY -= 0;
        console.log(this.speedX, this.speedY);
        this.drawBall(this.ballX + this.speedX, this.ballY - this.speedY, this.ballWidth + this.scaleX, this.ballHeight + this.scaleY);
    }

    ballInTarget = function () {

    }

    ballOutTarget = function () {

    }

}