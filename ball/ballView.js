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
        this.targetInternalGapY = 50*this.zoom//внутренний отступ от штанги до видимого горизонтального края сетки по Y
        this.postWidth = 14*this.zoom;// ширина линий ворот для использования в canvas
        this.rightPost = this.targetX + this.targetLength;
        this.leftPost = this.targetX;
        this.upperPost = this.targetLineY - this.targetHeight;
        this.ballX = 800*this.zoom; // 11 метровая отметка по x;
        this.ballY = 580*this.zoom; // 11 метровая отметка по y
        this.img = new Image();
        this.speedX = 0; // 7 - попадает в ворота, 8 отскакивает в штангу, 9 в штангу на вылет
        this.speedY = -12; // 12- нижний угол, -14 верхний
        this.ballRadius = 18*this.zoom;
        this.accelX = 0;
        this.accelY = 0.1;
            // во сколько раз теряется скорость
        this.frictK = 0.9; // при каждом смещении 0.9
            // во сколько раз теряется скорость
        this.elastK = 0.8; // при отталкивании 0.8
        this.speedInTargetX = 50;
        this.speedInTargetY = -100;

        this.speedAfterBlockX = 50;
        this.speedAfterBlockY = 50;
    }

    start = function () {
        this.ballX = 800*this.zoom; // 11 метровая отметка по x;
        this.ballY = 580*this.zoom; // 11 метровая отметка по y
    }

    drawBall = function (x = this.ballX, y = this.ballY) {
        //'ball/ball3.png';
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
        this.ballRadius = 14;
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
        console.log(this.ballX, this.ballY);
    }

}