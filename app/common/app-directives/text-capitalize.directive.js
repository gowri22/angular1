/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
angular.module("app").directive('capitalizeText', function(uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue) {
                    var capitalized = inputValue.toUpperCase();
                }


                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            };
            var model = $parse(attrs.ngModel);
            modelCtrl.$parsers.push(capitalize);
            capitalize(model(scope));
        }
    };
});