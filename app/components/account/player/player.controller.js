/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module("app").controller('playerCtrl', ['$timeout', '$rootScope', '$state', 'PlayerService', 'messagesFactory', 'flashService', '$uibModal', '$translate', 'AuthenticationService', '_', 'utilsFactory', 'appService', '$window','playersData', function($timeout, $rootScope, $state, PlayerService, messagesFactory, flashService, $uibModal, $translate, AuthenticationService, _, utilsFactory, appService, $window, playersData) {
    var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";

    var player = this;
    player.maxPlayersLimit = $rootScope.globals.currentUser.playerLimit;
    player.model = {};
    player.model.wordTypeUI = "All";
    player.chartAllTypeData = [];
    player.chartTabType = "";
    player.data = {};
    player.playerObj = {};
    player.highlights = {};
    player.splitBadgesData = [];
    player.miniBadges = [];
    player.wordsData = [];
    player.realWordsData = [];
    player.nonsenseWordsData = [];
    player.lettersWordsData = [];
    player.csvData = [];
    player.isNoPlayer = false;
    player.getAllplayers = false;
    player.reverse = false;
    player.clicked = false;
    player.itemsPerPage = player.viewby;
    player.displayChartIndex = 0;
    player.gridCount = 4;
    player.sortType = {};
    player.currentPage = 1;
    player.itemsPerPage = 50;
    player.playedTime = "";
    var wordsCsvData = []; 
    player.data.playersList = playersData.data;
        
    player.playerTableSort = function(type, sourceArray) {
        if (typeof player.sortType.reverse === "undefined") {
            player.sortType.reverse = false;
        } else {
            player.sortType.reverse = (player.sortType.reverse) ? false : true;
        }
        player.sortType.column = type;
        sourceArray = appService.simpleSort(sourceArray, type, player.sortType.reverse);
    };

    (function() {
        getGlobalvalues();
        if (player.data.playersList.length > 0) {
            var playerId = player.data.playersList[0].id;
            PlayerService.setPlayers(player.data.playersList);
            if ($state.params.id) {
                playerId = $state.params.id;
            }
            $state.go('account.players.details', { id: playerId });
        }
        if (PlayerService.getPlayers().length > 0 && $state.params.id && !PlayerService.isPlayerAdded) {
            player.data.playersList = PlayerService.getPlayers();
            getPlayerById($state.params.id);
        } else {
            PlayerService.isPlayerAdded = false;
        }
    })();

    player.onWordTypeChanges = function() {
        wordsCsvData = [];
        switch (player.model.wordTypeUI) {
            case "All":
                player.currentPage = 1;
                getWords(player.playerObj.id);
                break;
            case "Real Words":
                player.currentPage = 1;
                getRealWords(player.playerObj.id);
                break;
            case "Nonsense Words":
                player.currentPage = 1;
                getNonsenseWords(player.playerObj.id);
                break;
            case "Letters":
                getLettersWords(player.playerObj.id);
                break;
        }
    };

    player.addPlayer = function() {
        addPlayerHandler();
    };

    function addPlayerHandler() {
        AuthenticationService.getAppGlobalsAPI(userID)
            .success(function(data) {
                if (data.playerCount >= data.playerLimit) {
                    $uibModal.open({
                        templateUrl: 'common/app-directives/modal/custom-modal.html',
                        windowClass: 'no-animation-modal',
                        controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                            $scope.modalTitle = $translate.instant('player.messages.player_limit');
                            $scope.modalBody = $translate.instant('player.messages.max_players');
                            $scope.modalType = 'Error';
                            $scope.close = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }]
                    });
                } else {
                    $state.go("account.addplayer");
                }
            })
            .error(function(error, status) {
                if (status === 401) {
                    AuthenticationService.generateNewToken(function() {
                        addPlayerHandler();
                    });
                }
            });
    }

    player.bigBadgesData = function(index) {
        var currentIndex = index * player.gridCount;
        return player.bigBadges.slice(currentIndex, currentIndex + player.gridCount);
    };

    function getChartMinVal(data) {
        return _.min(data, function(o) { return (o[1]) ? o[1] : 0; });
    }

    function getChartMaxVal(data) {
        return _.max(data, function(o) { return (o[1]) ? o[1] : 0; });
    }

    function getInterval(maxVal) {
        return maxVal / 9;
    }

    function currentDayFirstLastHour() {
        var obj = {},
            curr = new Date();
        var first = new Date();
        first.setHours(0, 0, 0, 0);
        var last = new Date();
        last.setHours(23, 59, 0)
        return {
            fromDate: first,
            toDate: last,
            currentDate: new Date()
        };
    }

    function currentWeekFirstLastDay() {
        var obj = {};
            var curr = new Date();
            var day = curr.getDay();
            var first = new Date(curr.getTime() - 60*60*24* day*1000); //will return firstday (ie sunday) of the week
            var last = new Date(first.getTime() + 60*60*24*6*1000);
        return {
            fromDate:  first.toISOString(),
            toDate:  last.toISOString(),
            currentDate: new Date()
        };
    }

    function currentMonthFirstandLastDay() {
        var date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth();
        return {
            fromDate: new Date(y, m, 1).toISOString(),
            toDate: new Date(y, m + 1, 0).toISOString(),
            currentDate: new Date()
        };
    }

    function graphOptions(period) {
        var obj = {};
        switch (period) {
            case "day":
                obj = currentDayFirstLastHour();
                break;
            case "week":
                obj = currentWeekFirstLastDay();
                break;
            case "month":
                obj = currentMonthFirstandLastDay();
                break;
        }
        return obj;
    }

    function loadGraphData(period, options) {
        PlayerService.graphDataAPI(player.bigbadgedetails.id, player.playerObj.id, options, period).success(function(data) {
            player.selectedChartData = data;
            player.chartTabType = period;
            player.highchartsNG = PlayerService.getChartDataObj({
                type: period,
                data: parseChartTypeData(player.selectedChartData),
                min: getChartMinVal(player.selectedChartData)[1],
                max: getChartMaxVal(player.selectedChartData)[1],
                interval: getInterval(getChartMaxVal(player.selectedChartData)[1])
            });
        }).error(function(err, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    loadGraphData(period);
                });
            } else {
                flashService.showError($translate.instant("player.messages.error_chart_data"), false);
            }
        });
    }

    player.selectPeriodData = function(period) {
        if (player.chartTabType === period) {
            return false;
        } else {
            loadGraphData(period, graphOptions(period));
        }
    };

    function addDummyDataPointsInChart(dataPointCount, dateObj) {
        var dataPointArr = [],
            dpMilisecond, currentDt = dateObj;
        currentDt.setHours(0, 0, 0);
        for (var dtCntr = 0; dtCntr < dataPointCount; dtCntr++) {
            dpMilisecond = currentDt.getTime();
            dataPointArr.push([dpMilisecond, null]);
            currentDt = new Date(currentDt.getTime() + 86400000);
        }
        return dataPointArr;
    }

    function parseChartTypeData(data) {
        if (data.length > 0) {
            var chrtTypeObjArr = {},
                epochToDate;
            for (var chrttypCntr = 0; chrttypCntr < data.length; chrttypCntr++) {
                chrtTypeObjArr = data[chrttypCntr];
                if (chrtTypeObjArr && chrtTypeObjArr.length > 1) {
                    epochToDate = utilsFactory.epochLinuxDateToDate(chrtTypeObjArr[0] / 1000);
                    chrtTypeObjArr[0] = utilsFactory.UTCtoDate(epochToDate);
                    chrtTypeObjArr[1] = chrtTypeObjArr[1] < 0 ? 0 : chrtTypeObjArr[1];
                }
            }
        } else {
            var today = new Date(),
                totalDays, startDate;
            if (player.chartTabType === "week") {
                startDate = new Date(today.setDate(today.getDate() - today.getDay()));
                totalDays = 8;
                data = addDummyDataPointsInChart(totalDays, startDate);
            } else if (player.chartTabType === "month") {
                startDate = new Date(today.setDate(1));
                totalDays = (new Date(today.getFullYear(), today.getMonth(), 0).getDate()) - 1;
                data = addDummyDataPointsInChart(totalDays, startDate);
            }
        }
        return data
    }

    player.showGraph = function(index, colIndex) {
        if (index === player.showRow && colIndex === player.showColumn && player.clicked) {
            player.clicked = false;
            return false;
        }
        player.clicked = true;
        player.showRow = index;
        player.showColumn = colIndex;
        var count = 0;

        if (player.bigBadges.length > 0) {
            for (var j = 0; j < player.bigBadges.length; j++) {
                if (player.showRow === j) {
                    for (var k = 0; k < player.bigBadges.length; k++) {
                        if (player.showColumn === k) {
                            if (player.bigBadges[count].percentage === null) {
                                player.bigBadges[count].colorCode = "#BABCBE";
                            }
                            player.bigbadgedetails = player.bigBadges[count];
                            break;
                        } else {
                            count++;
                        }
                    }
                    break;
                } else {
                    count = count + player.gridCount;
                }
            }
        }
        player.highchartsNG = PlayerService.getChartDataObj({
            type: '',
            data: [],
            min: 0,
            max: 0,
            interval: 0
        });

        player.chartAllTypeData = [];
        player.chartTabType = "";
        if (player.bigbadgedetails.percentage !== null) {
            loadGraphData('day', currentDayFirstLastHour());
        }

    };

    function getPlayers() {
        PlayerService.getAllApi(userID)
            .success(function(data) {
                player.isNoPlayer = true;
                if (data.length > 0) {
                    var playerId = data[0].id;
                    PlayerService.setPlayers(data);
                    player.data.playersList = PlayerService.getPlayers();
                    if ($state.params.id) {
                        playerId = $state.params.id;
                    }
                    $state.go('account.players.details', { id: playerId });
                }
            })
            .error(function(error, status) {
                if (status === 401) {
                    AuthenticationService.generateNewToken(function() {
                        getPlayers();
                    });
                } else {
                    messagesFactory.getPlayersError(status);
                }
            });
    }

    function getPlayerById(playerId) {
        PlayerService.getPlayerById(playerId).success(function(data) {
            getPlayerHighlights(playerId);
            getBigBadges(playerId);
            player.playerObj = data;
            player.getAllplayers = true;
        }).error(function(err, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getPlayerById(playerId);
                });
            } else {
                flashService.showError($translate.instant("player.messages.error_getting_players"), false);
            }
        });
    }

    function getWords(childId) {
        var handleSuccess = function(data) {
            if (data.wordData.length > 0) {
                player.wordsData = [];
                player.allWordUrl = data.url;
                player.wordData = data.wordData;
                var allWordObj = {};
                for (var allWordsInd = 0; allWordsInd < data.wordData.length; allWordsInd++) {
                    allWordObj = data.wordData[allWordsInd];
                    player.wordsData.push(allWordObj);
                }
                player.wordsData = appService.simpleSort(player.wordsData, 'endtime', true);
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getWords(childId);
                });
            } else {
                messagesFactory.getPlayerwordsError(status);
            }
        };

        PlayerService.getWordsApi(childId)
            .success(handleSuccess)
            .error(handleError);
    }

    function getRealWords(childId) {
        var handleSuccess = function(data) {
            if (data.wordData.length > 0) {
                player.realWordUrl = data.url;
                player.wordData = data.wordData;
                player.realWordsData = [];
                var realWordObj = {};
                for (var realWordIndex = 0; realWordIndex < data.wordData.length; realWordIndex++) {
                    realWordObj = data.wordData[realWordIndex];
                    player.realWordsData.push(realWordObj);
                }
                player.realWordsData = appService.simpleSort(player.realWordsData, 'endtime', true);
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getRealWords(childId);
                });
            } else {
                messagesFactory.getPlayerwordsError(status);
            }
        };

        PlayerService.getRealWordsApi(childId)
            .success(handleSuccess)
            .error(handleError);
    }

    function getNonsenseWords(childId) {
        var handleSuccess = function(data) {
            if (data.wordData.length > 0) {
                player.nonsenseWordUrl = data.url;
                player.wordData = data.wordData;
                player.nonsenseWordsData = [];
                var nonsenseWordObj = {};
                for (var nonsenceWordIndex = 0; nonsenceWordIndex < data.wordData.length; nonsenceWordIndex++) {
                    nonsenseWordObj = data.wordData[nonsenceWordIndex];
                    player.nonsenseWordsData.push(nonsenseWordObj);
                }
                player.nonsenseWordsData = appService.simpleSort(player.nonsenseWordsData, 'endtime', true);
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getNonsenseWords(childId);
                });
            } else {
                messagesFactory.getPlayerwordsError(status);
            }
        };

        PlayerService.getNonsenseWordsApi(childId)
            .success(handleSuccess)
            .error(handleError);
    }

    function getLettersWords(childId) {
        var handleSuccess = function(data) {
            if (data.wordData.length > 0) {
                player.letterWordUrl = data.url;
                player.wordData = data.wordData;
                player.lettersWordsData = [];
                var lettersObj = {};
                for (var lettersIndex = 0; lettersIndex < data.wordData.length; lettersIndex++) {
                    lettersObj = data.wordData[lettersIndex];
                    if(lettersObj.lastAttempts && lettersObj.lastAttempts.length >0){
                        lettersObj.lastAttempts = lettersObj.lastAttempts.replace(/(?=,(?!"))(,(?!{))/g," ");
                    }
                    if(lettersObj.placements && lettersObj.placements.length >0){
                        lettersObj.placements = lettersObj.placements.replace(/(?=,(?!"))(,(?!{))/g," ");
                    }
                    player.lettersWordsData.push(lettersObj);
                }
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getLettersWords(childId);
                });
            } else {
                messagesFactory.getPlayerwordsError(status);
            }
        };

        PlayerService.getLettersWordsApi(childId)
            .success(handleSuccess)
            .error(handleError);
    }

    player.exportCsvActivity = function(wordType) {
        if(wordType === 'All') {
            $window.open(player.allWordUrl, '_blank');
        } else if(wordType === 'Real Words') {
            $window.open(player.realWordUrl, '_blank');
        } else if(wordType === 'Nonsense Words') {
            $window.open(player.nonsenseWordUrl, '_blank');
        } else if(wordType === 'Letters') {
            $window.open(player.letterWordUrl, '_blank');
        }
      
    };

    function getMinibadges(playerId) {
        var handleSuccess = function(data) {
            if (data.length > 0) {
                player.miniBadges = data;
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getMinibadges(playerId);
                });
            } else {
                messagesFactory.getminibadgessError(status);
            }
        };

        PlayerService.getMinibadgesApi(playerId)
            .success(handleSuccess)
            .error(handleError);
    }

    function getBigBadges(playerId) {
        PlayerService.getBadges(playerId)
            .success(function(data) {
                player.bigBadges = sortWordsData(data);
                splitBadgesData();
            })
            .error(function(err, status) {
                if (status === 401) {
                    AuthenticationService.generateNewToken(function() {
                        getBigBadges(playerId);
                    });
                } else {
                    flashService.showError($translate.instant("player.messages.error_getting_bigbadges"), false);
                }
            });
    }

    function getPlayerHighlights(playerId) {
        var handleSuccess = function(data) {
            player.highlights = parsePlayerHighlitsData(data);
            if (player.highlights.totalPlayedTime) {
                var timePlayed = player.highlights.timePlayedInMin.split(':');
                if (parseInt(timePlayed[0]) > 0) {
                    var hours = parseInt(timePlayed[0]) > 1 ? 'Hrs' : 'Hr';
                    player.playedTime = timePlayed[0] + ' ' + hours + ' ' + Math.round(timePlayed[1]) + ' ' + 'Min';
                } else if (parseInt(timePlayed[1]) > 0) {
                    player.playedTime = timePlayed[1] + ' ' + 'Min' + ' ' + Math.round(timePlayed[2]) + ' ' + 'Sec';
                } else if (parseInt(timePlayed[2]) > 0) {
                    player.playedTime = Math.round(timePlayed[2]) + ' ' + 'Sec';
                }
            }

        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getPlayerHighlights(playerId);
                });
            } else {
                messagesFactory.getPlayerHighlightsError(status);
            }
        };

        PlayerService.getPlayerHighlightsApi(playerId)
            .success(handleSuccess)
            .error(handleError);
    }

    //Parse Player Data
    function parsePlayerHighlitsData(data) {
        var playerHighlightObj = data
        var miliSec = playerHighlightObj.totalPlayedTime,
            hours = Math.floor(miliSec / 3600000),
            minutes = Math.floor((miliSec % 3600000) / 60000),
            seconds = Math.floor(((miliSec % 360000) % 60000) / 1000);

        playerHighlightObj.timePlayedInMin = hours + ":" + minutes + ":" + seconds;
        return playerHighlightObj;
    }

    function splitBadgesData() {
        if (player.bigBadges.length > 0) {
            var reminderVal = player.bigBadges.length % player.gridCount;
            if (reminderVal > 0) {
                var repeater = player.gridCount - reminderVal;
                for (var i = 0; i < repeater; i++) {
                    player.bigBadges.push({});
                }
            }

            for (var ii = 0; ii < player.bigBadges.length / player.gridCount; ii++) {
                player.splitBadgesData.push({});
            }
        }
    }

    function sortWordsData(arr) {
        arr.sort(function(a, b) {
            return a.incrementflag - b.incrementflag;
        });
        return arr;
    }

    player.getWordsClickHandler = function() {
        getWords(player.playerObj.id);
    };

    player.getMiniBadgesClickHandler = function() {
        getMinibadges(player.playerObj.id);
    };

    player.getBigBadgesClickHandler = function() {
        getBigBadges(player.playerObj.id);
    };

    function getGlobalvalues(){
        AuthenticationService.getAppGlobalsAPI(userID)
            .success(function(data) {
                $rootScope.playerCount = data.playerCount;
                $rootScope.playerLimit = data.playerLimit;
                $rootScope.availableplayers = $rootScope.playerLimit - $rootScope.playerCount;
            })
            .error(function(error, status){
                if (status === 401) {
                    AuthenticationService.generateNewToken(function() {
                    getGlobalvalues();
                    });
                }
            });
    }

}]);

app.directive('resize', function($window) {
    return function(scope) {
        var w = angular.element($window);
        scope.getWindowDimensions = function() {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };
        scope.$watch(scope.getWindowDimensions, function(newValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function() {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function() {
            scope.$apply();
        });
    };
});