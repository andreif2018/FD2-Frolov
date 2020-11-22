"use strict";

class Field { /* View start */
    constructor(container) {
        this.container = container;
        this.containerID = this.container.getAttribute("id");
        this.ctx = this.container.getContext('2d');
        this.multiplier = 1;
        this.goalLineStartX = 0;
        this.goalLineY = 200*this.multiplier;
        this.targetX = 500*this.multiplier;
        this.targetLength = 600*this.multiplier;
        this.targetHeight = 195*this.multiplier;
        this.targetGap = 100*this.multiplier;
        this.fieldWidth = 1840*this.multiplier;
        this.fieldLineWidth = 5*this.multiplier;
        this.targetLineWidth = 12*this.multiplier;
        /* configuration end */
    }

    updateTime = function(currentTime) {
        this.createClock(currentTime.hh, currentTime.mm, currentTime.ss)
    }

    drawCircle = function(circleX, circleY, circleRadius, circleColor) {
        this.ctx.beginPath();
        this.ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = circleColor;
        this.ctx.fillStyle = circleColor;
        this.ctx.stroke();
        this.ctx.fill();
    }

    drawField = function() {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = this.fieldLineWidth
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(this.goalLineStartX, this.goalLineY);
        this.ctx.lineTo(this.fieldWidth, this.goalLineY); // линия ворот

        this.ctx.moveTo(this.targetX + this.targetLength + this.targetX, this.goalLineY);
        this.ctx.lineTo(this.fieldWidth, 320*this.multiplier);// линия штрафной у правого края поля

        /* вратарская start */
        this.ctx.moveTo(this.targetX - this.targetGap, this.goalLineY);
        this.ctx.lineTo(this.targetX - this.multiplier * 2 * this.targetGap, this.goalLineY + this.targetGap);
        this.ctx.lineTo(this.targetX + this.targetLength + this.multiplier * 2 * this.targetGap, this.goalLineY + this.targetGap);
        this.ctx.lineTo(this.targetX + this.targetLength + this.targetGap, this.goalLineY);
        this.ctx.stroke();
        /* вратарская finish */

        /* 11-метровая отметка start */
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(800, 600, 10, 5, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
        /* 11-метровая отметка finish */

        /* ворота start */
        this.ctx.lineWidth = this.targetLineWidth;
        this.ctx.strokeStyle = 'lightgrey';
        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX, this.goalLineY - 3 * this.multiplier);// 3 = закругления стоек ворот
        this.ctx.lineTo(this.targetX, this.goalLineY - this.targetHeight); //левая стойка
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX, this.goalLineY - this.targetHeight);
        this.ctx.lineTo(this.targetX + this.targetLength, this.goalLineY - this.targetHeight) // перекладина
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX + this.targetLength, this.goalLineY - 3 * this.multiplier );// 3 = закругления стоек ворот
        this.ctx.lineTo(this.targetX + this.targetLength, this.goalLineY - this.targetHeight);//правая стойка
        this.ctx.stroke();
        /* ворота finish */
    }

    posClockText = function(value, angleDeg) { // создает текстовые знаечения от 1 до 12 и помещает в зеленые круги
        var angle = angleDeg/180*Math.PI;
        if (value > 9) var shiftX = this.radius/15;
        else shiftX = this.radius/30;
        var elementCenterX = this.clockCenter + (this.radius - this.clockValueCircleGap)*Math.sin(angle) - shiftX;
        // с учетом отсупа от края окружности и shiftX центрирования по X в зеленом круге
        var elementCenterY = this.clockCenter + this.radiusClockValue/2 - (this.radius - this.clockValueCircleGap)*Math.cos(angle) - this.radius/50;
        // с учетом отсупа от края окружности и "- radius/50" центрирования по Y в зеленом круге
        this.ctx.font = this.radius/150 + 'em' + " serif";
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(value, elementCenterX, elementCenterY);// вывод в формате hh:mm:ss
        }
}

var f = new Field(document.getElementById("container"));
f.drawField();