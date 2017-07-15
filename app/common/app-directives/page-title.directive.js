/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
"use strict";
angular.module("app").directive('pageTitle', ['$rootScope', '$timeout', '$translate',
    function($rootScope, $timeout, $translate) {
        return {
            link: function(scope, element) {

                var listener = function(event, toState) {

                    var title = $translate.instant('default_title');
                    if (toState.data && toState.data.pageTitle) {
                        title = toState.data.pageTitle;
                    }

                    $timeout(function() {
                        element.text(title);
                    }, 0, false);
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
]);