"use strict";
class Game {
    constructor() {
        this.kickInterval = null;
        this.kickTimeout = null;
        this.goalInterval = null;
        this.goalTimeout = null;
        this.blockInterval = null;
        this.blockTimeout = null;
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
        this.sound = true;
        this.roundCounter = 0;
    }
    init = function () {
        this.roundCounter = 0;
        this.play();
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

    play = function () {
        this.regularState();
        if (this.sound) this.referiSound.play();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                this.kickStage();
                this.IsGoalPromise("проверка гола","закончился раунд ")
                    .then( result => {console.log("получен результат " + result);}
                    )
                    .catch( error => {console.log("не получен результат: " + error);}
                    );
            }
        }, {once: true});
        console.log(this.roundCounter);
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
        this.goalKeeperController.start();
        this.playerController.start();
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
        }, 5500); //5500
    }

    stopGoalStage = function () {
        clearTimeout(this.goalTimeout);
        this.roundCounter += 1;
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        if (this.roundCounter < 5) {
            this.play();
        }
    }

    blockedStage = function () {
        var self = this;
        self.blockStateNoBall();
        self.ballController.blockedStage();
        self.blockInterval = requestAnimationFrame( () => {
            self.blockedStage();
        });
        self.blockTimeout = setTimeout(() => {
            cancelAnimationFrame(self.blockInterval);
            self.stopBlockStage();
        }, 3000);
    }

    stopBlockStage = function () {
        clearTimeout(this.blockTimeout);
        this.roundCounter += 1;
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        if (this.roundCounter < 6) {
            this.play();
        }
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
                    if (this.sound) this.gridSound.play();
                    if (this.sound) this.goalSound.play();
                    self.goalStage();
                    console.log("гол!!!");
                    resolve(result);
                }
                else if (this.sound) {
                    this.ballBlockSound.play();
                    console.log("отбил вратарь");
                    self.blockedStage();
                    resolve(result);
                }
                else if (self.isGoalPost()) {
                    if (this.sound) this.goalPostSound.play();
                    console.log("штанга/перекладина");
                    self.blockedStage();
                    resolve(result);
                }
                else reject("нет гола");
            }, 550);
        });
    }
}
var game = new Game();



