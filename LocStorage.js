"use strict";

class LocStorage {

    constructor(remoteStorage) {
        this.storage = [];
        this.section = "soccer";
        var strData = window.localStorage.getItem(this.section);
        if (strData != null) this.storage = JSON.parse(strData);
        this.remoteStorage = remoteStorage;
    }

    addValue = function(value) {
        this.storage.unshift(value);
        localStorage.setItem(this.section, JSON.stringify(this.storage));
        this.remoteStorage.storeInfo(this.storage);
    }

    getValue =  function() {
        this.remoteStorage.restoreInfo();
        return this.storage;
    }
}