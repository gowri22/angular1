/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('CurriculumService', ['$http', '$rootScope', "_", function($http, $rootScope, _) {

    var service = {};
    var base_url = $rootScope.base_url;

    function getUserID() {
        return $rootScope.globals.currentUser.id;
    }

    service.listWordsApi = function() {
        return $http.get(base_url + '/private/' + getUserID() + '/listuserwords');
    };

    service.searchWordApi = function(word) {
        return $http.get(base_url + '/word/' + getUserID() + '/searchWord/' + word);
    };

    service.uploadMultipleFileApi = function(fileArr) {
        var fd = new FormData();
        for (var fileCounter = 0; fileCounter < fileArr.length; fileCounter++) {
            fd.append('content', fileArr[fileCounter]);
        }
        return $http.post(base_url + '/private/' + getUserID() + '/file', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

    service.uploadMultipleFileSafariApi = function(fileArr) {
        return $http.post(base_url + '/file/base64s3', { content: fileArr });
    }

    service.saveWordApi = function(wordData) {
        return $http.post(base_url + '/private/' + getUserID() + '/createword', wordData);
    };

    service.updateWordApi = function(wordID, word) {
        return $http.put(base_url + '/private/' + getUserID() + '/edituserword/' + wordID, word);
    };

    service.deleteWordApi = function(id) {
        return $http.delete(base_url + '/private/' + getUserID() + '/deleteuserword/' + id);
    };

    service.getWordById = function(id) {
        return $http.get(base_url + '/private/' + getUserID() + '/getuserword/' + id);
    };

    service.getGroupWords = function(category) {
        return $http.get(base_url + '/word/' + getUserID() + '/searchCategory/' + category);
    };

    service.updateGroupWordsApi = function(words) {
        return $http.post(base_url + '/wordsettings/' + getUserID() + '/wordsettings', words);
    };
    service.uploadFileApi = function(file) {
        var fd = new FormData();
        fd.append('content', file);
        return $http.post(base_url + '/file/uploads3', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

    service.getObjById = function(data, id) {
        var obj = {};
        _.each(data, function(item) {
            if (item.id === id) {
                obj = item;
            }
        });
        return obj;
    };

    service.getBannedWordsAPI = function() {
        return $http.get(base_url + '/wordsettings/' + getUserID() + '/listbannedwords');
    };

    service.createBannedWordAPI = function(wordObj) {
        return $http.post(base_url + '/wordsettings/' + getUserID() + '/createbannedword', wordObj);
    };

    service.deleteBannedWordAPI = function(bannedWordId) {
        return $http.delete(base_url + '/wordsettings/' + getUserID() + '/deletebanword/' + bannedWordId);
    };

    service.selectedWordGroupCount = function(sourceArr) {
        var selectedWords = [];
        for (var ind = 0; sourceArr.length > ind; ind++) {
            if (sourceArr[ind].groupedflag) {
                selectedWords.push(sourceArr[ind]);
            }
        }
        return selectedWords.length;
    };

    return service;


}]);