"use strict";
class Game {
    constructor() {
        this.kickInterval = null;
        this.kickTimeout = null;
        this.goalInterval = null;
        this.goalTimeout = null;
        this.blockInterval = null;
        this.blockTimeout = null;
        this.popupInterval = null;
        this.popupTimeout = null;
        this.container = document.getElementById("container");
        this.ctx = this.container.getContext('2d');
        this.fieldView = new FieldView(this.container);
        this.fieldModel = new FieldModel(this.fieldView);
        this.fieldController = new FieldController(this.fieldModel, this.fieldView);

        this.goalKeeperView = new PlayerView(this.container, "goalKeeper");
        this.goalKeeperModel = new PlayerModel(this.goalKeeperView);
        this.goalKeeperController = new PlayerController(this.goalKeeperModel, this.goalKeeperView);

        this.playerView = new PlayerView(this.container, "player");
        this.playerModel = new PlayerModel(this.playerView);
        this.playerController = new PlayerController(this.playerModel, this.playerView);

        this.ballView = new BallView(this.container);
        this.ballModel = new BallModel(this.ballView);
        this.ballController = new BallController(this.ballModel, this.ballView);
        this.ballKickSound = new Audio('multimedia/ballKick.mp3');
        this.ballBlockSound = new Audio('multimedia/ballBlock.mp3');
        this.goalSound = new Audio('multimedia/goal.mp3');
        this.referiSound = new Audio('multimedia/referi.mp3');
        this.gridSound = new Audio('multimedia/grid.mp3');
        this.goalPostSound = new Audio('multimedia/goalPostSound.mp3');
        this.finishSound = new Audio('multimedia/finishSound.mp3');
        this.sound = true;
        this.popupInfo = document.getElementById("result");
    }

    init = function () {
        this.roundCounter = 0;
        this.playGame();
        this.playerScore = 0;
        this.computerScore = 0;
        this.updateScore();
        this.skewX = 0;
        this.skewY = 0;
    }

    setMute = function () {
        if (this.sound) {
            this.sound = false;
            document.getElementById("sound").setAttribute("value", "Unmute");
        }
        else {
            this.sound = true;
            document.getElementById("sound").setAttribute("value", "Mute");
        }
    }

    playGame = function () {
        clearTimeout(this.popupTimeout);
        this.popupInfo.className = "NotShown";
        if (this.roundCounter < 5) { // игра в пять раундов
            this.updateRound();
            this.regularState();
            if (this.sound) this.referiSound.play();
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Shift') {
                    this.kickStage();
                    this.IsGoalPromise("проверка гола","гол!!!")
                        .then( result => {console.log("получен результат " + result);}
                        )
                        .catch( error => {console.log(error);}
                        );
                    this.IsGoalPostPromise("попал ли в штангу/перекладину","штанга/перекладина")
                        .then( result => {console.log("получен результат " + result);}
                        )
                        .catch( error => {console.log( error);}
                        );
                    this.IsGoalKeeperBlockPromise("отбил ли вратарь","вратарь отбил")
                        .then( result => {console.log("получен результат " + result);}
                        )
                        .catch( error => {console.log( error);}
                        );
                }
            }, {once: true});
        }
        else this.updateResult();// выводит финальный результат
    }

    regularState = function () {
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.fieldController.start();
        this.playerController.start();
        this.ballController.start();
        this.goalKeeperController.start();
    }

    kickStateNoBall = function () {
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.fieldController.start();
        this.goalKeeperController.kick();
        this.playerController.start();
    }

    blockStateNoBall = function () {
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.fieldController.start();
        this.goalKeeperController.blockStage();
        this.playerController.blockStage();
    }

    kickStage = function () {
        var self = this;
        self.kickStateNoBall();
        self.ballController.kick();
        self.kickInterval = requestAnimationFrame( () => {
            self.kickStage();
        });
        self.kickTimeout = setTimeout(() => {
            cancelAnimationFrame(self.kickInterval);
        }, 550);//через 550 долетает до ворот
    }

    goalStage = function () {
        clearTimeout(this.kickTimeout);
        var self = this;
        self.fieldController.goalStage();
        self.ballController.goalStage();
        self.goalKeeperController.goalStage();
        self.playerController.goalStage();
        self.goalInterval  = setInterval(() => {
            self.fieldController.goalStage();
            self.ballController.goalStage();
            self.goalKeeperController.goalStage();
            self.playerController.goalStage();
        }, 150) // 150
        self.goalTimeout = setTimeout(() => {
            clearInterval(self.goalInterval);
            self.stopGoalStage();
        }, 4000); //5500
    }

    stopGoalStage = function () {
        clearTimeout(this.goalTimeout);
        this.roundCounter += 1;
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.playGame();
    }

    blockedStage = function () {
        var self = this;
        self.blockStateNoBall();
        self.ballController.blockedStage();
        self.blockInterval = setInterval( () => {
            self.blockStateNoBall();
            self.ballController.blockedStage();
        }, 12);
        self.blockTimeout = setTimeout(() => {
            clearInterval(self.blockInterval);
            self.stopBlockStage();
        }, 2000);
    }
    stopBlockStage = function () {
        clearTimeout(this.blockTimeout);
        this.roundCounter += 1;
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.playGame();
    }

    isGoalKeeperBlock = function () {
        return this.ballView.ballX + this.ballView.ballRadius >= this.goalKeeperView.leftHandX &&
            this.ballView.ballX - this.ballView.ballRadius <= this.goalKeeperView.rightHandX &&
            this.ballView.ballY + this.ballView.ballRadius >= this.goalKeeperView.handY &&
            this.ballView.ballY - this.ballView.ballRadius <= this.goalKeeperView.bootY;
    }

    isInTarget = function () {
        return this.ballView.ballX - this.ballView.ballRadius > this.fieldView.targetX + this.fieldView.targetLineWidth/2 &&
            this.ballView.ballX + this.ballView.ballRadius < this.fieldView.targetX + this.fieldView.targetLength - this.fieldView.targetLineWidth/2 &&
            this.ballView.ballY - this.ballView.ballRadius > this.fieldView.targetLineY - this.fieldView.targetHeight + this.fieldView.targetLineWidth/2 &&
            this.ballView.ballY + this.ballView.ballRadius < this.fieldView.targetLineY - this.fieldView.targetLineWidth/2
    }

    isGoalPost = function () {
        if (this.ballView.ballY + this.ballView.ballRadius < this.fieldView.targetLineY - this.fieldView.targetLineWidth/2 &&
            this.ballView.ballY - this.ballView.ballRadius > this.fieldView.targetLineY - this.fieldView.targetHeight + this.fieldView.targetLineWidth/2)
            if (this.ballView.ballX - this.ballView.ballRadius <= this.fieldView.targetX + this.fieldView.targetLineWidth/2 &&
                this.ballView.ballX + this.ballView.ballRadius >= this.fieldView.targetX - this.fieldView.targetLineWidth/2) return true;
            else if (this.ballView.ballX + this.ballView.ballRadius >= this.fieldView.targetX + this.fieldView.targetLength - this.fieldView.targetLineWidth/2 &&
                this.ballView.ballX - this.ballView.ballRadius <= this.fieldView.targetX + this.fieldView.targetLength + this.fieldView.targetLineWidth/2) return true;
        else return this.ballView.ballY + this.ballView.ballRadius >= this.fieldView.targetLineY - this.fieldView.targetHeight - this.fieldView.targetLineWidth/2 &&
                    this.ballView.ballY - this.ballView.ballRadius <= this.fieldView.targetLineY - this.fieldView.targetHeight + this.fieldView.targetLineWidth/2;
    }

    IsGoalPromise = function (name, result) {
        var self = this;
        if (this.sound) this.ballKickSound.play();
        return new Promise( (resolve, reject) => {
            console.log("промис " + name + " создан, запущен...");
            setTimeout( () => {
                if (self.isInTarget() && !self.isGoalKeeperBlock() ) {
                    if (self.sound) {
                        self.gridSound.play();
                        self.goalSound.play();
                        setTimeout(() =>{self.goalSound.pause();}, 4000);
                    }
                    self.goalStage();
                    self.playerScore += 1;
                    self.updateScore();
                    resolve(result);
                }
                else reject("нет гола");
            }, 550);
        });
    }
    IsGoalPostPromise = function (name, result) {
        var self = this;
        if (this.sound) this.ballKickSound.play();
        return new Promise( (resolve, reject) => {
            console.log("промис " + name + " создан, запущен...");
            setTimeout( () => {
                if (self.isGoalPost()) {
                    if (self.sound) self.goalPostSound.play();
                    self.blockedStage();
                    self.computerScore += 1;
                    self.updateScore();
                    resolve(result);
                }
                else reject("не попал в штангу");
            }, 550);
        });
    }
    IsGoalKeeperBlockPromise = function (name, result) {
        var self = this;
        if (this.sound) this.ballKickSound.play();
        return new Promise( (resolve, reject) => {
            console.log("промис " + name + " создан, запущен...");
            setTimeout( () => {
                if (self.isGoalKeeperBlock()) {
                    if (self.sound) self.ballBlockSound.play();
                    self.blockedStage();
                    self.computerScore += 1;
                    self.updateScore();
                    resolve(result);
                }
                else reject("вратарь не отбил");
            }, 550);
        });
    }

    updateScore = function () {
        document.getElementById("playerScore").textContent = this.playerScore;
        document.getElementById("computerScore").textContent = this.computerScore;
    }

    updateRound = function () {
        document.getElementById("round").textContent = this.roundCounter + 1 + "/5";
    }

    updatePosAndSkew = function () {
        this.skewX += 0.5;
        this.skewY += 0.001;
        if (this.skewX === 180 || this.skewY === 180) {
            this.skewX = 0;
            this.skewY = 0;
            this.popupInfo.style.transform = "skew(" + this.skewX + "deg, " + this.skewY + "deg)";
            return;
        }
        this.popupInfo.style.transform = "skew(" + this.skewX + "deg, " + this.skewY + "deg)";
        var self = this;
        this.popupInterval = requestAnimationFrame( () => {
            self.updatePosAndSkew();
        });
        this.popupTimeout = setTimeout(() => {cancelAnimationFrame(this.popupInterval);}, 7000);
    }

    updateResult = function () {
        this.finishSound.play();
        setTimeout(() =>{this.finishSound.pause();}, 2000);
        if (this.playerScore > this.computerScore) this.popupInfo.innerText = "Congratulations \n You won!!!";
        else this.popupInfo.innerText = "Game Over \n Computer won";
        this.popupInfo.className = "Shown";
        var self = this;
        self.updatePosAndSkew();
        setTimeout(() => {
            clearTimeout(this.popupTimeout);
            this.popupInfo.style.transform = "skew(0deg, 0deg)";
        }, 7000);
    }
}
var game = new Game();



