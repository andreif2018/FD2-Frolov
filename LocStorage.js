"use strict";

class LocStorage {

    constructor(remoteStorage) {
        this.storage = [];
        this.section = "soccer";
        var strData = window.localStorage.getItem(this.section);
        if (strData != null) this.storage = JSON.parse(strData);
        //this.remoteStorage = remoteStorage;
    }

    addValue = function(value) {
        this.storage.unshift(value);
        localStorage.setItem(this.section, JSON.stringify(this.storage));
        //this.remoteStorage.storeInfo(this.storage);
    }

    getValue =  function(key) {
        //this.remoteStorage.restoreInfo();
        return this.storage;
    }

    deleteValue = function(key) {
        if (key in this.storage) {
            delete this.storage[key];
            localStorage.setItem(this.section, JSON.stringify(this.storage));
            this.remoteStorage.storeInfo(this.storage);
            return true;
        }
        else return false;
    }

    getKeys = function() {
        this.remoteStorage.restoreInfo();
        var keys = [];
        for (var element in this.storage) keys.push(element);
        return keys;
    }

    getSection = function() {
        return this.section
    }
}