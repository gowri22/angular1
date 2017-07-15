/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
var app = angular.module('app').config(['$windowProvider', '$translateProvider', '$httpProvider', 'ENV', function($windowProvider, $translateProvider, $httpProvider, ENV) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/',
        suffix: '.json?version=' + ENV.appVersion
    });

    $translateProvider.preferredLanguage(ENV.language);
    $translateProvider.useSanitizeValueStrategy('escape');

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', '$rootScope', 'appService', function($q, $location, $localStorage, $rootScope, appService) {
        $rootScope.ajaxProgress = 0;

        if (!String.prototype.contains) {
            String.prototype.contains = function(str) {
                return (this.indexOf(str) !== -1);
            };
        }
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                appService.makeInputsReadOnly();
                $rootScope.ajaxProgress++;                
                return config;
            },
            'response': function(response) {
                $rootScope.ajaxProgress--;
                appService.isFooterFixed();
                appService.removeReadOnly();
                return response;
            },
            'responseError': function(rejection) {
                if (rejection.status === 403) {
                    $location.path('/login');
                }
                appService.isFooterFixed();
                $rootScope.ajaxProgress--;
                appService.removeReadOnly();
                return $q.reject(rejection);
            }
        };

    }]);

}]);