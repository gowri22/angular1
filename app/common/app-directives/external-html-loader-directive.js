/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
angular.module('app').directive('externalHtmlPageLoaderDir', ['$parse', function($parse) {
    return {
        scope: {
            htmlPageUrl: '=',
            isExternalHtmlDataLoaded: '='
        },
        restrict: 'AE',
        link: function($scope, element, attrs) {
                var htmlPageUrl = $parse(attrs.htmlPageUrl)($scope.$parent);

                function loadExternalHtmlPageData(htmlPageUrl) {
                    if (!htmlPageUrl) {
                        throw new Error('htmlPageUrl is required!');
                    }
                    //append the external html content to div
                    element.load(htmlPageUrl, function(responseTxt, statusTxt) {
                        if (statusTxt === "success") {
                            //Success - "External content loaded successfully!"
                            $scope.isExternalHtmlDataLoaded = true;
                            $scope.$apply();
                            // once the html data is loaded then remove the preloader(span element)
                            element.parent().find("span").remove();
                        }
                        if (statusTxt === "error") {
                            //Error - "Error: " + xhr.status + ": " + xhr.statusText
                        }
                    });
                }

                htmlPageUrl = (htmlPageUrl.valueOf()) ? htmlPageUrl : "";
                loadExternalHtmlPageData(htmlPageUrl);
            }
            //end of link method
    };
}]);