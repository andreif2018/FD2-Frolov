"use strict";

class LocStorage {

    constructor(remoteStorage) {
        this.storage = [];
        this.section = "soccer";
        var strData = window.localStorage.getItem(this.section);
        if (strData != null) this.storage = JSON.parse(strData);
        this.remoteStorage = remoteStorage;
        this.localJSONStorage = [];
    }

    addValue = function(value) {
        this.storage.unshift(value);
        localStorage.setItem(this.section, JSON.stringify(this.storage));
        this.localJSONStorage.unshift(value);
        JSON.stringify(this.localJSONStorage);
        this.remoteStorage.storeInfo(this.storage);
    }

    getValue =  function() {
        var self = this;
        try {
            this.remoteStorage.restoreInfo();
        } catch (error) {
            console.error(error);
            $.ajax("data/backupFile.json", { type:'GET', dataType:'json', success: self.success, error: self.errorHandler,
                complete: self.complete,
                xhrFields: { onprogress: self.progress }
            });
        }
        return this.storage;
    }

    errorHandler = function (jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
    }

    progress = function (EO) {
        document.getElementById('IProgress').className="Shown";
        if ( EO.lengthComputable ) {
            var perc=Math.round(EO.loaded/EO.total*100);
            document.getElementById('IProgressPerc').style.width=perc+"%";
        }
    }

    success = function (data) {
        console.log('загруженные через AJAX данные:');
        console.log(data);
    }

    complete = function () {
        document.getElementById('IProgress').style.display="none";
    }
}