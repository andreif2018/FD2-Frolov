"use strict";

class PlayerView { /* View start */
    constructor(container, role) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.targetLineStartX = 0; // линия ворот с началом у левого края поля
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLength = 600*this.zoom; // длина ворот
        this.targetHeight = 195*this.zoom; // высота вороот
        this.targetGap = 100*this.zoom; // отступ от штанги до боковой линии вратарской площади
        this.fieldWidth = 1840*this.zoom; // ширина видимой части поля
        this.fieldLineWidth = 5*this.zoom; // ширина линий разметки поля для использования в canvas
        this.targetLineWidth = 14*this.zoom;// ширина линий ворот для использования в canvas
        this.targetInternalGapX = 20;//внутренний отступ от штанги до видимого горизонтального края сетки по X
        this.targetInternalGapY = 50;//внутренний отступ от штанги до видимого горизонтального края сетки по Y
        this.cellRadius = 20 * this.zoom/2; // радиус ячейки в сетке ворот
        this.cellStep = 20 * this.zoom; // длина ячейки в сетке ворот
        this.ctx.lineCap = "round";
        this.gridColor_1 = "darkgray";
        this.gridColor_2 = "lightgray";
        this.shift = 1;

        this.role = role;
        this.legWidth = 20 * this.zoom;
        this.legHeight = 60 * this.zoom;
        this.bodyWidth = 40 * this.zoom;
        this.bodyHeight = 50 * this.zoom;
        this.bodyX = this.targetX + this.targetLength/2 - this.bodyWidth/2; //центр ворот
        this.bodyY = this.targetLineY - this.legHeight - this.bodyHeight;
        this.neckWidth = 15*this.zoom;
        this.neckHeight = 5*this.zoom;
        this.neckX = this.bodyX + this.bodyWidth/2;
        this.neckY = this.bodyY - this.neckHeight;
        this.headWidth = 25*this.zoom;
        this.headHeight = 10*this.zoom;
        this.headX = this.bodyX + this.bodyWidth/2;
        this.headY = this.neckY - this.headHeight;
    }

    drawRoundedRect = function(x , y, width, height, radius, color) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
        return this;
    }

    drawBody = function(color) {
        this.drawRoundedRect(this.bodyX, this.bodyY, this.bodyWidth, this.bodyHeight, 15*this.zoom, color); //10-radius закругления плечей
        var gradient = this.ctx.createRadialGradient(
            this.bodyX+20, this.bodyY+20, 5*this.zoom, // 5 - радиус внутрееннго круга
                this.bodyX, this.bodyY, 10*this.zoom // 10-радиус внешнего круга
            );
        gradient.addColorStop(0.75, '#F08A37');// цвет узора на футболке
        gradient.addColorStop(1, color);// цвет футболки
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.bodyX + 10*this.zoom, this.bodyY, this.bodyWidth, this.bodyHeight);//10-radius закругления плечей
    }

    drawNeck = function() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.neckX, this.neckY);
        this.ctx.lineTo(this.neckX, this.neckY + this.neckHeight);
        this.ctx.strokeStyle = '#DBB97F';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.neckWidth;
        this.ctx.stroke();
    }

    drawHead = function() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.headX, this.headY);
        this.ctx.lineTo(this.headX, this.headY);
        this.ctx.strokeStyle = '#DBB97F';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.headWidth;
        this.ctx.stroke();
        this.ctx.beginPath();
        // черты лица в ellipse
        this.ctx.ellipse(this.headX-this.zoom*6, this.headY - this.zoom*2,// левый глаз
            this.zoom*2, this.zoom, 0, 0, 2 * Math.PI);
        this.ctx.ellipse(this.headX+this.zoom*6, this.headY - this.zoom*2,// правый глаз
            this.zoom*2, this.zoom, 0, 0, 2 * Math.PI);
        this.ctx.fillStyle = "steelblue";
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(this.headX, this.headY+5*this.zoom,// рот
            this.zoom*4, this.zoom, 0, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#AB5434";
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(this.headX, this.headY - 10*this.zoom,// волосы
            this.headWidth/3, this.headHeight/3, 0, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#4A423A";
        this.ctx.fill();
    }

    // drawGoalKeeperArea = function () { // вратарская площадь
    //     this.ctx.lineWidth = this.fieldLineWidth;
    //     this.ctx.strokeStyle = 'white';
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(this.targetX - this.targetGap, this.goalLineY);
    //     this.ctx.lineTo(this.targetX - this.zoom * 2 * this.targetGap, this.goalLineY + this.targetGap);
    //     this.ctx.lineTo(this.targetX + this.targetLength + this.zoom * 2 * this.targetGap, this.goalLineY + this.targetGap);
    //     this.ctx.lineTo(this.targetX + this.targetLength + this.targetGap, this.goalLineY);
    //     this.ctx.stroke();
    //
    //     // создание градиента для области вытоптанной вратарем
    //     var gradient = this.ctx.createRadialGradient(
    //         this.targetX + this.targetLength/2, this.goalLineY + this.targetGap/2, 10*this.zoom, // 10 радиус внутрееннго круга
    //         this.targetX + this.targetLength/2, this.goalLineY + this.targetGap/2, 35*this.zoom // 35 радиус внешнего круга
    //     );
    //     gradient.addColorStop(0.1, 'darkolivegreen');// цвет внутрееннго круга
    //     gradient.addColorStop(1, 'seagreen');// цвет внешнего круга
    //     this.ctx.fillStyle = gradient;
    //     this.ctx.fillRect(this.targetX + this.targetLength/2.5*this.zoom, this.goalLineY + this.targetLineWidth,
    //         this.targetGap, this.targetGap/1.25*this.zoom);
    // }
    //
    // drawPenaltyPoint = function() { // 11-метровая отметка
    //     this.ctx.lineWidth = this.fieldLineWidth;
    //     this.ctx.fillStyle = 'white';
    //     this.ctx.strokeStyle = 'white';
    //     this.ctx.beginPath();
    //     this.ctx.ellipse(800, 600, 10, 5, 0, 0, 2 * Math.PI);
    //     this.ctx.fill();
    // }

    drawPlayer = function() {
        if (this.role === "player") this.color = "blue";
        else this.color = "yellow";
        this.drawBody(this.color);
        this.drawNeck();
        this.drawHead();

    }

}