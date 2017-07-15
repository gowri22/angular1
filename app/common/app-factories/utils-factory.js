/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('utilsFactory', [function() {

    var factory = {};

    factory.chunkArray = function(arr, size) {
        var newArr = [];
        size = arr.length / 4;
        size = Math.ceil(size);
        for (var i = 0; i < arr.length; i += size) {
            newArr.push(arr.slice(i, i + size));
        }
        return newArr;
    };

    factory.epochLinuxDateToDate = function(date) {
        var d = new Date(0);
        d.setUTCSeconds(date);
        return d;
    };

    factory.dateFormatterForCSV = function(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    };

    factory.UTCtoDate = function(date) {
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    };

    return factory;
}]);