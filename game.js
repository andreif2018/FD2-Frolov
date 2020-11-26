"use strict";
class Game {
    constructor() {
        this.kickInterval = null;
        this.kickTimeout = null;
        this.goalInterval = null;
        this.goalTimeout = null;
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
    }

    start = function () {
        this.regularState();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                console.log("kick");
                this.kickStage();
                this.createTimerPromise("проверка гола","гол!!!")
                    .then( result => {
                            console.log("получен результат " + result);
                        }
                    )
                    .catch( error => {
                            console.log("случилась ошибка: " + error);
                        }
                    );
            }
        }, {once : true});
    }

    regularState = function () {
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.fieldController.start();
        this.goalKeeperController.start();
        this.playerController.start();
        this.ballController.start();
    }

    regularStateNoBall = function () {
        this.ctx.clearRect(0, 0, this.container.width, this.container.height);
        this.fieldController.start();
        this.goalKeeperController.start();
        this.playerController.start();
    }

    kickStage = function () {
        var self = this;
        self.regularStateNoBall();
        self.ballController.kick();
        self.kickInterval = requestAnimationFrame( () => {
            self.kickStage();
            });
        self.kickTimeout = setTimeout(() => {
            cancelAnimationFrame(self.kickInterval);
        }, 550);//через 550 долетает до ворот
    }

    isGoalState = function () {
        return this.ballView.ballX >= this.goalKeeperView.leftHandX &&
            this.ballView.ballX <= this.goalKeeperView.rightHandX &&
            this.ballView.ballY >= this.goalKeeperView.leftHandY &&
            this.ballView.ballY <= this.goalKeeperView.bootY;
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
            self.regularState();
        }, 5500); //5500
    }

    stopGoalStage = function () {
        clearTimeout(this.goalTimeout);
    }

    createTimerPromise = function (name, result) {
        var self = this;
        return new Promise( (resolve, reject) => {
            console.log("промис " + name + " создан, запущен...");
            setTimeout( () => {
                if ( !self.isGoalState() ) {
                    resolve(result);
                    self.goalStage();
                }
                else reject("нет гола");
            }, 550);
        });
    }

}

var game = new Game();
game.start();



