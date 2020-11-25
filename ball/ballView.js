"use strict";

class BallView {

    constructor(container) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetLength = 600*this.zoom; // длина ворот
        this.ballX = 800*this.zoom; // 11 метровая отметка по x;
        this.ballY = 580*this.zoom; // 11 метровая отметка по y
        this.img = new Image();
        this.speedX = 0;
        this.speedY = 0;
        this.scale = 0;
        this.ballRadius = 20;
    }

    drawBall = function (x = this.ballX, y = this.ballY) {
        // this.img.onload = () => {this.ctx.drawImage(this.img, x, y, width, height);}
        // this.img.src = 'ball/ball3.png';
        var gradient = this.ctx.createRadialGradient(x + 5*this.zoom,y - 2*this.zoom,10*this.zoom, x, y,20*this.zoom);
        gradient.addColorStop(0, 'azure');
        gradient.addColorStop(.1, 'ghostwhite');
        gradient.addColorStop(.9, 'darkseagreen');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.ballRadius + this.scale, 0, Math.PI*2); // this.scale // при отдалении мяча от пользователя радиус мяча уменьшается
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "darkgray";
        this.ctx.ellipse(x, y, 7*this.zoom, 3*this.zoom, Math.PI/3, 0, 2*Math.PI);
        this.ctx.fill();
    }

    ballKick = function () {
        // правый верхний угол
        this.speedX += 6;  // смещения мяча в полете по x
        this.speedY += 12; // смещения мяча в полете по y
        this.scale -= 0.165; // при отдалении мяча от пользователя радиус мяча уменьшается
        console.log(this.speedX, this.speedY);
        this.drawBall(this.ballX + this.speedX, this.ballY - this.speedY);
    }

    ballInTarget = function () {

    }

    ballOutTarget = function () {

    }

}