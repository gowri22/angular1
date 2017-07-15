/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module("app").controller('staticCtrl', ['$state', 'StaticService', 'flashService', 'AuthenticationService', '$translate', function($state, StaticService, flashService, authService, $translate) {

    var self = this;
    self.contentFrameURL = "";
    self.isDataLoaded = false;
    if ($state.current.name === "page.privacy-policy") {
        getPrivacyContent();
    } else if ($state.current.name === "page.terms-services") {
        getTemsContent();
    } else if ($state.current.name === "page.warrantyinfo") {
        getWarrentyContent();
    }

    function getWarrentyContent() {
        var handleSuccess = function(data) {
            self.isDataLoaded = true;
            self.contentFrameURL = data.htmlView;
        };
        var handleError = function() {
            if (status === 401) {
                authService.generateNewToken(function() {
                    getWarrentyContent();
                });
            } else {
                flashService.showError($translate.instant('common.messages.error_getting_data'), false);
            }
        };
        self.isDataLoaded = false;
        StaticService.getwarrantyAPI()
            .success(handleSuccess)
            .error(handleError);
    }

    function getPrivacyContent() {
        var handleSuccess = function(data) {
            self.isDataLoaded = true;
            self.contentFrameURL = data.htmlView;
        };

        var handleError = function() {
            if (status === 401) {
                authService.generateNewToken(function() {
                    getPrivacyContent();
                });
            } else {
                flashService.showError($translate.instant('common.messages.error_getting_data'), false);
            }
        };
        self.isDataLoaded = false;
        StaticService.getPrivacyAPI()
            .success(handleSuccess)
            .error(handleError);
    }

    function getTemsContent() {
        var handleSuccess = function(data) {
            self.isDataLoaded = true;
            self.contentFrameURL = data.htmlView;
        };

        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    getTemsContent();
                });
            } else {
                flashService.showError($translate.instant('common.messages.error_getting_data'), false);
            }
        };
        self.isDataLoaded = false;
        StaticService.getTermsAPI()
            .success(handleSuccess)
            .error(handleError);

    }

}]);