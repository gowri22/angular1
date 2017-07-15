/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module("app").controller('playerActionCtrl', ['$scope', '$state', 'messagesFactory', 'PlayerService', '$timeout', '$translate', '$uibModal', 'AuthenticationService', '$rootScope', function($scope, $state, messagesFactory, PlayerService, $timeout, $translate, $uibModal, AuthenticationService, $rootScope) {
    var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";
    var playerAction = this;
    var lastSelectedImage = {};

    playerAction.model = {};
    playerAction.data = {};
    playerAction.data.avatarsList = [];
    playerAction.modalTitle = 'Warning!';
    playerAction.modalBody = $translate.instant("player.messages.delete_player");
    playerAction.data.deleteObj = {};
    playerAction.isUpdate = false;
    playerAction.isChoosenAvatar = false;
    playerAction.IsFutureDate = true;
    playerAction.model.playerItem = {};
    playerAction.fileError = true;
    playerAction.model.playerItem.gender = 'O';
    playerAction.model.playerItem.age = 5;
    playerAction.fileReaderSupported = window.FileReader != null;
    playerAction.model.croppedImage = '';
    playerAction.dobInvalid = false;
    playerAction.dobNull = false;

    (function() {
        getPlayerById();
        getGlobalvalues()
    })();

    playerAction.submitForm = function(form) {
        playerAction.submitted = true;
        isDOBValid();

        if (form.$valid && playerAction.fileError && !playerAction.showSizeLimitError && playerAction.IsFutureDate && !playerAction.dobInvalid && !playerAction.dobNull) {
            playerAction.dobInvalid = false;
            playerAction.IsFutureDate = true;
            form.$setPristine();
            playerAction.added = true;

            if (lastSelectedImage.size && !playerAction.isChoosenAvatar) {
                form.$setPristine();
            }

            if (playerAction.isUpdate) {
                updateAction();
            } else {
                addAction();
            }
        } else {
            $timeout(function() {
                angular.element('.custom-error:first').focus();
            }, 200);
        }
    };

    function stuctureFormData() {
        var data = {};
        data.firstName = playerAction.model.playerItem.firstName;
        data.lastName = playerAction.model.playerItem.lastName;
        data.profileURL = playerAction.model.playerItem.profileURL;
        data.gender = playerAction.model.playerItem.gender;
        data.dateofBirth = playerAction.model.playerItem.dateofBirth;
        if (!playerAction.isChoosenAvatar) {
            data.imgbase64 = playerAction.model.playerItem.imgbase64;
        } else {
            data.imgbase64 = "";
        }
        return data;
    }

    function addAction() {
        var formData = stuctureFormData();

        var handleSuccess = function(data) {
            messagesFactory.createPlayerSuccess(data);
            PlayerService.isPlayerAdded = true;
            $state.go('account.players.details', { id: data.id });
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    addAction();
                });
            } else {
                messagesFactory.createPlayerError(status);
            }
        };

        PlayerService.createApi(formData)
            .success(handleSuccess)
            .error(handleError);
    }

    function updateAction() {
        var formData = stuctureFormData();
        var handleSuccess = function(data) {
            messagesFactory.updatePlayerSuccess(data);
            PlayerService.isPlayerAdded = true;
            $state.go('account.players.details', { id: playerAction.model.playerItem.id });
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    updateAction();
                });
            } else {
                messagesFactory.updatePlayerError(status);
            }
        };

        PlayerService.updateApi(playerAction.data.playerItem.id, formData)
            .success(handleSuccess)
            .error(handleError);
    }

    playerAction.deleteListener = function(obj) {
        $uibModal.open({
            templateUrl: 'components/account/player/delete-player.html',
            windowClass: 'no-animation-modal',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.modalTitle = $translate.instant('common.are_you_sure');
                $scope.clickedOnReadmore = true;

                $scope.readMore = function() {
                    $scope.clickedOnReadmore = false;
                };

                $scope.readLess = function() {
                    $scope.clickedOnReadmore = true;
                };

                $scope.ok = function() {
                    playerAction.data.deleteObj = obj;
                    playerAction.deleteAction();
                    $uibModalInstance.close();
                };

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });

    };

    playerAction.deleteAction = function() {
        var handleSuccess = function(data) {
            messagesFactory.deletePlayerSuccess(data);
            $state.go("account.players");
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    PlayerService.deleteApi(playerAction.data.deleteObj.id)
                        .success(handleSuccess)
                        .error(handleError);
                });
            } else {
                messagesFactory.deletePlayerError(status);
            }
        };

        PlayerService.deleteApi(playerAction.data.deleteObj.id)
            .success(handleSuccess)
            .error(handleError);
    };

    playerAction.onOpenCropImg = function(selectedImg) {
        $uibModal.open({
            templateUrl: 'components/account/player/player-image-crop-modal.html',
            windowClass: 'no-animation-modal',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.selectedImage = selectedImg;
                $scope.croppedImage = '';
                $scope.croppedImageSize = '';
                playerAction.isChoosenAvatar = false;
                $scope.onCancel = function() {
                    lastSelectedImage = {};
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.onSubmit = function() {
                    playerAction.model.playerItem.imgbase64 = $scope.croppedImage;
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    };

    $scope.photoChanged = function(inputFileObj) {
        var selectedImage = inputFileObj.files[0];
        if (selectedImage.size > 0 || lastSelectedImage) {
            if (selectedImage && selectedImage.size <= 5242880) {
                playerAction.showSizeLimitError = false;
                lastSelectedImage = (selectedImage) ? selectedImage : lastSelectedImage;
                if (playerAction.fileReaderSupported && lastSelectedImage.type.indexOf('image') > -1) {
                    playerAction.fileError = true;
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(lastSelectedImage);
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                playerAction.isChoosenAvatar = false;
                                playerAction.onOpenCropImg(e.target.result);
                                inputFileObj.value = null;
                            });
                        };
                    });
                } else {
                    playerAction.fileError = false;
                    playerAction.showSizeLimitError = false;
                }
            } else {
                playerAction.showSizeLimitError = true;
                playerAction.fileError = true;
            }
        }
    };

    playerAction.showAvatars = function() {
        getAvatars(function() {
            $uibModal.open({
                templateUrl: 'components/account/player/player-avatars-modal.html',
                windowClass: 'no-animation-modal',
                controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

                    $scope.selectionAvatar = (playerAction.model.playerItem.profileURL) ? playerAction.model.playerItem.profileURL : '';
                    $scope.selectVal;

                    $scope.avatarsList = playerAction.data.avatarsList;
                    $scope.selectAvatar = function(item, index) {
                        $scope.selectionAvatar = item.assetURL;
                        playerAction.isChoosenAvatar = true;
                        $scope.selectVal = index;
                    };

                    $scope.isAvatarClicked = function(index) {
                        return ($scope.selectVal === index) ? true : false;
                    };

                    $scope.onCancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.onSubmit = function() {
                        playerAction.fileError = true;
                        playerAction.showSizeLimitError = false;
                        playerAction.model.playerItem.profileURL = $scope.selectionAvatar;
                        //clear cropped image
                        playerAction.model.playerItem.imgbase64 = "";
                        $uibModalInstance.dismiss('cancel');
                    };


                }]
            });
        });
    };

    function getPlayerById() {
        if ($state.params.id) {
            playerAction.isUpdate = true;
            var handleSuccess = function(data) {
                playerAction.data.playerItem = playerAction.model.playerItem = data;
            };

            var handleError = function(error, status) {
                if (status === 401) {
                    AuthenticationService.generateNewToken(function() {
                        getPlayerById();
                    });
                } else {
                    messagesFactory.getPlayerbyIDError(status);
                }
            };
            PlayerService.getPlayerById($state.params.id)
                .success(handleSuccess)
                .error(handleError);
        }

    }


    function getAvatars(cb) {

        var handleSuccess = function(data) {
            playerAction.data.avatarsList = data;
            if (cb) {
                cb();
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getAvatars();
                });
            } else {
                messagesFactory.getAvatarError(status);
            }
        };
        PlayerService.getAvatarsAPI()
            .success(handleSuccess)
            .error(handleError);
    }

    function isDOBValid() {
        if (playerAction.model.playerItem.dateofBirth) {
            var dobArr = playerAction.model.playerItem.dateofBirth.split("/");
            if (Number(dobArr[0]) > 0 && Number(dobArr[1]) > 0 && Number(dobArr[2]) > 0) {
                if (dobArr !== null && (Number(dobArr[0]) !== 0 && Number(dobArr[1]) !== 0 && Number(dobArr[2]) !== 0) && dobArr !== undefined) {
                    playerAction.IsFutureDate = true;
                    isDOBCurrentDateExceed(dobArr);
                }
            } else if (Number(dobArr[0]) === 0 && Number(dobArr[1]) === 0 && Number(dobArr[2]) === 0) {
                playerAction.dobNull = true;
                playerAction.dobInvalid = false;
                playerAction.IsFutureDate = true;
            } else if (Number(dobArr[0]) === 0 || Number(dobArr[1]) === 0 || Number(dobArr[2]) === 0) {
                playerAction.dobInvalid = true;
                playerAction.dobNull = false;
                playerAction.IsFutureDate = true;
            }
        }
    }

    function isDOBCurrentDateExceed(selectedDate) {
        playerAction.dobInvalid = false;
        playerAction.dobNull = false;
        var curDate = new Date();
        var month = selectedDate[0];
        var date = selectedDate[1];
        var year = selectedDate[2];

        function isFutureDate(idate) {
            var today = new Date().getTime(),
                idate = idate.split("/");

            idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
            return (today - idate) < 0 ? true : false;
        }

        var formatedDate = date + "/" + month + "/" + year;
        if (isFutureDate(formatedDate)) {
            playerAction.IsFutureDate = false;
        }
    }

    function getPlayers() {
        PlayerService.getAllApi(userID).success(function(data) {
            PlayerService.setPlayers(data);
        }).error(function(error, status) {
            if (status === 401) {
                AuthenticationService.generateNewToken(function() {
                    getPlayers();
                });
            } else {
                messagesFactory.getPlayersError(status);
            }
        });
    }

    function getGlobalvalues(){
        AuthenticationService.getAppGlobalsAPI(userID)
                .success(function(data) {
                    $rootScope.playerCount = data.playerCount;
                    $rootScope.playerLimit = data.playerLimit;
                    $rootScope.availableplayers = $rootScope.playerLimit - $rootScope.playerCount;
                }).error(function(error, status){
                    if (status === 401) {
                        AuthenticationService.generateNewToken(function() {
                        getGlobalvalues();
                        });
                    }
            });
        }

}]);