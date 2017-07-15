/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('UserService', ['$http', '$rootScope', function($http, $rootScope) {

    var service = {};
    var base_url = $rootScope.base_url;

    function getUserID() {
        return $rootScope.globals.currentUser.id;
    }

    service.Create = function(user) {
        return $http.post(base_url + '/user/register', user);
    };
    service.Update = function(user) {
        return $http.put(base_url + '/user/' + getUserID() + '/edit-profile', user);
    };
    service.changePasswordAPI = function(user) {
        return $http.post(base_url + '/user/' + getUserID() + '/change-password', user);
    };
    service.forgotPasswordAPI = function(user) {
        return $http.post(base_url + '/portal/user/forgot-password', user);
    };
    service.resendActivationEmailAPI = function(user) {
        return $http.post(base_url + '/user/resendemail', user);
    };
    service.authorizeTokenAPI = function(baseUrl, tokenID) {
        return $http.get(baseUrl + '/user/verify/token/' + tokenID);
    };
    service.resetPasswordAPI = function(user, token) {
        return $http.post(base_url + '/user/reset-password?token=' + token, user);
    };
    service.confirmRegistrationAPI = function(tokenID) {
        return $http.get(base_url + '/user/confirmation/' + tokenID);
    };
    service.updateTermsConditionPrivacyPolicy = function(parentId, type, body) {
        return $http.put(base_url + '/user/' + parentId + '/cms/' + type, body);
    };
    service.validateEmailIdAPI = function(emailBody) {
        return $http.post(base_url + '/portal/user/validate/email', emailBody);
    };
    return service;

}]);