/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module("app").controller('loginCtrl', ['$state', 'AuthenticationService', '$timeout', 'UserService', 'messagesFactory', 'appService', '$location', function($state, AuthenticationService, $timeout, UserService, messagesFactory, appService, $location) {

    var login = this;
    login.model = {};
    login.showResendOption = false;
    var location = $location.search()
    var isAdminAcess = location && location.access && location.token;

    (function() {      
        if (isAdminAcess) {
            AuthenticationService.adminLoginAPI(location.access, location.token)
                .success(function(response) {
                    AuthenticationService.SetCredentials(response);
                    $state.go('account.dashboard');
                })
                .error(function(error) {

                });
            }

        if (!isAdminAcess && appService.checkSessionOnURLChange()) {
            $state.go('account.dashboard');
        }

        login.model = AuthenticationService.getRememberMe();
        appService.isFooterFixed();
    })();

    login.submitForm = function(form) {
        if (form.$valid || (login.model.email && login.model.password)) {
            loginAction();
            form.$setPristine();
        } else {
            $timeout(function() {
                angular.element('.custom-error:first').focus();
            }, 200);
        }
    };

    login.onResendEmail = function() {
        var handleSuccess = function(data) {
            messagesFactory.registerSuccessMessages(data);
            $state.go('messages', { data: { "email": login.model.email } });
        };
        var handleError = function(error, status) {
            if (error && status) {
                messagesFactory.forgotErrorMessages(status);
            }
        };

        UserService.resendActivationEmailAPI({ "email": login.model.email })
            .success(handleSuccess)
            .error(handleError);
    };

    function stuctureFormData() {
        var data = {};
        data.identifier = login.model.email;
        data.password = login.model.password;
        return data;
    }

    function loginAction() {
        var handleSuccess = function(data) {
            AuthenticationService.setRememberMe(login.model);
            AuthenticationService.SetCredentials(data, login.model);
            $state.go('account.dashboard');
        };
        var handleError = function(error, status) {

            if (error && status) {
                login.showResendOption = (status === 424) ? true : false;
                login.model.password = '';
                messagesFactory.loginErrorMessages(status);

            }
        };
        AuthenticationService.loginApi(stuctureFormData())
            .success(handleSuccess)
            .error(handleError);
    }

}]);