/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('appService', ['$rootScope', '$timeout', '$cookieStore', '$localStorage', function($rootScope, $timeout, $cookieStore, $localStorage) {
    var service = {};

    service.handleOffline = function(uibModal, state, apiError) {
        if (apiError) {
            updateOnlineStatus();
            return false;
        }

        function updateOnlineStatus() {
            var condition = navigator.onLine ? "online" : "offline";
            if (condition === "offline" || apiError) {
                uibModal.open({
                    keyboard: false,
                    templateUrl: 'common/app-directives/modal/offline-modal.html',
                    controller: ['$scope', '$state', '$uibModalInstance', function($scope, $state, $uibModalInstance) {

                        $scope.close = function() {
                            $uibModalInstance.dismiss('cancel');
                            $state.reload();
                        };
                    }]
                });
            } else {
                state.reload();
            }
        }
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    };

    service.checkSessionOnURLChange = function() {
        $rootScope.globals = ($cookieStore.get('globals')) ? $cookieStore.get('globals') : {};
        return ($rootScope.globals.currentUser) ? true : false;
    };

    service.onSessionRedirections = function(currentUrl) {
        var restrictedURLS = ['/login', '/register', '/forgot-password', '', '/user/confirmation'];
        return (($.inArray(currentUrl, restrictedURLS) !== -1) && service.checkSessionOnURLChange()) ? true : false;
    };

    service.updateCookieStore = function() {
        $cookieStore.put('globals', $rootScope.globals);
    };

    service.removeSession = function() {
        $cookieStore.remove('globals');
        $rootScope.globals = {};
        delete $localStorage.token;
    };

    service.isFooterFixed = function() {
        $rootScope.isFooterFix = ($rootScope.globals.currentUser) ? true : false;
        (function($) {
            $.fn.hasScrollBar = function() {
                return this.get(0).scrollHeight > this.height();
            };
        })(jQuery);

        $timeout(function() {
            $rootScope.isFooterFix = $('body').hasScrollBar();
        }, 200);
    };

    service.makeInputsReadOnly = function () {
        angular.element('input[type=text]').prop("readonly", true);
        $(':input[type="submit"]').prop('disabled', true);
    };

    service.removeReadOnly = function () {
        angular.element('input[type=text]').prop("readonly", false);
        $(':input[type="submit"]').prop('disabled', false);
    };

    service.getKeysOfCollection = function(obj) {
        obj = angular.copy(obj);
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    };

    service.simpleSort = function(sourceArr, property, reverse) {
        sourceArr.sort(function(a, b) {
            var isTypeString = typeof a[property] === "string";
            var prop_a = (isTypeString) ? a[property].toLowerCase() : a[property];
            var prop_b = (isTypeString) ? b[property].toLowerCase() : b[property];
            if (prop_a < prop_b) {
                return -1;
            }
            if (prop_a > prop_b) {
                return 1;
            }
            return 0;
        });

        for (var i = 0; i < sourceArr.length; i++) {
            sourceArr[i][property];
        }

        return (reverse) ? sourceArr.reverse() : sourceArr;
    };

    return service;

}]);