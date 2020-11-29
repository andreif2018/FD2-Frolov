"use strict";

class AJAXStorage {

    constructor() {
        this.ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
        this.stringName = "FROLOV_FD2_PRO";
        this.dataToStore = null;
        this.updatePassword = null;
        this.callresult = null;
    }

    storeInfo = function(value) {
        this.dataToStore = value;
        this.updatePassword = Math.random();
        var self = this;
        this.callresult = $.ajax( {
                url : self.ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'LOCKGET', n : self.stringName, p : self.updatePassword },
                success : () => {self.lockGetReady()}, error : () => {self.errorHandler()}
            }
        );
    }

    lockGetReady = function() {
        var self = this;
        if ( this.callresult.error !== undefined ) alert(this.callresult.error);
        else {
            this.callresult = $.ajax( {
                    url : self.ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                    data : { f : 'UPDATE', n : self.stringName, v : JSON.stringify(self.dataToStore), p : self.updatePassword },
                    success : () => {self.updateReady()}, error : () => {self.errorHandler()}
                }
            );
        }
    }

    updateReady = function() {
        if ( this.callresult.error !== undefined ) alert(this.callresult.error);
    }

    restoreInfo = function() {
        var self = this;
        this.callresult = $.ajax(
            {
                url : self.ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'READ', n : self.stringName },
                success : () => {self.readReady()}, error : () => {self.errorHandler()}
            }
        );
    }

    readReady = function() {
        if ( this.callresult.error !== undefined ) alert(this.callresult.error);
        else if ( this.callresult.result !== "" ) {
            var info = JSON.parse(this.callresult.responseJSON.result);
            console.log(info);
        }
    }

    errorHandler = function(jqXHR,statusStr,errorStr) {
        alert(statusStr+' '+errorStr);
    }
}