/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
angular.module("app").directive('badgeItem', function() {
    return {
        restrict: 'AE',
        scope: {
            index: '=index',
            item: '=itemData',
            displayIndex: '=displayIndex',
            callFunc: '&'
        },
        templateUrl: 'components/account/player/big-badges-template.html',
        link: function(scope) {
            if (scope.item.percentage !== "") {
                var value = 130 - (scope.item.percentage * 1.3);
                scope.perValue = 'rect(' + value + 'px,130px,130px,0px)';
                scope.getStyle = function() {
                    return { "clip": scope.perValue };
                };
            }
            if (scope.item.starflag) {
                scope.displayStar = true;
            }
        }
    };
});