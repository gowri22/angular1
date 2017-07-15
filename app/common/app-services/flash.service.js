/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('flashService', ['$rootScope', '$cookieStore', 'toaster', function($rootScope, $cookieStore, toaster) {

    var service = {};

    function initService() {
        $rootScope.$on('$locationChangeStart', function() {
            clearFlashMessage();
        });

        function clearFlashMessage() {
            var flash = $rootScope.globals.flash;
            if (flash) {
                if (!flash.keepAfterLocationChange) {
                    delete $rootScope.globals.flash;
                } else {
                    // only keep for a single location change
                    flash.keepAfterLocationChange = false;
                }
            }
        }
    }

    function showPreviousMessage() {
        if ($rootScope.globals.flash) {
            if ($rootScope.globals.flash.type === 'success') {
                toaster.pop({ type: $rootScope.globals.flash.type, closeButton: true, title: "Success", body: $rootScope.globals.flash.message, timeout: 2000 });
            } else {
                toaster.pop({ type: $rootScope.globals.flash.type, closeButton: true, title: "Error", body: $rootScope.globals.flash.message, timeout: 2000 });
            }
        }
    }

    function showSuccess(message, keepAfterLocationChange) {
        $rootScope.globals.flash = {
            message: message,
            type: 'success',
            keepAfterLocationChange: keepAfterLocationChange
        };

        toaster.pop({ type: $rootScope.globals.flash.type, closeButton: true, title: "Success", body: $rootScope.globals.flash.message, timeout: 2500 });
    }

    function showCustomMessage(type, isClear) {
        $rootScope.messages = {
            type: type,
            isClear: isClear
        };
        $cookieStore.put('noSesMes', $rootScope.messages);
    }

    function showError(message, keepAfterLocationChange) {
        $rootScope.globals.flash = {
            message: message,
            type: 'error',
            keepAfterLocationChange: keepAfterLocationChange
        };
        toaster.pop({ type: $rootScope.globals.flash.type, closeButton: true, title: "Error", body: $rootScope.globals.flash.message, timeout: 2000 });
    }

    initService();

    service.showSuccess = showSuccess;
    service.showError = showError;
    service.showCustomMessage = showCustomMessage;
    service.showPreviousMessage = showPreviousMessage;
    return service;

}]);