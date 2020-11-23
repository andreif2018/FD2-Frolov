"use strict";

class PlayerView { /* View start */
    constructor(container, role) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.role = role;
        this.legWidth = 15 * this.zoom;
        this.legGap = 5*this.zoom;
        this.legHeight = 60 * this.zoom;
        this.bodyWidth = 40 * this.zoom;
        this.bodyHeight = 50 * this.zoom;
        this.bodyX = 800*this.zoom - this.bodyWidth/2; //центр ворот
        this.bodyY = this.targetLineY - this.legHeight - this.bodyHeight;
        this.neckWidth = 15*this.zoom;
        this.neckHeight = 5*this.zoom;
        this.neckX = this.bodyX + this.bodyWidth/2;
        this.neckY = this.bodyY - this.neckHeight;
        this.headWidth = 25*this.zoom;
        this.headHeight = 10*this.zoom;
        this.headX = this.bodyX + this.bodyWidth/2;
        this.headY = this.neckY - this.headHeight;
        this.boxerX = this.bodyX;
        this.boxerY = this.targetLineY - this.legHeight - this.zoom*9;
        this.boxerWidth = this.bodyWidth;
        this.legX = this.bodyX + this.zoom*2;
        this.legY = this.targetLineY - 0.9*this.legHeight;
        this.sockX = this.bodyX + this.zoom*2;
        this.sockY = this.targetLineY - this.legHeight/2;
        this.sockWidth = this.legWidth*0.9;
        this.bootX = this.bodyX + this.zoom*2;
        this.bootY = this.targetLineY;
        this.bootWidth = this.legWidth*0.9;
        this.leftArmX = this.bodyX;
        this.armY = this.bodyY + this.zoom*2;
        this.armWidth = 15 * this.zoom;
        this.armLength = 25 * this.zoom;
        this.rightArmX = this.bodyX + this.bodyWidth;
        this.handWidth = 14 *this.zoom;
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

    drawHead = function() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.headX, this.headY);
        this.ctx.lineTo(this.headX, this.headY);
        this.ctx.strokeStyle = 'navajowhite'; //цвет лица
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.headWidth;
        this.ctx.stroke();

        if (this.role !== "player" ) {
            // черты лица в ellipse
            this.ctx.beginPath(); // глаза
            this.ctx.ellipse(this.headX-this.zoom*6, this.headY - this.zoom*2,// левый глаз
                this.zoom*2, this.zoom, 0, 0, 2 * Math.PI);
            this.ctx.ellipse(this.headX+this.zoom*6, this.headY - this.zoom*2,// правый глаз
                this.zoom*2, this.zoom, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = "steelblue";
            this.ctx.fill();

            this.ctx.beginPath();// рот
            this.ctx.ellipse(this.headX, this.headY+5*this.zoom,
                this.zoom*4, this.zoom, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#AB5434";
            this.ctx.fill();

            this.ctx.beginPath();// волосы
            this.ctx.ellipse(this.headX, this.headY - 10*this.zoom,
                this.headWidth/3, this.headHeight/3, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#4A423A";
            this.ctx.fill();
        }
        else {
            this.ctx.beginPath();// волосы
            this.ctx.ellipse(this.headX, this.headY - 5*this.zoom,
                this.headWidth/2, this.headHeight, 0, 0, 2 * Math.PI);
            this.ctx.ellipse(this.headX, this.headY+5*this.zoom,
                this.headWidth/3.2, this.headHeight/1.5, 0, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#3C454D";
            this.ctx.fill();
        }
    }

    drawNeck = function() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.neckX, this.neckY);
        this.ctx.lineTo(this.neckX, this.neckY + this.neckHeight);
        this.ctx.strokeStyle = 'navajowhite';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.neckWidth;
        this.ctx.stroke();
    }

    drawBody = function() {
        if (this.role === "player") var color = "darkblue";
        else color = "yellow";
        this.drawRoundedRect(this.bodyX, this.bodyY, this.bodyWidth, this.bodyHeight, 10*this.zoom, color); //10-radius закругления плечей
        var gradient = this.ctx.createRadialGradient(
            this.bodyX+20, this.bodyY+20, 5*this.zoom, // 5 - радиус внутрееннго круга
            this.bodyX, this.bodyY, 10*this.zoom // 10-радиус внешнего круга
        );
        if (this.role === "player") gradient.addColorStop(0.75, '#0E82E1');// цвет узора на футболке
        else gradient.addColorStop(0.75, '#F08A37');
        gradient.addColorStop(1, color);// цвет футболки
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.bodyX + 10*this.zoom, this.bodyY, this.bodyWidth, this.bodyHeight);//10-radius закругления плечей
    }

    drawArms = function() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.leftArmX, this.armY);// левая рука
        this.ctx.lineTo(this.leftArmX - this.armLength/2*Math.cos(Math.PI/6), this.armY - this.armLength/2*Math.sin(Math.PI/6));
        this.ctx.lineTo(this.leftArmX - this.armLength*Math.cos(Math.PI/4), this.armY - this.armLength*Math.sin(Math.PI/4));

        this.ctx.moveTo(this.rightArmX, this.armY);// правая рука
        this.ctx.lineTo(this.rightArmX + this.armLength/2*Math.cos(Math.PI/6), this.armY - this.armLength/2*Math.sin(Math.PI/6));
        this.ctx.lineTo(this.rightArmX + this.armLength*Math.cos(Math.PI/4), this.armY - this.armLength*Math.sin(Math.PI/4));
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.armWidth;
        var linearGradient_2 = this.ctx.createLinearGradient(this.leftArmX, this.armY,  // узоры на рукове
            this.leftArmX - this.armLength*Math.cos(Math.PI/4), this.armY - this.armLength*Math.sin(Math.PI/4));
        linearGradient_2.addColorStop(0, 'yellow');
        linearGradient_2.addColorStop(0.1, 'greenyellow');
        linearGradient_2.addColorStop(1, 'yellow');
        this.ctx.strokeStyle = linearGradient_2;
        this.ctx.stroke();
    }

    drawHands = function() {
        this.ctx.lineWidth = this.handWidth;
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();// левая перчатка
        this.ctx.moveTo(this.leftArmX - this.armLength*Math.cos(Math.PI/4),
            this.armY - this.armLength*Math.sin(Math.PI/4));
        this.ctx.lineTo(this.leftArmX - this.armLength*Math.cos(Math.PI/4),
            this.armY - this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);

        var linearGradient_1 = this.ctx.createLinearGradient(this.leftArmX - this.armLength*Math.cos(Math.PI/4),  // перчатки
            this.armY - this.armLength*Math.sin(Math.PI/4),
            this.leftArmX - this.armLength*Math.cos(Math.PI/4),
            this.armY - this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);
        linearGradient_1.addColorStop(0, 'white');
        linearGradient_1.addColorStop(0.1, 'lightgray');
        linearGradient_1.addColorStop(1, 'white');
        this.ctx.strokeStyle = linearGradient_1;
        this.ctx.stroke();

        this.ctx.beginPath();// правая перчатка
        this.ctx.moveTo(this.rightArmX + this.armLength*Math.cos(Math.PI/4),
            this.armY - this.armLength*Math.sin(Math.PI/4));
        this.ctx.lineTo(this.rightArmX + this.armLength*Math.cos(Math.PI/4),
            this.armY - this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);
        var linearGradient_2 = this.ctx.createLinearGradient(this.rightArmX + this.armLength*Math.cos(Math.PI/4),  // перчатки
            this.armY - this.armLength*Math.sin(Math.PI/4),
            this.rightArmX + this.armLength*Math.cos(Math.PI/4),
            this.armY - this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);
        linearGradient_2.addColorStop(0, 'white');
        linearGradient_2.addColorStop(0.1, 'lightgray');
        linearGradient_2.addColorStop(1, 'white');
        this.ctx.strokeStyle = linearGradient_2;
        this.ctx.stroke();
    }

    drawBoxers = function() {
        if (this.role === "player") var color = "mediumblue";
        else color = "#2A2A17";
        this.drawRoundedRect(this.boxerX, this.boxerY, this.boxerWidth/2, this.legHeight/2, 7*this.zoom, color);
        // 7-radius закругления, boxerWidth/2 -ширина каждой штанины
        this.drawRoundedRect(this.boxerX + this.boxerWidth/2, this.boxerY, this.boxerWidth/2, this.legHeight/2, 7*this.zoom, color);
    }

    drawLegs = function() {
        var color = "navajowhite";
        this.drawRoundedRect(this.legX, this.legY, this.legWidth, this.legHeight/2, 10*this.zoom, color);
        // 10-radius закругления
        this.drawRoundedRect(this.legX + this.legWidth + this.legGap, this.legY, this.legWidth, this.legHeight/2, 10*this.zoom, color);
    }

    drawSocks = function() {
        if (this.role === "player") var color = "midnightblue";
        else color = "#2A2A17";
        this.drawRoundedRect(this.sockX, this.sockY, this.sockWidth, this.legHeight/2, 5*this.zoom, color);
        // 5-radius закругления
        this.drawRoundedRect(this.sockX + this.sockWidth + this.legGap*1.5, this.sockY, this.sockWidth, this.legHeight/2, 5*this.zoom, color);
    }

    drawBoots = function() {
        this.ctx.beginPath();
        if (this.role === "player") {
            this.ctx.ellipse(this.bootX + this.bootWidth*0.5, this.bootY, this.legWidth, 6*this.zoom,
                Math.PI/2, 0, 2 * Math.PI);
            this.ctx.ellipse(this.bootX + this.bootWidth*2.3, this.bootY, this.bootWidth*0.9, 6*this.zoom,
                Math.PI/4, 0, 2 * Math.PI);
        }
        else {
            this.ctx.ellipse(this.bootX + this.bootWidth*0.2, this.bootY, this.legWidth, 6*this.zoom,
                -Math.PI/4, 0, 2 * Math.PI); // левая бутса
            this.ctx.ellipse(this.bootX + this.bootWidth*2.3, this.bootY, this.bootWidth*0.9, 6*this.zoom,
                Math.PI/4, 0, 2 * Math.PI); // правая бутса
        }
        this.ctx.fillStyle = "#2A2A17"
        this.ctx.fill();
    }


    drawPlayer = function() {
        this.drawBoots();
        this.drawSocks();
        this.drawLegs();
        this.drawBoxers();
        this.drawArms();
        this.drawHands();
        this.drawBody();
        this.drawNeck();
        this.drawHead();
    }

}