"use strict";

class BallView {

    constructor(container) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = this.getZoom();
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetLength = 600*this.zoom; // длина ворот
        this.targetHeight = 195*this.zoom; // высота вороот
        this.targetInternalGapY = 50*this.zoom//внутренний отступ от штанги до видимого горизонтального края сетки по Y
        this.postWidth = 14*this.zoom;// ширина линий ворот для использования в canvas
        this.rightPost = this.targetX + this.targetLength;
        this.leftPost = this.targetX;
        this.upperPost = this.targetLineY - this.targetHeight;
        this.accelX = 0;
        this.accelY = 0.1;
        this.frictK = 0.9; // во сколько раз теряется скорость при каждом смещении 0.9
        this.elastK = 0.8; // при отталкивании во сколько раз теряется скорост 0.8
    }

    getZoom = function () {
        var zoom;
        if (window.innerWidth < 760) zoom = 0.3;
        else if (window.innerWidth < 960) zoom = 0.5;
        else if (window.innerWidth < 1400) zoom = 0.75;
        else zoom = 1;
        return zoom;
    }

    start = function () {
        this.zoom = this.getZoom(); // для +/- разрешения экрана
        this.ballX = 800*this.zoom; // 11 метровая отметка по x;
        this.ballY = 580*this.zoom; // 11 метровая отметка по y
        this.ballRadius = 18*this.zoom;
        this.speedX = 0;
        this.speedY = -14*this.zoom;// 12- нижний угол, -14 верхний
        this.speedInTargetX = 50*this.zoom;
        this.speedInTargetY = -100*this.zoom;
        this.speedAfterBlockX = 15*this.zoom; // скорость при отскоке мяча от вратаря либо штанги
        this.speedAfterBlockY = -5*this.zoom;
    }

    drawBall = function (x = this.ballX, y = this.ballY) {
        var gradient = this.ctx.createRadialGradient(x + 5*this.zoom,y - 2*this.zoom,10*this.zoom, x, y,20*this.zoom);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(.1, 'azure');
        gradient.addColorStop(.9, 'lightgray');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.ballRadius, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "darkgray";
        this.ctx.ellipse(x, y, 7*this.zoom, 3*this.zoom, Math.PI/3, 0, 2*Math.PI);
        this.ctx.fill();
    }

    ballUpdate = function () {
        this.ballX += this.speedX;// смещения мяча в полете по x
        this.ballY += this.speedY; // смещения мяча в полете по y
    }

    ballUpdateAfterKick = function (speedX, speedY) {
        speedX *= this.frictK;
        speedX += this.accelX;
        this.ballX += speedX;// смещения мяча в полете по x

        speedY *= this.frictK;
        speedY += this.accelY;
        this.ballY += speedY; // смещения мяча в полете по y
    }

    ballKick = function () {
        this.ballUpdate();
        this.drawBall(this.ballX, this.ballY);
    }

    ballInTarget = function () {
        this.ballRadius = 14*this.zoom;
        this.ballUpdateAfterKick(this.speedInTargetX, this.speedInTargetY);
        // вылетел ли мяч правее правой штанги
        if ( this.ballX + this.ballRadius >= this.rightPost - this.postWidth/2) {
            this.speedInTargetX = -this.speedInTargetX*this.elastK;
            this.ballX = this.rightPost - this.postWidth/2 - this.ballRadius;
        }
        // вылетел ли мяч левее левой штанги
        if ( this.ballX - this.ballRadius <= this.leftPost + this.postWidth/2 ) {
            this.speedInTargetX = -this.speedInTargetX*this.elastK;
            this.ballX = this.leftPost + this.postWidth/2 + this.ballRadius;
        }
        // вылетел ли мяч выше перекладины
        if ( this.ballY - this.ballRadius <= this.upperPost + this.postWidth/2) {
            this.speedInTargetY = -this.speedInTargetY*this.elastK;
            this.ballY = this.upperPost + this.postWidth + this.ballRadius;
        }
        // вылетел ли мяч ниже пола
        if ( this.ballY + this.ballRadius >= this.targetLineY - this.postWidth) {
            this.speedInTargetY = -this.speedInTargetY*this.elastK;
            this.ballY = this.targetLineY - this.postWidth - this.ballRadius;
        }
        this.drawBall(this.ballX, this.ballY);
    }

    ballBlocked = function () {
        this.ballUpdateAfterKick(this.speedAfterBlockX, this.speedAfterBlockY);
        this.drawBall(this.ballX, this.ballY);
    }

}