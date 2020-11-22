"use strict";

class FieldView { /* View start */
    constructor(container) {
        this.container = container;
        this.containerID = this.container.getAttribute("id");
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.goalLineStartX = 0; // линия ворот с началом у левого края поля
        this.goalLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLength = 600*this.zoom; // длина ворот
        this.targetHeight = 195*this.zoom; // высота вороот
        this.targetGap = 100*this.zoom; // отступ от штанги до боковой линии вратарской площади
        this.fieldWidth = 1840*this.zoom; // ширина видимой части поля
        this.fieldLineWidth = 5*this.zoom; // ширина линий разметки поля для использования в canvas
        this.targetLineWidth = 12*this.zoom;// ширина линий ворот для использования в canvas
        this.targetInternalGapX = 20;//внутренний отступ от штанги до видимого горизонтального края сетки по X
        this.targetInternalGapY = 50;//внутренний отступ от штанги до видимого горизонтального края сетки по Y
        this.interval = null; // используется для анимации сетки
        this.cellRadius = 20 * this.zoom/2;
        this.cellStep = 20 * this.zoom;
        this.ctx.lineCap = "round";
        /* configuration end */
    }

    drawFieldEdge = function() { // разметка поля
        this.ctx.lineWidth = this.fieldLineWidth;
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.moveTo(this.goalLineStartX, this.goalLineY);
        this.ctx.lineTo(this.fieldWidth, this.goalLineY); // линия ворот
        this.ctx.moveTo(this.targetX + this.targetLength + this.targetX, this.goalLineY);
        this.ctx.lineTo(this.fieldWidth, 320*this.zoom);// линия штрафной у правого края поля
        this.ctx.stroke();
    }

    drawGoalKeeperArea = function () { // вратарская площадь
        this.ctx.lineWidth = this.fieldLineWidth;
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX - this.targetGap, this.goalLineY);
        this.ctx.lineTo(this.targetX - this.zoom * 2 * this.targetGap, this.goalLineY + this.targetGap);
        this.ctx.lineTo(this.targetX + this.targetLength + this.zoom * 2 * this.targetGap, this.goalLineY + this.targetGap);
        this.ctx.lineTo(this.targetX + this.targetLength + this.targetGap, this.goalLineY);
        this.ctx.stroke();
    }

    drawPenaltyPoint = function() { // 11-метровая отметка
        this.ctx.lineWidth = this.fieldLineWidth;
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(800, 600, 10, 5, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
    }

    drawTarget = function() {
        this.ctx.lineWidth = this.targetLineWidth;
        this.ctx.strokeStyle = 'azure';
        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX, this.goalLineY - 3 * this.zoom);// 3 = закругления стоек ворот
        this.ctx.lineTo(this.targetX, this.goalLineY - this.targetHeight); //левая стойка
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX, this.goalLineY - this.targetHeight);
        this.ctx.lineTo(this.targetX + this.targetLength, this.goalLineY - this.targetHeight) // перекладина
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX + this.targetLength, this.goalLineY - 3 * this.zoom );// 3 = закругления стоек ворот
        this.ctx.lineTo(this.targetX + this.targetLength, this.goalLineY - this.targetHeight);//правая стойка
        this.ctx.stroke();
    }

    drawGrid = function(color = 'darkgray', color_2 = 'lightgray', shift_1 = 1) {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        var leftStartPointX = this.targetX + this.zoom * this.targetInternalGapX;
        var bottomStartPointY = this.goalLineY - this.zoom * this.targetInternalGapY;
        var cellStep = this.cellStep * shift_1;

        // цикл ниже наносит вертикальные линии
        for (var i = 0; i < this.targetLength - this.targetInternalGapX; i += cellStep) {
            this.ctx.beginPath();
            this.ctx.moveTo(leftStartPointX + i, bottomStartPointY);
            this.ctx.lineTo(leftStartPointX + i, this.goalLineY - this.targetHeight);
            this.ctx.stroke();
        }
        // // цикл ниже наносит горизонтальные соединения
        for (var i = -cellStep; i < this.targetLength - this.targetInternalGapX - cellStep; i += cellStep) {
            for (var j = 0; j < this.targetHeight - this.targetInternalGapY; j += cellStep) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = color_2;
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(leftStartPointX + i, bottomStartPointY - j);
                this.ctx.arcTo(leftStartPointX + i + cellStep/2, bottomStartPointY - j + cellStep,
                    leftStartPointX + i + cellStep, bottomStartPointY - j, this.cellRadius);
                this.ctx.stroke();
            }
        }
    }

    drawFieldShakeGrid = function(color, color_2, shift_1) {
        this.ctx.clearRect(0, 0, this.container.getAttribute("width"), this.container.getAttribute("height"));
        var self = this;
        if (shift_1 === 1) shift_1 = 1.2;
        else shift_1 = 1;
        self.drawGrid(color, color_2, shift_1);
        self.drawFieldEdge();
        self.drawGoalKeeperArea();
        self.drawPenaltyPoint();
        self.drawTarget();
        self.interval = setInterval(() => { self.drawFieldShakeGrid(color_2, color, shift_1);}, 250);
        /* цвет линий сетки меняется между собой для эфекта движения */
    }

    drawField = function() {
        this.drawFieldEdge();
        this.drawGoalKeeperArea();
        this.drawPenaltyPoint();
        this.drawGrid();
        this.drawTarget();
    }
}

var fieldView = new FieldView(document.getElementById("container"));
fieldView.drawFieldShakeGrid('darkgray', 'white', 1.2, 1);
//fieldView.drawField();