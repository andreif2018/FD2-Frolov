"use strict";

class PlayerView {
    constructor(container, role) {
        this.container = container;
        this.ctx = this.container.getContext('2d');
        this.zoom = 1; // для +/- разрешения экрана
        this.targetLineY = 200*this.zoom; // линия ворот с началом у левого края видимой части поля
        this.role = role;
        if (this.role === "player") this.multiplier = 1.7;  //170% масштаб фигуры игрока тк он расположен ближе к пользователю
        else this.multiplier = 1; // 100% масштаб фигуры вратаря
        this.legWidth = 15 * this.zoom * this.multiplier;
        this.legGap = 5*this.zoom * this.multiplier;
        this.legHeight = 65 * this.zoom * this.multiplier;
        this.bodyWidth = 40 * this.zoom * this.multiplier;
        this.bodyHeight = 50 * this.zoom * this.multiplier;
        if (this.role === "player") {
            this.bodyX = 800*this.zoom - 2*this.bodyWidth;//центр ворот
            this.bodyY = 475*this.zoom;
        }
        else {
            this.bodyX = 800*this.zoom - this.bodyWidth/2; //центр ворот
            this.bodyY = this.targetLineY - this.legHeight - this.bodyHeight;
        }
        this.neckWidth = 15*this.zoom * this.multiplier;
        this.neckHeight = 5*this.zoom * this.multiplier;
        this.neckX = this.bodyX + this.bodyWidth/2;
        this.neckY = this.bodyY - this.neckHeight;
        this.headWidth = 25*this.zoom * this.multiplier;
        this.headHeight = 10*this.zoom * this.multiplier;
        this.headX = this.bodyX + this.bodyWidth/2;
        this.headY = this.neckY - this.headHeight;
        this.boxerX = this.bodyX;
        this.boxerY = this.bodyY + this.bodyHeight - this.zoom*9;
        this.boxerWidth = this.bodyWidth;
        this.legX = this.bodyX + this.zoom*2;
        this.legY = this.bodyY + 0.1 * this.legHeight + this.bodyHeight;
        this.sockX = this.bodyX + this.zoom*2;
        this.sockY = this.bodyY + 0.5*this.legHeight + this.bodyHeight;
        this.sockWidth = this.legWidth*0.9;
        this.bootX = this.bodyX + this.zoom*2;
        this.bootY = this.bodyY + this.legHeight + this.bodyHeight;
        this.bootWidth = this.legWidth*0.9;
        this.leftArmX = this.bodyX;
        this.armY = this.bodyY + this.zoom*2;
        this.armWidth = 15 * this.zoom * this.multiplier;
        this.armLength = 25 * this.zoom * this.multiplier;
        this.rightArmX = this.bodyX + this.bodyWidth;
        this.handWidth = 14 *this.zoom * this.multiplier;
        this.shake = 0.75*this.zoom;
    }

    drawRoundedRect = function (x , y, width, height, radius, color) {
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

    drawHead = function () {
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

    drawNeck = function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.neckX, this.neckY);
        this.ctx.lineTo(this.neckX, this.neckY + this.neckHeight);
        this.ctx.strokeStyle = 'navajowhite';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.neckWidth;
        this.ctx.stroke();
    }

    drawBody = function () {
        if (this.role === "player") var color = "darkblue";
        else color = "yellow";
        this.drawRoundedRect(this.bodyX, this.bodyY, this.bodyWidth, this.bodyHeight, 10*this.zoom, color); //10-radius закругления плечей
        var gradient = this.ctx.createRadialGradient( // закраска футболки градиентом
            this.bodyX+20*this.multiplier, this.bodyY+20*this.multiplier, 5*this.multiplier*this.zoom, // 5 - радиус внутрееннго круга
            this.bodyX, this.bodyY, 10*this.multiplier*this.zoom); // 10-радиус внешнего круга
        if (this.role === "player") {
            gradient.addColorStop(0.75, '#0E82E1');// цвет узора на футболке
            gradient.addColorStop(1, color);// цвет футболки
            this.ctx.fillStyle = gradient;// закраска футболки градиентом
            this.ctx.fillRect(this.bodyX + 10*this.zoom, this.bodyY, this.bodyWidth, this.bodyHeight);//10-radius закругления плечей
            this.ctx.font = this.multiplier * this.zoom + 'em' + " serif";
            this.ctx.fillStyle = 'white';
            this.ctx.fillText("9", this.bodyX + this.bodyWidth/3, this.bodyY + this.bodyHeight/1.3);
        }
        else {
            gradient.addColorStop(0.75, '#F08A37');// цвет узора на футболке
            gradient.addColorStop(1, color);// цвет футболки
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(this.bodyX + 10*this.zoom, this.bodyY, this.bodyWidth, this.bodyHeight);//10-radius закругления плечей
        }
    }

    drawArms = function (goal = false) {
        this.ctx.beginPath();
        this.ctx.lineCap = 'round';
        if (this.role === "player") {
            if (goal) {
                var handsUp = -1;// в случае гола руки поднимаются по направлению вверх по оси Y
                var straightArm = this.zoom*5; //дополнительное смещение для поднятого вверх рукава
            }
            else {// обычное сосотяние- руки вниз
                handsUp = 1;
                straightArm = 0;//дополнительное смещение для поднятого вверх рукава рвно нулю
            }// левая рука
            this.ctx.moveTo(this.leftArmX - this.armWidth/8, this.armY + handsUp*1.1*this.armLength);// левая рука, armWidth/8 сдвиг от плеча
            this.ctx.lineTo(this.leftArmX - this.armWidth/8, this.armY + handsUp*2.2*this.armLength); // 2*armLength - длина руки arm + hand
            this.ctx.lineWidth = this.armWidth*0.5;
            this.ctx.strokeStyle = 'navajowhite';
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.leftArmX + this.armWidth/8, this.armY + handsUp*this.armLength/3 + straightArm);
            this.ctx.lineTo(this.leftArmX, this.armY + handsUp*this.armLength );// левый рукав
            this.ctx.lineWidth = this.armWidth;
            this.ctx.strokeStyle = 'darkblue';
            this.ctx.stroke();

            this.ctx.beginPath();// правая рука
            this.ctx.moveTo(this.rightArmX, this.armY + handsUp*this.armLength/3);
            this.ctx.lineTo(this.rightArmX + this.armWidth/2, this.armY + handsUp*2.2*this.armLength);//armWidth/1.5 - рука под углом, 2*armLength - длина руки arm + hand
            this.ctx.lineWidth = this.armWidth*0.5;
            this.ctx.strokeStyle = 'navajowhite';
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.rightArmX - this.armWidth/8, this.armY + handsUp*this.armLength/3 + straightArm);
            this.ctx.lineTo(this.rightArmX + this.armWidth/5, this.armY + handsUp*this.armLength);// правый рукав
            this.ctx.lineWidth = this.armWidth;
            this.ctx.strokeStyle = 'darkblue';
            this.ctx.stroke();
        }
        else { // вратарь
            if (goal) {
                var handsDown = -1;
                var moveArm = 5*this.zoom;//дополнительное смещение для выпрямления руки
            }
            else {
                handsDown = 1;
                moveArm = 0; //нет смещения для выпрямления руки
            }
            this.ctx.moveTo(this.leftArmX, this.armY);// левая рука
            this.ctx.lineWidth = this.armWidth;
            this.ctx.lineTo(this.leftArmX - this.armLength/2*Math.cos(Math.PI/6), this.armY - handsDown*this.armLength/2*Math.sin(Math.PI/6));
            this.ctx.lineTo(this.leftArmX - this.armLength*Math.cos(Math.PI/4) - moveArm, this.armY - handsDown*this.armLength*Math.sin(Math.PI/4));

            this.ctx.moveTo(this.rightArmX, this.armY);// правая рука
            this.ctx.lineTo(this.rightArmX + this.armLength/2*Math.cos(Math.PI/6), this.armY - handsDown*this.armLength/2*Math.sin(Math.PI/6));
            this.ctx.lineTo(this.rightArmX + this.armLength*Math.cos(Math.PI/4) + moveArm, this.armY - handsDown*this.armLength*Math.sin(Math.PI/4));
            var linearGradient_2 = this.ctx.createLinearGradient(this.leftArmX, this.armY,  // узоры на рукове
                this.leftArmX - this.armLength*Math.cos(Math.PI/4), this.armY - this.armLength*Math.sin(Math.PI/4));
            linearGradient_2.addColorStop(0, 'yellow');
            linearGradient_2.addColorStop(0.1, 'greenyellow');
            linearGradient_2.addColorStop(1, 'yellow');
            this.ctx.strokeStyle = linearGradient_2;
            this.ctx.stroke();
        }
    }

    drawHands = function (goal = false) {
        this.ctx.lineWidth = this.handWidth;
        if (this.role !== "player") {
            if (goal) {
                var handsDown = -1;
                var straightArm = 5*this.zoom;//дополнительное смещение для выпрямления руки
            }
            else {
                handsDown = 1;
                straightArm = 0; //нет смещения для выпрямления руки
            }
            this.ctx.strokeStyle = "white";
            this.ctx.beginPath();// левая перчатка
            this.ctx.moveTo(this.leftArmX - this.armLength*Math.cos(Math.PI/4),
                this.armY - handsDown*this.armLength*Math.sin(Math.PI/4));
            this.ctx.lineTo(this.leftArmX - this.armLength*Math.cos(Math.PI/4),
                this.armY - handsDown*this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);

            var linearGradient_1 = this.ctx.createLinearGradient(this.leftArmX - this.armLength*Math.cos(Math.PI/4),  // градиент перчатки
                this.armY - this.armLength*Math.sin(Math.PI/4),
                this.leftArmX - this.armLength*Math.cos(Math.PI/4),
                this.armY - this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);
            linearGradient_1.addColorStop(0, 'white');
            linearGradient_1.addColorStop(0.1, 'lightgray');
            linearGradient_1.addColorStop(1, 'white');
            this.ctx.strokeStyle = linearGradient_1;
            this.ctx.stroke();

            this.ctx.moveTo(this.rightArmX + this.armLength*Math.cos(Math.PI/4),// правая перчатка
                this.armY - handsDown*this.armLength*Math.sin(Math.PI/4));
            this.ctx.lineTo(this.rightArmX + this.armLength*Math.cos(Math.PI/4),
                this.armY - handsDown*this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);
            var linearGradient_2 = this.ctx.createLinearGradient(this.rightArmX + this.armLength*Math.cos(Math.PI/4),  // градиент перчатки
                this.armY - this.armLength*Math.sin(Math.PI/4),
                this.rightArmX + this.armLength*Math.cos(Math.PI/4),
                this.armY - this.armLength*Math.sin(Math.PI/4) - 5*this.zoom);
            linearGradient_2.addColorStop(0, 'white');
            linearGradient_2.addColorStop(0.1, 'lightgray');
            linearGradient_2.addColorStop(1, 'white');
            this.ctx.strokeStyle = linearGradient_2;
            this.ctx.stroke();
        }
    }

    drawBoxers = function () {
        if (this.role === "player") var color = "mediumblue";
        else color = "#2A2A17";
        this.drawRoundedRect(this.boxerX, this.boxerY, this.boxerWidth/2, this.legHeight/2.2, 7*this.zoom, color);
        // 7-radius закругления, boxerWidth/2 -ширина каждой штанины, this.legHeight/2.2 -высота штанины
        this.drawRoundedRect(this.boxerX + this.boxerWidth/2, this.boxerY, this.boxerWidth/2, this.legHeight/2.2, 7*this.zoom, color);
    }

    drawLegs = function () {
        var color = "navajowhite";
        this.drawRoundedRect(this.legX, this.legY, this.legWidth, this.legHeight/2, 10*this.zoom, color);
        // 10-radius закругления
        this.drawRoundedRect(this.legX + this.legWidth + this.legGap, this.legY, this.legWidth, this.legHeight/2, 10*this.zoom, color);
    }

    drawSocks = function () {
        if (this.role === "player") var color = "midnightblue";
        else color = "#2A2A17";
        this.drawRoundedRect(this.sockX, this.sockY, this.sockWidth, this.legHeight/2, 5*this.zoom, color);
        // 5-radius закругления
        this.drawRoundedRect(this.sockX + this.sockWidth + this.legGap*1.5, this.sockY, this.sockWidth, this.legHeight/2, 5*this.zoom, color);
    }

    drawBoots = function () {
        this.ctx.beginPath();
        if (this.role === "player") {
            this.ctx.ellipse(this.bootX + this.bootWidth*0.5, this.bootY, this.legWidth/2, 9*this.zoom,
                Math.PI/2, 0, 2 * Math.PI);// левая бутса
            this.ctx.ellipse(this.bootX + this.bootWidth*2.3, this.bootY - this.legHeight/20, this.bootWidth*0.9, 9*this.zoom,
                3*Math.PI/4, 0, 2 * Math.PI);// правая бутса
        }
        else {
            this.ctx.ellipse(this.bootX + this.bootWidth*0.2, this.bootY, this.legWidth, 6*this.zoom,
                3*Math.PI/4, 0, 2 * Math.PI); // левая бутса
            this.ctx.ellipse(this.bootX + this.bootWidth*2.3, this.bootY, this.bootWidth*0.9, 6*this.zoom,
                Math.PI/4, 0, 2 * Math.PI); // правая бутса
        }
        this.ctx.fillStyle = "#2A2A17"
        this.ctx.fill();
    }

    drawPlayer = function (goal) {
        if (goal) {
            if (this.role === "player") {
                this.shake = -this.shake;
                this.bodyY = 475 * this.zoom + this.shake;
            }
        }
        else {
            if (this.role === "player") {
                this.bodyY = 475*this.zoom;
            }
        }
        this.drawBoots();
        this.drawSocks();
        this.drawLegs();
        this.drawBoxers();
        this.drawArms(goal);
        this.drawHands(goal);
        this.drawBody();
        this.drawNeck();
        this.drawHead();
    }

}