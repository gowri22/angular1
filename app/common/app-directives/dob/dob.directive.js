/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
"use strict";
app.directive('dob',['moment', 'ENV', function(moment, ENV) {
    return {
        restrict: 'EA',
        scope: {
            birthDate: '=birthDate',
            playerObj: '=playerObj'
        },
        templateUrl: 'common/app-directives/dob/dob.view.html',
        controller: function($scope, moment, ENV) {

            $scope.days = [];
            $scope.dob = {};
            $scope.dob.year = '';
            $scope.dob.month = '';
            $scope.dob.day = '';
            $scope.months = [
                { 'id': 1, 'name': "common.months.january" },
                { 'id': 2, 'name': "common.months.february" },
                { 'id': 3, 'name': "common.months.march" },
                { 'id': 4, 'name': "common.months.april" },
                { 'id': 5, 'name': "common.months.may" },
                { 'id': 6, 'name': "common.months.june" },
                { 'id': 7, 'name': "common.months.july" },
                { 'id': 8, 'name': "common.months.august" },
                { 'id': 9, 'name': "common.months.september" },
                { 'id': 10, 'name': "common.months.october" },
                { 'id': 11, 'name': "common.months.november" },
                { 'id': 12, 'name': "common.months.december" },
            ];

            $scope.getYears = function(startYear) {
                var currentYear = new Date().getFullYear(),
                    years = [];
                startYear = startYear || currentYear - 130;

                while (startYear <= currentYear) {
                    years.push(startYear++);
                }
                return years.reverse();
            };

            $scope.clear = function () {
                $scope.dob.month = $scope.dob.day = $scope.dob.year = 0;
                $scope.playerObj.IsFutureDate =true;
                $scope.playerObj.dobInvalid = false;
                $scope.playerObj.dobNull = false;
            };

            function setDays(numDays) {
                var days = [],
                    i = 1;
                while (i <= numDays) {
                    days.push(i++);
                }
                $scope.days = days;
            }

            function daysInMonth(month, year) {               
                return new Date(year, month, 0).getDate();
            }

            function setDOBFormate(month, day, year) {
                month = (month) ? month : 0;
                day = (day) ? day : 0;
                year = (year) ? year : 0;

                month = month.toString().length === 1 ? '0' + month : month;
                day = day.toString().length === 1 ? '0' + day : day;

                return month + "/" + day + "/" + year;
            }
            setDays(30);

            $scope.$watchGroup(['dob.month', 'dob.day', 'dob.year'], function(newValues, oldValues, scope) {
                scope.birthDate = setDOBFormate(scope.dob.month, scope.dob.day, scope.dob.year);
                if (scope.dob.month) {
                    setDays(daysInMonth(scope.dob.month, scope.dob.year));
                }
            });

            $scope.$watch('birthDate', function(newValue, oldValue, scope) {
                if (newValue) {
                    var val = newValue.split("/");
                    if (val.length > 1) {
                        if (!isNaN(val[0]) && !isNaN(val[1]) && !isNaN(val[2])) {
                            scope.dob.month = parseInt(val[0]);
                            scope.dob.day = parseInt(val[1]);
                            scope.dob.year = parseInt(val[2]);
                        }
                    } else {
                        if(ENV.language === 'en') {
                            scope.dob.month = new Date(scope.birthDate).getUTCMonth() + 1;
                            scope.dob.day = new Date(scope.birthDate).getUTCDate();
                            scope.dob.year = new Date(scope.birthDate).getUTCFullYear();
                        } else {
                            scope.dob.month = moment(scope.birthDate).tz('Asia/Hong_Kong').format("MM");
                            scope.dob.day = moment(scope.birthDate).tz('Asia/Hong_Kong').format("DD");
                            scope.dob.year = moment(scope.birthDate).tz('Asia/Hong_Kong').format("YYYY");
                        }
                    }
                }
            });

        }
    };
}]);