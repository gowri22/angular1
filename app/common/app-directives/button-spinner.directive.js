/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
app.directive('spinner', function() {
    return {
        restrict: 'A',
        scope: {
            spinner: '=',
            doIt: "&doIt"
        },
        link: function(scope, element) {
            var spinnerButton = angular.element("<button class='btn btn-lg btn-primary btn-block disabled'><i class='glyphicon glyphicon-repeat spinning'></i>Loading...</button>");
            element.after(spinnerButton);

            scope.$watch('spinner', function(showSpinner) {
                spinnerButton.toggle(showSpinner);
                element.toggle(!showSpinner);
            });
        }
    };
});