"use strict";

var fieldView = new FieldView(document.getElementById("container"));
var fieldModel = new FieldModel(fieldView);
var fieldController = new FieldController(fieldModel, fieldView);
fieldController.start();
fieldController.model.goalStage();
//fieldController.model.stopGoalStage();