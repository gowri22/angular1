/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('StaticService', ['$http', '$rootScope', function($http, $rootScope) {

    var service = {};
    var base_url = $rootScope.base_url;

    service.getPrivacyAPI = function() {
        return $http.get(base_url + '/cms/v2/listCmsbyCategory/privacy/PARENT');
    };

    service.getTermsAPI = function() {
        return $http.get(base_url + '/cms/v2/listCmsbyCategory/terms/PARENT');
    };

    service.getwarrantyAPI = function() {
        return $http.get(base_url + '/cms/listCmsbyCategory/warranty');
    };

    return service;
}]);