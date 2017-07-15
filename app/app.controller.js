/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
"use strict";
angular.module("app").controller("appCtrl", ['$scope', '$rootScope', '$location', 'AuthenticationService', '$state', '$cookieStore', '$uibModal', function($scope, $rootScope, $location, AuthenticationService, $state, $cookieStore, $uibModal) {
    $scope.curUrl = "";
    $scope.logout = function() {
        AuthenticationService.logoutApi();
        $state.go('login');
        $cookieStore.remove('globals');
    };

    $scope.showLogoutBtn = function() {
        var currentUser = $rootScope.globals.currentUser;
        var currentUrl = $location.path();
        var showLogout = true;
        var restrictedURLS = ['/login', '/register', '/forgot-password', '/user/confirmation', '/messages'];
        for (var ind = 0; restrictedURLS.length > ind; ind++) {
            if (currentUrl.indexOf(restrictedURLS[ind]) > -1) {
                showLogout = false;
            }
        }
        return showLogout && currentUser;
    };

    $scope.enableBg = function() {
        var restrictedURLS = ['/login', '/register', '/forgot-password', '/reset-password'];
        var currentUrl = $location.path();
        var showBg = false;
        for (var ind = 0; restrictedURLS.length > ind; ind++) {
            if (currentUrl.indexOf(restrictedURLS[ind]) > -1) {
                showBg = true;
            }
        }
        return showBg;
    };

    $scope.navigateTeacher = function() {
        $uibModal.open({
            templateUrl: 'common/app-directives/modal/teacher-parent-navigate-modal.html',
            windowClass: 'no-animation-modal',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.close = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    };

}]);