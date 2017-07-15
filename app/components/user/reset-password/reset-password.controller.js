/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module("app").controller('resetPasswordCtrl', ['$scope', 'UserService', '$state', '$timeout', 'auth', 'messagesFactory', 'AuthenticationService', function($scope, UserService, $state, $timeout, auth, messagesFactory, AuthenticationService) {

    var resetPassword = this;
    resetPassword.model = {};

    (function() {
        if (auth.data.message !== "success") {
            messagesFactory.resetpasswordErrorMessages(auth.data.message);
            $state.go('messages');
        }
    })();
    resetPassword.submitForm = function(form) {
        resetPassword.submitted = true;
        if (form.$valid && resetPassword.model.password === resetPassword.model.confirmPassword) {
            save();
            form.$setPristine();
        } else {
            $timeout(function() {
                angular.element('.custom-error:first').focus();
            }, 200);
        }
    };

    function save() {
        var handleSuccess = function(data) {
            resetPassword.data = {};
            AuthenticationService.ClearCredentials();
            messagesFactory.resetpasswordSuccessMessages(data);
            $state.go('messages');
        };

        var handleError = function(error) {
            messagesFactory.resetpasswordErrorMessages(error);
        };

        resetPassword.loadPromise = UserService.resetPasswordAPI(resetPassword.model, $state.params.token)
            .success(handleSuccess)
            .error(handleError);
    }

}]);