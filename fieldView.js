"use strict";

class FieldView { /* View start */
    constructor(container) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана, 1 = 100% по умолчанию
        this.targetLineStartX = 0; // линия ворот с началом у левого края поля
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.targetX = 500*this.zoom; // левая стойка ворот по X
        this.targetLength = 600*this.zoom; // длина ворот
        this.targetHeight = 195*this.zoom; // высота вороот
        this.targetGap = 100*this.zoom; // отступ от штанги до боковой линии вратарской площади
        this.fieldWidth = 1840*this.zoom; // ширина видимой части поля
        this.fieldLineWidth = 5*this.zoom; // ширина линий разметки поля для использования в canvas
        this.targetLineWidth = 14*this.zoom;// ширина линий ворот для использования в canvas
        this.targetInternalGapX = 20*this.zoom;//внутренний отступ от штанги до видимого горизонтального края сетки по X
        this.targetInternalGapY = 50*this.zoom//внутренний отступ от штанги до видимого горизонтального края сетки по Y
        this.cellRadius = 20 * this.zoom/2; // радиус ячейки в сетке ворот
        this.cellStep = 20 * this.zoom; // длина ячейки в сетке ворот
        this.ctx.lineCap = "round";
        this.gridColor_1 = "darkgray";
        this.gridColor_2 = "lightgray";
        this.shift = 1;
        this.penaltyPointX = 800*this.zoom; // 11 метровая отметка по x
        this.penaltyPointY = 600*this.zoom; // 11 метровая отметка по x
        this.penaltyPointRadiusX = 10*this.zoom;
        this.penaltyPointRadiusY = 5*this.zoom;
    }

    drawFieldEdge = function() { // разметка поля
        this.ctx.lineWidth = this.fieldLineWidth;
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.moveTo(this.targetLineStartX, this.targetLineY);
        this.ctx.lineTo(this.fieldWidth, this.targetLineY); // линия ворот
        this.ctx.moveTo(this.targetX + this.targetLength + this.targetX, this.targetLineY);
        this.ctx.lineTo(this.fieldWidth, 320*this.zoom);// линия штрафной у правого края поля
        this.ctx.stroke();
    }

    drawGoalKeeperArea = function () { // вратарская площадь
        this.ctx.lineWidth = this.fieldLineWidth;
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX - this.targetGap, this.targetLineY);
        this.ctx.lineTo(this.targetX - 2 * this.targetGap, this.targetLineY + this.targetGap);
        this.ctx.lineTo(this.targetX + this.targetLength + 2 * this.targetGap, this.targetLineY + this.targetGap);
        this.ctx.lineTo(this.targetX + this.targetLength + this.targetGap, this.targetLineY);
        this.ctx.stroke();

        // создание градиента для области вытоптанной вратарем
        var gradient = this.ctx.createRadialGradient(
            this.targetX + this.targetLength/2, this.targetLineY + this.targetGap/2, 10*this.zoom, // 10 радиус внутрееннго круга
            this.targetX + this.targetLength/2, this.targetLineY + this.targetGap/2, 35*this.zoom // 35 радиус внешнего круга
        );
        gradient.addColorStop(0.1, 'darkolivegreen');// цвет внутрееннго круга
        gradient.addColorStop(1, 'seagreen');// цвет внешнего круга
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.targetX + this.targetLength/2.5, this.targetLineY + this.targetLineWidth,
            this.targetGap, this.targetGap/1.25);
    }

    drawPenaltyPoint = function() { // 11-метровая отметка
        this.ctx.lineWidth = this.fieldLineWidth;
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(this.penaltyPointX, this.penaltyPointY, this.penaltyPointRadiusX, this.penaltyPointRadiusY, 0, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawTarget = function() {
        this.ctx.lineWidth = this.targetLineWidth;
        this.ctx.strokeStyle = 'azure';

        var gradient = this.ctx.createLinearGradient(this.targetX, this.targetLineY - 3 * this.zoom,
            this.targetX + this.targetLineWidth, this.targetLineY - this.targetHeight);
        gradient.addColorStop(0, 'darkgray');
        gradient.addColorStop(0.5, 'white');
        gradient.addColorStop(1, 'azure');
        this.ctx.strokeStyle = gradient;

        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX, this.targetLineY - 3 * this.zoom);// 3 = закругления стоек ворот
        this.ctx.lineTo(this.targetX, this.targetLineY - this.targetHeight); //левая стойка
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX + this.targetLength, this.targetLineY - 3 * this.zoom );// 3 = закругления стоек ворот
        this.ctx.lineTo(this.targetX + this.targetLength, this.targetLineY - this.targetHeight);//правая стойка
        this.ctx.stroke();

        // создание градиента для цвета стоек и перекладины ворот
        var linearGradient_2 = this.ctx.createLinearGradient(this.targetX,
            this.targetLineY - this.targetHeight + this.targetLineWidth,
            this.targetX + this.targetLineWidth, this.targetLineY - this.targetHeight-this.targetLineWidth);
        linearGradient_2.addColorStop(0, 'white');
        linearGradient_2.addColorStop(0.5, 'whitesmoke');
        linearGradient_2.addColorStop(1, 'azure');
        this.ctx.strokeStyle = linearGradient_2;

        this.ctx.beginPath();
        this.ctx.moveTo(this.targetX, this.targetLineY - this.targetHeight);
        this.ctx.lineTo(this.targetX + this.targetLength, this.targetLineY - this.targetHeight) // перекладина
        this.ctx.stroke();
    }

    drawGrid = function(color = this.gridColor_1, color_2 = this.gridColor_2, shift = this.shift) {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        var leftStartPointX = this.targetX + this.targetInternalGapX;
        var bottomStartPointY = this.targetLineY - this.targetInternalGapY;
        var cellStep = this.cellStep * shift;

        // цикл ниже наносит вертикальные линии
        for (var k = 0; k < this.targetLength - this.targetInternalGapX; k += cellStep) {
            this.ctx.beginPath();
            this.ctx.moveTo(leftStartPointX + k, bottomStartPointY);
            this.ctx.lineTo(leftStartPointX + k, this.targetLineY - this.targetHeight);
            this.ctx.stroke();
        }
        // цикл ниже наносит горизонтальные соединения
        var gap;// расстояние между правой штангой и первой вертикальной линией сетки слева от штанги
        if (shift === 1) gap = cellStep;
        else gap = 0;
        for (var i = -cellStep; i < this.targetLength - this.targetInternalGapX -cellStep + gap; i += cellStep) {
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

    drawFieldShakeGrid = function() {
        this.ctx.clearRect(0, 0, this.container.getAttribute("width"), this.container.getAttribute("height"));
        var self = this;
        if (self.gridColor_1 === "darkgray") { /* цвет линий сетки меняется между собой для эфекта движения */
            self.gridColor_1 = self.gridColor_2;
            self.gridColor_2 = "darkgray";
            self.shift = 1.2;
        }
        else {
            self.gridColor_2 = self.gridColor_1;
            self.gridColor_1 = "darkgray";
            self.shift = 1;
        }
        self.drawGrid(self.gridColor_1, self.gridColor_2, self.shift);
        self.drawFieldEdge();
        self.drawGoalKeeperArea();
        self.drawPenaltyPoint();
        self.drawTarget();
    }

    drawField = function() {
        var self = this;
        self.drawFieldEdge();
        self.drawGoalKeeperArea();
        self.drawPenaltyPoint();
        self.drawGrid();
        self.drawTarget();
    }
}