/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
angular.module("app").controller('dashboardCtrl', ['DashboardService', 'messagesFactory', '$state', '$stateParams', '$rootScope', 'AuthenticationService', 'appService', '$uibModal', 'StaticService', 'UserService', 'flashService', '_', '$translate', '$scope','$timeout','$anchorScroll', function(DashboardService, messagesFactory, $state, $stateParams, $rootScope, authService, appService, $uibModal, StaticService, UserService, flashService, _, $translate, $scope, $timeout, $anchorScroll) {
    var dashboard = this;
    var welcomefeed = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.welcomefeed : {};
    dashboard.userName = $rootScope.globals.currentUser;
    dashboard.model = {};
    dashboard.data = {};
    dashboard.data.newsFeedsList = {};
    dashboard.data.newsFeeds = {};
    dashboard.data.termsCondtnPrcyPolcy = { terms: 'terms', privacy: 'privacy' };
    dashboard.isUserFirstTimeLoggedIn = false;
    dashboard.showWelcomeNewsFeedDetails = false;
    dashboard.hideWelcomeFeedOnload = true;
    dashboard.data.newsFeeds = '';
    dashboard.fullfeed = [];
    dashboard.ispaginationClicked = false;

    function getTermsNCondtionData() {
        StaticService.getTermsAPI()
            .success(function(data) {
                openTermsNCondtonPrivacyPolicyPopup(data, false);
            }).error(function() {});
    }

    function getPrivacyPolicyData() {
        StaticService.getPrivacyAPI()
            .success(function(data) {
                openTermsNCondtonPrivacyPolicyPopup(data, true);
            }).error(function() {});
    }

    function updateTermsConditionPrivacyPolicy(type, version) {
        var bodyVer = { version: version };
        UserService.updateTermsConditionPrivacyPolicy($rootScope.globals.currentUser.id, type, bodyVer)
            .success(function() {
                if (type === dashboard.data.termsCondtnPrcyPolcy.terms) {
                    $rootScope.globals.currentUser.terms = false;
                    appService.updateCookieStore();
                } else {
                    $rootScope.globals.currentUser.privacy = false;
                    appService.updateCookieStore();
                }
            }).error(function(error, status) {
                messagesFactory.dashboardTermsConditionPrivacyPolicyError(status);
            });

    }

    function openTermsNCondtonPrivacyPolicyPopup(data, isPrivacyPolicy) {
        $uibModal.open({
            backdrop: 'static',
            keyboard: false,
            windowClass: 'no-animation-modal',
            templateUrl: 'components/user/register/terms-agree-modal.html',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.modalTitle = data.title;
                $scope.isSubmit = isPrivacyPolicy;
                $scope.isExternalHtmlDataLoaded = false;
                $scope.fullHtmlViewURL = data.htmlView;
                $scope.ok = function() {
                    if ($rootScope.globals.currentUser.privacy && !isPrivacyPolicy) {
                        getPrivacyPolicyData();
                    }
                    var terms_privacy = $rootScope.globals.currentUser.terms ? dashboard.data.termsCondtnPrcyPolcy.terms : dashboard.data.termsCondtnPrcyPolcy.privacy;
                    updateTermsConditionPrivacyPolicy(terms_privacy, data.version);
                    $uibModalInstance.close();
                };
                $scope.cancel = function() {
                    appService.removeSession();
                    $state.go('login');
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    }

    (function() {
        loadFeedData();
        $anchorScroll();
        //load terms & condition or privacy policy popup
        if ($rootScope.globals.currentUser.terms) {
            getTermsNCondtionData();
        } else if ($rootScope.globals.currentUser.privacy) {
            getPrivacyPolicyData();
        }
    })();

    dashboard.showWelcomeMessageDetail = function() {
        appService.isFooterFixed();
        if (dashboard.showWelcomeNewsFeedDetails) {
            dashboard.showWelcomeNewsFeedDetails = false;
        } else {
            dashboard.showWelcomeNewsFeedDetails = true;
        }
    };

    function parseNewsFeedData(data) {
        var tempNewsFeedArr = [];
        for (var newsFeedCounter = 0; newsFeedCounter < data.length; newsFeedCounter++) {
            if (data[newsFeedCounter].status === 'PUBLISH') {
                data[newsFeedCounter].isImgLoaded = false;
                tempNewsFeedArr.push(data[newsFeedCounter]);
            }
        }
        tempNewsFeedArr = sortArrayByTime(tempNewsFeedArr);
        return tempNewsFeedArr;
    }

    function loadFeedData() {
        var handleSuccess = function(data) {

            //filter the news feed based on status param
            dashboard.data.newsFeedsList = parseNewsFeedData(data);
            dashboard.feedItem = _.find(dashboard.data.newsFeedsList, function(item) { 
                return item.id === $stateParams.id; 
            });

            if($stateParams.id) {
                  var isFeedAvailable = _.find(dashboard.data.newsFeedsList, function(item) {
                  return item.id == $stateParams.id;
                 });
                if (!_.isObject(isFeedAvailable)) {
                     flashService.showError($translate.instant("dashboard.messages.feed_notavailable"), true);

                     $timeout(function(){
                        $state.go('account.dashboard');
                     }, 4000);
                }
            }
           
            dashboard.currentPage = 1;
            dashboard.itemsPerPage = 10;
            dashboard.lastPage = Math.ceil(dashboard.data.newsFeedsList.length / dashboard.itemsPerPage);

            dashboard.hideWelcomeFeedOnload = false;

            if (welcomefeed && welcomefeed > 0) {
                dashboard.isUserFirstTimeLoggedIn = true;
            } else {
                dashboard.isUserFirstTimeLoggedIn = false;
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    loadFeedData();
                });
            } else {
                messagesFactory.dashboardfeedsError(status);
            }
        };

        DashboardService.getAllApi()
            .success(handleSuccess)
            .error(handleError);
    }
    dashboard.readMore = function(feedItem) {
            DashboardService.getAllApi().then(function(response) {
                var isFeedExist = _.find(response.data, function(item) { return feedItem.id == item.id; });
                if (_.isObject(isFeedExist)) {
                    $state.go('account.feeds', { id: feedItem.id });
                } else {
                    flashService.showError($translate.instant("dashboard.messages.feed_notavailable"), false);
                }
            })

        }
        //sort news feed
    function sortArrayByTime(arrObj) {
        if (arrObj && arrObj.length > 0) {
            arrObj = _.sortBy(arrObj, "updatedAt");
            arrObj.reverse();
            return arrObj;
        } else {
            return [];
        }
    }

    $scope.$watch("dashboard.currentPage", function(newValue) {
        if (newValue) {
        dashboard.showWelcomeNewsFeedDetails = false;
        }
    });

}]);