/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
"use strict";
angular.module("app").directive('imageLoadCompleteEvt', function() {
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, element) {
            element.on("load", function() {
                if (element[0].classList.contains("hide-img")) {
                    element[0].classList.remove("hide-img");
                }
                // once the image is loaded then remove the preloader(span element)
                element.parent().find("span").remove();
            });
        }
    };
});