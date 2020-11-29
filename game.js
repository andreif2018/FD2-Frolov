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
        this.remoteStorage = new AJAXStorage();
        this.locStorage = new LocStorage(this.remoteStorage);
        this.posX = 0;
        this.posY = 0;
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
        var self = this;
        clearTimeout(this.popupTimeout);
        this.popupInfo.className = "NotShown";
        if (this.roundCounter < 1) { // игра в пять раундов
            this.updateRound();
            this.regularState();
            if (this.sound) this.referiSound.play();
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Shift') {
                    this.kickStage();
                    if (this.sound) this.ballKickSound.play();
                    this.IsGoalPromise("проверка гола","гол!!!")
                        .then( result => {console.log("получен результат " + result);})
                        .catch( error => {
                            console.log(error);
                            self.IsGoalPostPromise("попал ли в штангу/перекладину","штанга/перекладина")
                                .then( result => {console.log("получен результат " + result);})
                                .catch( error => {
                                    console.log( error);
                                    self.IsGoalKeeperBlockPromise("отбил ли вратарь","вратарь отбил")
                                        .then( result => {console.log("получен результат " + result);})
                                        .catch( error => {console.log( error);});
                                    });
                        });
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
        return new Promise( (resolve, reject) => {
            console.log("промис " + name + " создан, запущен...");
            setTimeout( () => {
                if (self.isInTarget() && !self.isGoalKeeperBlock() ) {
                    if (self.sound) {
                        self.goalSound.play();
                        self.gridSound.play();
                    }
                    self.goalStage();
                    self.playerScore += 1;
                    self.updateScore();
                    resolve(result);
                }
                else reject("нет гола");
            }, 555);
        });
    }
    IsGoalPostPromise = function (name, result) {
        var self = this;
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
            }, 0);
        });
    }
    IsGoalKeeperBlockPromise = function (name, result) {
        var self = this;
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
            }, 0);
        });
    }

    updateScore = function () {
        document.getElementById("playerScore").textContent = this.playerScore;
        document.getElementById("computerScore").textContent = this.computerScore;
    }

    updateRound = function () {
        document.getElementById("round").textContent = this.roundCounter + 1 + "of 5";
    }

    updateSkew = function () {
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
            self.updateSkew();
        });
        this.popupTimeout = setTimeout(() => {cancelAnimationFrame(this.popupInterval);}, 7000);
    }

    save = function () {
        var firstName;
        do {
            firstName = prompt("Please, enter your first name");
        } while (firstName == null || firstName.length === 0 );
        var result = firstName + " " + this.playerScore + "-" + this.computerScore + " " +"Computer";
        this.popupInfo.innerText = result;
        this.locStorage.addValue(result);
        return result;
    }

    updateResult = function () {
        this.finishSound.play();
        var popupHTML = "";
        if (this.playerScore > this.computerScore) popupHTML += "<p>Congratulations \n You won!!!</p>";
        else popupHTML += "<p>Game Over \n Computer won</p>";
        this.popupInfo.innerHTML = popupHTML;
        this.popupInfo.className = "Shown";
        var self = this;
        self.updateSkew();
        setTimeout(() => {
            clearTimeout(this.popupTimeout);
            this.popupInfo.style.transform = "skew(0deg, 0deg)";
            popupHTML  += "<input type='button' value='Save result' id='save' onclick='game.save()'>";
            popupHTML += "<input type='button' value='New Game' id='newGame' onclick='game.init()'>";
            this.popupInfo.innerHTML = popupHTML;
        }, 7000);
    }

    updateTranslate = function () {
        this.posX += 1;
        this.posY += 1;
        if (this.posX === 200 || this.skewY === 200) {
            this.popupInfo.style.transform = "translate(0px, 0px)";
            return;
        }
        this.popupInfo.style.transform = "translate(" + this.posX + "px, " + this.posY + "px)";
        var self = this;
        this.popupInterval = requestAnimationFrame( () => {
            self.updateTranslate();
        });
        this.popupTimeout = setTimeout(() => {cancelAnimationFrame(this.popupInterval);}, 7000);
    }

    showRecords = function () {
        var bound;
        var arrayOfRecords = this.locStorage.getValue();
        this.popupInfo.innerText = "Latest 5 games";
        if (arrayOfRecords.length === 0) this.popupInfo.innerText += "\n No available data yet";
        else {
            if (arrayOfRecords.length > 5) {
                bound = 5;
                for (var item = 0; item < bound; item++) this.popupInfo.innerText += "\n"+ arrayOfRecords[item];
            }
            else for (var item = 0; item < arrayOfRecords.length; item++) {
                this.popupInfo.innerText += "\n"+ arrayOfRecords[item];
            }

        }
        this.updateTranslate();
        setTimeout(() => {
            clearTimeout(this.popupTimeout);
            this.popupInfo.style.transform = "translate(0px, 0px)";
            this.popupInfo.innerText = "Latest 5 games";
            if (arrayOfRecords.length === 0) this.popupInfo.innerText += "\n No available data yet";
            else {
                if (arrayOfRecords.length > 5) {
                    bound = 5;
                    for (var item = 0; item < bound; item++) this.popupInfo.innerText += "\n"+ arrayOfRecords[item];
                }
                else for (var item = 0; item < arrayOfRecords.length; item++) {
                    this.popupInfo.innerText += "\n"+ arrayOfRecords[item];
                }
            }
        }, 7000);
    }
}
var game = new Game();
