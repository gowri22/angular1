/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('PlayerService', ['$http', '$rootScope', "_", function($http, $rootScope, _) {

    var service = {};
    var base_url = $rootScope.base_url;
    var playersData = [];

    service.isPlayerAdded = false;

    function getUserID() {
        return $rootScope.globals.currentUser.id;
    }

    service.getAllApi = function() {
        return $http.get(base_url + '/user/' + getUserID() + '/child/portal');
    };

    service.getWordsApi = function(playerId) {
        return $http.get(base_url + '/activity/' + getUserID() + '/' + playerId);
    };

    service.getLettersWordsApi = function(playerId) {
        return $http.get(base_url + '/word/' + playerId + "/singleletterwords");
    };

    service.getNonsenseWordsApi = function(playerId) {
        return $http.get(base_url + '/word/' + playerId + "/nonsensewords");
    };

    service.getRealWordsApi = function(playerId) {
        return $http.get(base_url + '/word/' + playerId + "/realwords");
    };
    service.getMinibadgesApi = function(playerId) {
        return $http.get(base_url + '/activity/' + getUserID() + '/' + playerId + '/minibadges');
    };

    service.getPlayerHighlightsApi = function(playerId) {
        return $http.get(base_url + '/activity/' + getUserID() + '/' + playerId + '/highlights');
    };

    service.searchWordApi = function(childId) {
        return $http.get(base_url + '/activity/' + getUserID() + '/' + childId);
    };

    service.createApi = function(child) {
        return $http.post(base_url + '/user/v2/' + getUserID() + '/player', child);
    };

    service.deleteApi = function(id) {
        return $http.delete(base_url + '/user/' + getUserID() + '/child/' + id);
    };

    service.updateApi = function(childID, child) {
        return $http.put(base_url + '/user/' + getUserID() + '/child/' + childID + '/edit', child);
    };

    service.saveWordApi = function(wordData) {
        return $http.post(base_url + '/private/' + getUserID() + '/createword', wordData);
    };

    service.exportCsvActivityAPI = function(exportCsv) {
        return $http.get(base_url + '/activity/' + exportCsv);
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

    service.setPlayers = function(data) {
        playersData = data;
    };

    service.getPlayers = function() {
        return playersData;
    };

    service.getPlayerById = function(id) {
        return $http.get(base_url + '/user/' + getUserID() + '/child/' + id);
    };

    service.removeItem = function(data, obj) {
        data.splice(data.indexOf(obj), 1);
    };

    service.getBadges = function(childID) {
        return $http.get(base_url + '/activity/' + getUserID() + '/' + childID + '/bigbadges');
    };

    service.getAvatarsAPI = function() {
        return $http.get(base_url + '/avatar/' + getUserID() + '/get-avatars');
    };

    function checkLetterDataAvailable(sourceData, letter) {
        var letterAvailable = _.find(sourceData, function(item) {
            return item.letter === letter;
        });
        return typeof letterAvailable === "object";
    }

    service.addLetterIfNotExist = function(sourceArr) {
        var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

        var resultArr = [];
        for (var ind = 0; ind < letters.length; ind++) {
            if (!checkLetterDataAvailable(sourceArr, letters[ind])) {
                var emptyObj = {
                    letter: letters[ind],
                    arrayLetters: [],
                    count: 0,
                    lastAttemptedOn: "1403366899"
                };
                resultArr.push(emptyObj);
            }
        }
        return resultArr.concat(sourceArr);
    };

    service.getChartDetaisService = function(badgeId, playerId, chartType) {
        return $http.get(base_url + '/biggraphs/' + badgeId + "/" + playerId + "/" + chartType);
    };

    service.graphDataAPI = function(badgeId, playerId, data, type) {
        return $http.post(base_url + '/bigbadge/graphs/' + badgeId + '/' + playerId + '/' + type, data);
    };

    function selectPeriod(period) {
        var obj = {};
        if (period === 'day') {
            obj.day = '%H';
        } else if (period === 'week') {
            obj.day = '%a';
        } else if (period === 'month') {
            obj.day = '%e %b';
        } else {
            obj.month = '%b %y';
        }
        return obj;
    }

    function tickInterval(period) {
        var value = {};
        if (period === 'day') {
            value = 3600 * 1000;
        } else if (period === 'week') {
            value = 24 * 3600 * 1000;
        } else if (period === 'month') {
            value = 24 * 3600 * 1000;
        } else {
            value = 28 * 24 * 3600 * 1000;
        }
        return value;
    }

    function xAsixTitle(period) {
        var title = "";
        if (period === 'day') {
            title = "<b>Hours</b>";
        } else if (period === 'week') {
            title = "<b>Days</b>";
        } else if (period === 'month') {
            title = "<b>Dates</b>";
        }
        return title;
    }

    service.getChartDataObj = function(options) {
        return {
            useHighStocks: false,
            size: {
                height: 320
            },
            options: {
                exporting: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'rgba(255, 255, 255, 0)'
                },
                tooltip: {
                    // headerFormat: '',
                    pointFormat: 'Progress : {point.y:.2f} %'
                }
            },
            xAxis: {
                type: 'datetime',
                tickInterval: tickInterval(options.type),
                dateTimeLabelFormats: selectPeriod(options.type),
                title: {
                    text: xAsixTitle(options.type)
                }
            },
            yAxis: {
                min: 0,
                tickInterval: options.interval,
                title: {
                    text: '<b>Progress</b>'
                },
                labels: {
                    format: "{value:.1f}" + "%"
                }
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: " ",
                color: '#4CBC96',
                marker: {
                    symbol: 'circle',
                    radius: 3,
                    enabled: true
                },
                data: options.data
            }],
            title: {
                text: ''
            }
        };
    };

    return service;

}]);