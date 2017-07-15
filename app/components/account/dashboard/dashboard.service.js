/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('DashboardService', ['$http', '$rootScope', function($http, $rootScope) {

    var service = {};
    var base_url = $rootScope.base_url;

    function getUserID() {
        return $rootScope.globals.currentUser.id;
    }

    service.getAllApi = function() {
        return $http.get(base_url + '/newsfeeds/' + getUserID() + '/listallnewsfeeds');
    };

    service.getByCategory = function() {
        return $http.get(base_url + '/newsfeeds/' + getUserID() + '/categorynewsfeeds');
    };

    return service;

}]);