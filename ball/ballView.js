"use strict";

class BallView {

    constructor(container) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetLength = 600*this.zoom; // длина ворот
        this.targetHeight = 195*this.zoom; // высота вороот
        this.rightPost = this.targetX + this.targetLength;
        this.leftPost = this.targetX;
        this.upperPost = this.targetLineY + this.targetHeight;
        this.ballX = 800*this.zoom; // 11 метровая отметка по x;
        this.ballY = 580*this.zoom; // 11 метровая отметка по y
        this.img = new Image();
        this.speedX = -6; // 6 - недолетает, 7 отскакивает от штанги в ворота, 8 в штангу на вылет
        this.speedY = -12;
        this.scale = 0.165;
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
        this.ballX += this.speedX;// смещения мяча в полете по x
        this.ballY += this.speedY; // смещения мяча в полете по y
        this.ballRadius -= this.scale; // при отдалении мяча от пользователя радиус мяча уменьшается
        this.drawBall(this.ballX, this.ballY);
        // вылетел ли мяч правее правой штанги
        if ( this.ballX + this.ballRadius >= this.rightPost ) {
            this.speedX = -this.speedX;
            this.ballX = this.rightPost - this.ballRadius;
        }
        // вылетел ли мяч левее левой штанги
        if ( this.ballX - this.ballRadius <= this.leftPost ) {
            this.speedX = -this.speedX;
            this.ballX = this.leftPost + this.ballRadius;
        }
        // вылетел ли мяч выше перекладины
        // if ( this.ballY - this.ballRadius <= this.upperPost ) {
        //     this.speedY = -this.speedY;
        //     this.ballY = this.ballRadius;
        // }


    }

    ballInTarget = function () {

    }

    ballOutTarget = function () {

    }

}