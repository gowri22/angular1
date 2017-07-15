/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module("app").controller('curriculumActionCtrl', ['$timeout', 'CurriculumService', '$scope', '$state', '$uibModal', 'ngAudio', 'messagesFactory', '$translate', 'AuthenticationService', function($timeout, CurriculumService, $scope, $state, $uibModal, ngAudio, messagesFactory, $translate, authService) {

    var curriculum = this;
    curriculum.model = {};
    curriculum.data = {};
    curriculum.model.wordItem = {};
    curriculum.model.wordItem.imageURL = "assets/images/fallback-img.png";
    curriculum.imageFileError = true;
    curriculum.audioFileError = true;
    curriculum.audioFilesize = true;
    curriculum.isAudioUploaded = false;
    curriculum.audioFilesize = true;
    curriculum.isUpdate = false;
    curriculum.isView = ($state.current.name === 'account.viewCustomWord') ? true : false;
    curriculum.fileReaderSupported = window.FileReader != null;
    var URL = window.URL || window.webkitURL;
    var formData = null;
    curriculum.previousImageObj = [];

    (function() {
        getWordId();
    })();

    //Save New Word OR Update existing word
    function saveOrUpdateWord() {
        if (curriculum.imageFileError && curriculum.audioFileError && curriculum.audioFilesize) {
            if (curriculum.myAudioFile && curriculum.previousImageObj.length > 0) {
                uploadMultipleFiles(formData, curriculum.myAudioFile, curriculum.previousImageObj[0]);
            } else if (curriculum.myAudioFile) {
                curriculum.model.wordItem.imageURL = undefined;
                uploadProfilePic(formData, curriculum.myAudioFile);
            } else if (curriculum.previousImageObj.length > 0) {
                curriculum.model.wordItem.audioURL = undefined;
                uploadProfilePic(formData, curriculum.previousImageObj[0]);
            } else {
                curriculum.model.wordItem.imageURL = undefined;
                curriculum.model.wordItem.audioURL = undefined;
                if (curriculum.isUpdate) {
                    updateAction();
                } else {
                    addAction(formData);
                }
            }
        } else {
            $timeout(function() {
                angular.element('.custom-error:first').focus();
            }, 200);
        }
    }

    curriculum.searchWord = function(isSearchClicked) {
        var word = curriculum.model.wordItem.wordName;
        var handleSuccess = function(data) {
            if (isSearchClicked) {
                if (data.length === 0) {
                    curriculum.model.message = $translate.instant("curriculum.messages.word_notexist");
                    curriculum.model.isWordExit = false;
                } else {
                    curriculum.model.message = $translate.instant("curriculum.messages.word_exist");
                    curriculum.model.isWordExit = true;
                }
            } else {
                //Validate the entered word - to save or update mode
                if (curriculum.submitted && formData.$valid) {
                    saveOrUpdateWord();
                    curriculum.submitted = false;
                }
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    CurriculumService.searchWordApi(word)
                        .success(handleSuccess)
                        .error(handleError);
                });
            } else {
                messagesFactory.searchwordsError(status);
            }
        };
        CurriculumService.searchWordApi(word)
            .success(handleSuccess)
            .error(handleError);

    };

    curriculum.submitForm = function(form) {
        formData = form;
        curriculum.submitted = true;
        curriculum.model.message = "";
        curriculum.searchWord();
    };

    function getWordId() {
        if ($state.params.id) {
            curriculum.isUpdate = true;
            var handleSuccess = function(data) {
                curriculum.data.wordItem = curriculum.model.wordItem = data;
                curriculum.image = curriculum.data.wordItem.imageURL;
                if (!data.imageURL) {
                    curriculum.model.wordItem.imageURL = "assets/images/fallback-img.png";
                }
                if (data.audioURL) {
                    curriculum.model.wordItem.audioURL = ngAudio.load(data.audioURL);
                    curriculum.isAudioUploaded = true;
                }
            };
            var handleError = function(error, status) {
                if (status === 401) {
                    authService.generateNewToken(function() {
                        getWordId();
                    });
                } else {
                    messagesFactory.getwordsError(status);
                }
            };
            CurriculumService.getWordById($state.params.id)
                .success(handleSuccess)
                .error(handleError);
        } else {
            curriculum.model.wordItem.wordName = $state.params.word;
        }

    }

    curriculum.refreshFile = function() {

        angular.element("#audio").val("");
        curriculum.model.wordItem.audioURL = null;
        curriculum.audioFileError = true;
        curriculum.isAudioUploaded = false;
        curriculum.audioFilesize = true;
    };


    function structureFormData() {
        var data = {};
        data.wordName = curriculum.model.wordItem.wordName;
        data.imageURL = curriculum.model.wordItem.imageURL;
        data.audioURL = curriculum.model.wordItem.audioURL;
        return data;
    }

    function addAction(form) {
        form.$setPristine();
        var formData = structureFormData();

        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    addAction(form);
                });
            } else {
                messagesFactory.savewordsError(status);
            }
        };
        var handleSuccess = function(data) {
            messagesFactory.savewordsSuccess(data);
            $state.go('account.curriculum');
        };
        CurriculumService.saveWordApi(formData)
            .success(handleSuccess)
            .error(handleError);
    }

    function updateAction() {
        var formData = structureFormData();

        var handleSuccess = function(data) {
            messagesFactory.updatewordSuccess(data);
            $state.go('account.curriculum');
        };

        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    updateAction();
                });
            } else {
                messagesFactory.updatewordsError(status);
            }
        };
        CurriculumService.updateWordApi(curriculum.data.wordItem.id, formData)
            .success(handleSuccess)
            .error(handleError);
    }

    function uploadMultipleFiles(form, audioFile, imageFile) {
        var handleSuccess = function(data) {
            curriculum.model.wordItem.audioURL = data.files[0].url;

            CurriculumService.uploadFileApi(imageFile)
                .success(function(data) {
                    curriculum.model.wordItem.imageURL = data.files[0].url;
                    if (curriculum.isUpdate) {
                        updateAction();
                    } else {
                        addAction(form);
                    }
                })
                .error(function(error, status) {
                    if (status === 401) {
                        authService.generateNewToken(function() {
                            uploadMultipleFiles(form, audioFile, imageFile);
                        });
                    } else {
                        messagesFactory.uploadfileError(status);
                    }
                });

        };

        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    uploadMultipleFiles(form, audioFile, imageFile);
                });
            } else {
                messagesFactory.uploadfileError(status);
            }
        };

        CurriculumService.uploadFileApi(audioFile)
            .success(handleSuccess)
            .error(handleError);
    }

    function uploadProfilePic(form, file) {
        var handleSuccess = function(data) {
            if (data.files[0].type.includes("audio")) {
                curriculum.model.wordItem.audioURL = data.files[0].url;
            } else {
                curriculum.model.wordItem.imageURL = data.files[0].url;
            }
            if (curriculum.isUpdate) {
                updateAction();
            } else {
                addAction(form);
            }

        };
        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    uploadProfilePic(form, file);
                });
            } else {
                messagesFactory.uploadfileError(status);
            }
        };
        CurriculumService.uploadFileApi(file)
            .success(handleSuccess)
            .error(handleError);
    }

    $scope.photoChanged = function(files) {

        if (files.length > 0 || curriculum.previousImageObj) {
            //Restricting file upload to 2MB i.e (1024*1024*2)
            if (files[0].size <= 2097152) {
                curriculum.showSizeLimitError = false;
                curriculum.previousImageObj = (files.length > 0) ? files : curriculum.previousImageObj;
                var file = (files[0]) ? files[0] : curriculum.previousImageObj[0];
                if (curriculum.fileReaderSupported && file.type.indexOf('image') > -1) {
                    curriculum.imageFileError = true;
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                curriculum.model.wordItem.imageURL = e.target.result;
                            });
                        };
                    });
                } else {
                    curriculum.imageFileError = false;
                }
            } else {
                curriculum.showSizeLimitError = true;
            }
        }
    };

    $scope.audioFileChanged = function(files) {
        if (files != null) {
            curriculum.isAudioUploaded = true;
            curriculum.audioFilesize = true;
            curriculum.audioFileError = true;
            var file = files[0];
            if (curriculum.fileReaderSupported && file.type.indexOf('audio') > -1) {
                if (file.size <= 2000000) {
                    $timeout(function() {
                        var fileURL = URL.createObjectURL(file);
                        curriculum.model.wordItem.audioURL = ngAudio.load(fileURL);
                    });
                } else {
                    curriculum.audioFilesize = false;
                    curriculum.isAudioUploaded = false;
                    curriculum.model.wordItem.audioURL = undefined;
                }

            } else {
                curriculum.isAudioUploaded = false;
                curriculum.audioFileError = false;
                curriculum.model.wordItem.audioURL = undefined;
            }
        }
    };

}]);