"use strict";

var fieldView = new FieldView(document.getElementById("container"));
var fieldModel = new FieldModel();
var fieldController = new FieldController(fieldModel, fieldView);

fieldController.start();
