/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
angular.module("app").controller('settingsCtrl', ['$rootScope', 'UserService', 'AuthenticationService', 'messagesFactory', '$timeout', 'settingsService', '$cookieStore', function($rootScope, UserService, AuthenticationService, messagesFactory, $timeout, settingsService, $cookieStore) {
    var settings = this;
    settings.model = {};
    settings.model.userData = angular.copy($rootScope.globals.currentUser);
    settings.isEditClicked = false;
    settings.editprofile = false;
    settings.notification = false;
    settings.missingLetters = [];
    settings.selectedMisLetters = [];
    settings.missingletterCount = [];
    settings.selectedCount = 0;

    (function() {
        getNotificationData();
        getMissingLetters();
    })();

    settings.submitForm = function(form) {
        settings.submitted = true;
        settings.editprofile = true;
        $rootScope.globals.flash = "";
        if (form.$valid) {
            saveProfile();
            form.$setPristine();
        } else {
            $timeout(function() {
                angular.element('.custom-error:first').focus();
            }, 200);
        }
    };

    function saveProfile() {

        var handleSuccess = function(data) {
            settings.isEditClicked = false;
            $rootScope.globals.currentUser = settings.model.userData;
            $cookieStore.put('globals', $rootScope.globals);
            messagesFactory.settingseditprofileSuccessMessages(data);
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    saveProfile();
                });
            } else {
                messagesFactory.settingseditprofileErrorMessages(status);
            }
        };
        UserService.Update({
                firstName: settings.model.userData.firstName,
                lastName: settings.model.userData.lastName
            }).success(handleSuccess)
            .error(handleError);
    }

    settings.edit = function() {
        settings.model.userData = angular.copy($rootScope.globals.currentUser);
        settings.isEditClicked = true;
    };

    settings.cancel = function() {
        settings.model.userData = $rootScope.globals.currentUser;
        settings.isEditClicked = false;
    };

    settings.submitchangepassword = function(form) {
        settings.submitted = true;
        $rootScope.globals.flash = "";
        if (form.$valid && (settings.model.passwordData.password === settings.model.passwordData.confirmPassword)) {
            changePassword();
            form.$setPristine();
        } else {
            $timeout(function() {
                angular.element('.custom-error:first').focus();
            }, 200);
        }

    };

    function changePassword() {
        var handleSuccess = function(data) {
            settings.model.passwordData = "";
            messagesFactory.settingschangepasswordSuccessMessages(data);
        };
        var handleError = function(error, status) {
            settings.model.passwordData = "";
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    changePassword();
                });
            } else {
                messagesFactory.settingschangepasswordErrorMessages(status);
            }
        };
        UserService.changePasswordAPI(settings.model.passwordData)
            .success(handleSuccess)
            .error(handleError);
    }


    settings.submitNotifications = function() {
        settings.notification = true;
        $rootScope.globals.flash = "";
        var handleSuccess = function(data) {
            messagesFactory.settingsNotificationsSuccessMessages(data);
        };
        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    settingsService.updateApi(settings.model.notificationObj)
                        .success(handleSuccess)
                        .error(handleError);
                });
            } else {
                messagesFactory.settingsNotificationsErrorMessages(status);
            }
        };
        settingsService.updateApi(settings.model.notificationObj)
            .success(handleSuccess)
            .error(handleError);
    };

    function getNotificationData() {
        var handleSuccess = function(data) {
            settings.model.notificationObj = data;
        };
        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getNotificationData();
                });
            } else {
                messagesFactory.settingsgetNotifictaionsErrorMessages(status);
            }
        };
        settingsService.getApi()
            .success(handleSuccess)
            .error(handleError);
    }

    function getMissingLetters() {
        var handleSuccess = function(data) {
            if (data.length > 0) {
                settings.missingletterCount = data;
                var letterGroups = _.groupBy(data, function(item) {
                    return [item.letter].sort();
                });

                var keys = [];

                for (var k in letterGroups) {
                    if (letterGroups.hasOwnProperty(k)) {
                        keys.push(k);
                    }
                }
                keys.sort();
                for (var i = 0; i < keys.length; i++) {
                    k = keys[i];
                    settings.missingLetters.push(letterGroups[k]);
                }
                settings.missingLetters_row_2 = settings.missingLetters.splice(0, 13);
                updateCount();
            }
        };
        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getMissingLetters();
                });
            } else {
                messagesFactory.getmissinglettesErrorMessages(status);
            }
        };
        settingsService.getMissingCharactersApi()
            .success(handleSuccess)
            .error(handleError);
    }

    settings.updateMissingLetters = function() {
        var handleSuccess = function(data) {
            messagesFactory.updateMissingLettersSuccessMessages(data);
        };
        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    settingsService.updateMissingCharactersApi({ "character": settings.selectedMisLetters })
                        .success(handleSuccess)
                        .error(handleError);
                });
            } else {
                messagesFactory.updateMissingLettersErrorMessages(status);
            }
        };
        settings.selectedMisLetters = [];
        addSelectedLetterIds(settings.missingLetters_row_2, 'add');
        addSelectedLetterIds(settings.missingLetters, 'add');

        settingsService.updateMissingCharactersApi({ "character": settings.selectedMisLetters })
            .success(handleSuccess)
            .error(handleError);
    };

    settings.selectCharacter = function(rowInd, letterInd, type) {
        var missingLtrSec2 = settings.missingLetters_row_2[rowInd][letterInd];
        var missintLtrSec1 = settings.missingLetters[rowInd][letterInd];
        var wLtr = settings.missingLetters[9][letterInd];
        var mLtr = settings.missingLetters_row_2[12][letterInd];
        if (type === 1) {
            missingLtrSec2.missingCharacter = (missingLtrSec2.missingCharacter) ? false : true;
            if (wLtr) {
                wLtr.missingCharacter = ((rowInd === 12) && (missingLtrSec2.letter === "M")) ? missingLtrSec2.missingCharacter : wLtr.missingCharacter;
            }
        } else {
            missintLtrSec1.missingCharacter = (missintLtrSec1.missingCharacter) ? false : true;
            if (mLtr) {
                mLtr.missingCharacter = ((rowInd === 9) && (missintLtrSec1.letter === "W")) ? missintLtrSec1.missingCharacter : mLtr.missingCharacter;
            }
        }

        updateCount();
    };

    settings.isMissilingLetterSelected = function(rowInd, letterInd, type) {
        if (type === 1) {
            if (settings.missingLetters_row_2[rowInd][letterInd].missingCharacter) {
                return true;
            }
        } else {
            if (settings.missingLetters[rowInd][letterInd].missingCharacter) {
                return true;
            }
        }
    };

    settings.clearAllAlphabets = function() {
        addSelectedLetterIds(settings.missingLetters, 'clear');
        addSelectedLetterIds(settings.missingLetters_row_2, 'clear');
        settings.selectedCount = 0;
    };

    settings.isLetterVowel = function(char) {
        var vowels = "AEIOU";
        if (vowels.indexOf(char) !== -1) {
            return true;
        }
    };

    function addSelectedLetterIds(arr, type) {
        for (var i = 0; arr.length > i; i++) {
            for (var ii = 0; arr[i].length > ii; ii++) {
                if (type === 'add') {
                    if (arr[i][ii].missingCharacter && settings.selectedMisLetters.indexOf(arr[i][ii].id) <= 0) {
                        settings.selectedMisLetters.push(arr[i][ii].id);
                    }
                } else {
                    arr[i][ii].missingCharacter = false;
                }
            }
        }
    }

    function updateCount() {
        $timeout(function() {
            settings.selectedCount = angular.element('.missing-letter-keyboard').find('.active').length;
        }, 500);
    }

}]);