/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module("app").controller('registerCtrl', ['AuthenticationService', 'UserService', '$timeout', 'messagesFactory', '$state', 'appService', '$uibModal', 'StaticService', function(AuthenticationService, UserService, $timeout, messagesFactory, $state, appService, $uibModal, StaticService) {

    var register = this;
    register.isEmailAlreadyExit = false;
    register.model={};
    register.model.sp_news = false;

    (function() {
        if (appService.checkSessionOnURLChange()) {
            $state.go('account.dashboard');
        }
    })();
    
    register.submitForm = function(form) {
        register.submitted = true;
        if (form.$valid && (register.model.password === register.model.confirmPassword)) {
            getValidateEmailID(register.model.email);
            form.$setPristine();
        } else {
            $timeout(function() {
                angular.element('.custom-error:first').focus();
            }, 200);
        }
    };

    function getTermsNCondtionData() {
        StaticService.getTermsAPI()
            .success(function(data) {
                openTermsNCondtonPrivacyPolicyPopup(data, false);
            }).error(function() {});
    }

    function getPrivacyPolicyData() {
        StaticService.getPrivacyAPI()
            .success(function(data) {
                openTermsNCondtonPrivacyPolicyPopup(data, true);
            }).error(function() {});
    }

    function stuctureFormData() {
        var data = {};
        data.firstName = register.model.firstName;
        data.lastName = register.model.lastName;
        data.email = register.model.email;
        data.password = register.model.password;
        data.sp_news = register.model.sp_news;
        data.role = "PARENT";
        return data;
    }

    function getValidateEmailID(emailId) {
        register.isEmailAlreadyExit = false;
        var emailObj = { "email": emailId };
        UserService.validateEmailIdAPI(emailObj)
            .success(function(data) {
                if (data.message === "Email Acceptable") {
                    getTermsNCondtionData();
                } else {
                    register.isEmailAlreadyExit = true;
                }
            }).error(function(error, status) {
                if (status === 406) {
                    register.isEmailAlreadyExit = true;
                }
            });
    }


    function save() {
        var formData = stuctureFormData();
        var handleSuccess = function(data) {
            messagesFactory.registerSuccessMessages(data);
            $state.go('messages', { data: { "email": formData.email } });
        };

        var handleError = function(error, status) {
            if (error && status) {
                messagesFactory.registerErrorMessages(status);
            }
        };

        UserService.Create(formData)
            .success(handleSuccess)
            .error(handleError);
    }

    function openTermsNCondtonPrivacyPolicyPopup(data, isRegisterUser) {
        $uibModal.open({
            backdrop: 'static',
            keyboard: false,
            windowClass: 'no-animation-modal',
            templateUrl: 'components/user/register/terms-agree-modal.html',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.modalTitle = data.title;
                $scope.isSubmit = isRegisterUser;
                $scope.isExternalHtmlDataLoaded = false;
                $scope.fullHtmlViewURL = data.htmlView;
                $scope.ok = function() {
                    if (isRegisterUser) {
                        save();
                    } else {
                        getPrivacyPolicyData();
                    }
                    $uibModalInstance.close();
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    }
}]);