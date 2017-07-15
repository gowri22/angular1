/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
angular.module("app").controller('curriculumCtrl', ['$timeout', '$rootScope', 'CurriculumService', 'flashService', '$scope', '$state', '$uibModal', 'messagesFactory', '$translate', 'utilsFactory', 'AuthenticationService', 'appService', '_', function($timeout, $rootScope, CurriculumService, flashService, $scope, $state, $uibModal, messagesFactory, $translate, utilsFactory, authService, appService, _) {
    var userID = ($rootScope.globals.currentUser) ? $rootScope.globals.currentUser.id : "";
    var curriculum = this;
    curriculum.customWords = [];
    curriculum.model = {};
    curriculum.model.wordItem = {};
    curriculum.model.previousWrdItm = "";
    curriculum.addImgInTableRowItem = null;
    curriculum.model.isWordPrsnt = false;
    curriculum.model.customWrdImgArr = [];
    curriculum.curriculumForm = {};
    curriculum.model.customWrdImgURLArr = [];
    curriculum.group = {};
    curriculum.fileReaderSupported = window.FileReader != null;
    curriculum.model.bannedWordList = [];
    curriculum.model.editCustomWrdSubmited = false;
    curriculum.sortType = {};
    curriculum.itemsPerPage = 10;
    curriculum.editedWord = [];
    curriculum.copydEditedWordData = [];

    curriculum.onEditCustomWord = function(wordItem) {
        curriculum.model.editCustomWrdSubmited = true;
        if (!wordItem.Words || wordItem.Words === "") {
            return;
        }
        if (wordItem.isEditMode) {
          
            var isNewFileAdded = _.every(wordItem.picture, function(picObj) {
                return picObj.fileObj === null;
            });
            if (!isNewFileAdded) {
                uploadCustomWordImages(wordItem.picture, wordItem.isEditMode, wordItem);
            } else {
                curriculum.model.customWrdImgURLArr = [];
                updateCustomWords(wordItem);
            }
        } else {
            curriculum.copydEditedWordData.push(wordItem);
            curriculum.editedWord = angular.copy(curriculum.copydEditedWordData);
            curriculum.model.previousWrdItm = wordItem.Words;
            curriculum.model.editCustomWrdSubmited = false;
        }
        wordItem.isEditMode = !wordItem.isEditMode;
    };
    
    curriculum.cancelEditCustomWord = function(wordItem, form){
       wordItem.isEditMode = !wordItem.isEditMode;
       angular.forEach(curriculum.editedWord,function(obj){
           if(obj.id === wordItem.id){
                wordItem.Words =  obj.Words;
                wordItem.picture = obj.picture;
                  wordItem.isFileTypeError = false;
                    wordItem.showSizeLimitError = false;
           }
           
       });
    };

    curriculum.searchWord = function(word, curriculumForm) {
        curriculum.curriculumForm = curriculumForm;
        var handleSuccess = function(data) {
            if (!isWordPresent(data)) {
                curriculum.model.isWordPrsnt = false;
                if (curriculum.model.customWrdImgArr.length > 0) {
                    uploadCustomWordImages(curriculum.model.customWrdImgArr);
                } else {
                    saveCustomWords();
                }
            } else {
                curriculum.model.isWordPrsnt = true;
            }
        };
        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    curriculum.searchWord(word, curriculumForm);
                });
            } else {
                messagesFactory.customisesearchwordError(status);
            }
        };
        if (word && curriculumForm.$valid && !curriculum.showSizeLimitError && !curriculum.fileError) {
            CurriculumService.searchWordApi(word)
                .success(handleSuccess)
                .error(handleError);
        }
    };

    curriculum.onNewcustomWrdAddImg = function(index) {
        if (curriculum.model.customWrdImgArr.length > 0) {
            curriculum.model.customWrdImgArr.splice(index, 1);
        }
    };

    function isWordPresent(dataArr) {
        var isWordPrst = false;
        for (var wrdCounter = 0; wrdCounter < dataArr.length; wrdCounter++) {
            if (dataArr[wrdCounter].hasOwnProperty("owner")) {
                isWordPrst = true;
                break;
            }
        }
        return isWordPrst;
    }

    $scope.photoChanged = function(inputFileObj, value) {
        var files = inputFileObj.files;
        curriculum.fileError = false;
        curriculum.showSizeLimitError = false;
        if (curriculum.model.customWrdImgArr.length < 5 && files.length > 0) {
            var file = (files.length > 0) ? files[0] : null;
            var ext = files[0].name.split(".").pop();
            if (file && file.size <= 2097152) {
                if (angular.lowercase(ext) === 'jpg' || angular.lowercase(ext) === 'jpeg' || angular.lowercase(ext) === 'png') {
                    curriculum.showSizeLimitError = false;
                    if (curriculum.fileReaderSupported && file && isFileTypeSuported(file.type)) {
                        curriculum.fileError = false;
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    var obj = { fileObj: file, image64Bit: e.target.result };
                                    curriculum.model.customWrdImgArr.push(obj);
                                    inputFileObj.value = null;
                                });
                            };
                        });
                    } else {
                        curriculum.fileError = true;
                        curriculum.showSizeLimitError = false;
                        inputFileObj.value = null;
                    }
                } else {
                    curriculum.fileError = true;
                    curriculum.showSizeLimitError = false;
                }
            } else {
                curriculum.showSizeLimitError = true;
                curriculum.fileError = false;
            }
        } else {
            curriculum.fileUploadExceedErr = true;
        }
    };

    curriculum.onAddImageInRow = function(wrdItm) {
        curriculum.addImgInTableRowItem = wrdItm;
    };

    $scope.updateCustomWrdPhoto = function(inputFileObj, value) {
        curriculum.addImgInTableRowItem.isFileTypeError = false;
        curriculum.addImgInTableRowItem.showSizeLimitError = false;
        var files = inputFileObj.files,
            index = curriculum.customWords.indexOf(curriculum.addImgInTableRowItem),
            ext = files[0].name.split(".").pop();
        if (files.length > 0) {
            if (angular.lowercase(ext) === 'jpg' || angular.lowercase(ext) === 'jpeg' || angular.lowercase(ext) === 'png') {
                var file = (files.length > 0) ? files[0] : null;
                if (file && file.size <= 2097152) {
                    curriculum.addImgInTableRowItem.showSizeLimitError = false;
                    if (curriculum.fileReaderSupported && file && isFileTypeSuported(file.type)) {
                        curriculum.addImgInTableRowItem.isFileTypeError = false;
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    var obj = { fileObj: file, image64Bit: e.target.result };
                                    curriculum.customWords[index].picture.push(obj);
                                    inputFileObj.value = null;
                                });
                            };
                        });
                    } else {
                        curriculum.addImgInTableRowItem.isFileTypeError = true;
                        curriculum.addImgInTableRowItem.showSizeLimitError = false;
                        inputFileObj.value = null;
                    }
                } else {
                    curriculum.addImgInTableRowItem.showSizeLimitError = true;
                    curriculum.addImgInTableRowItem.isFileTypeError = false;
                }
            } else {
                curriculum.addImgInTableRowItem.isFileTypeError = true;
                curriculum.addImgInTableRowItem.showSizeLimitError = false;
            }
        };

    }
    curriculum.onClearCustomWordDetails = function() {
        clearCustomWordData();
        curriculum.fileError = false;
        curriculum.showSizeLimitError = false;
    };

    function groupWordsArrMan(sourceArr) {
        var arr = [];
        for (var i = 0; sourceArr.length > i; i++) {
            if (sourceArr[i].length > 0) {
                for (var ii = 0; sourceArr[i].length > ii; ii++) {
                    if (sourceArr[i][ii].groupedflag) {
                        arr.push(sourceArr[i][ii].Word);
                    }
                }
            }
        }
        return arr;
    }

    curriculum.submitGroupWords = function(type) {
        var data = {};
        if (type === 'bathroom' && curriculum.group.bathroomWords.length > 0) {
            data.bathroom_words = [];
            data.bathroom_words = groupWordsArrMan(curriculum.group.bathroomWords);
        } else if (type === 'anotomy' && curriculum.group.anatomyWords.length > 0) {
            data.anatomy_words = [];
            data.anatomy_words = groupWordsArrMan(curriculum.group.anatomyWords);
        }
        var handleSuccess = function(data) {
            messagesFactory.submitGroupwordsSuccess(data);
        };
        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    curriculum.submitGroupWords(type);
                });
            } else {
                messagesFactory.submitGroupwordsError(status);
            }
        };
        CurriculumService.updateGroupWordsApi(data)
            .success(handleSuccess)
            .error(handleError);
    };

    curriculum.deleteListener = function(word) {
        var modalInstance = $uibModal.open({
            templateUrl: 'components/account/curriculum/delete-word.html',
            windowClass: 'no-animation-modal',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.modalTitle = $translate.instant("common.delete");
                $scope.modalBody = $translate.instant("curriculum.messages.model_delete_word");
                $scope.delete = function() {
                    $uibModalInstance.close(word);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.result.then(function(word) {
            curriculum.customWords.splice(curriculum.customWords.indexOf(word), 1);
            if (curriculum.customWords.length % curriculum.itemsPerPage === 0) {
                curriculum.currentPage = (curriculum.currentPage === 1) ? 1 : curriculum.currentPage - 1;
            }
            var handleSuccess = function(data) {
                messagesFactory.deletewordSuccess(data);
                $state.go("account.curriculum");
            };
            var handleError = function(error, status) {
                if (status === 401) {
                    authService.generateNewToken(function() {
                        curriculum.deleteListener(word);
                    });
                } else {
                    messagesFactory.deletewordError(status);
                }
            };
            CurriculumService.deleteWordApi(word.id)
                .success(handleSuccess)
                .error(handleError);
        }, function() {
            $state.go("account.curriculum");
        });
    };

    curriculum.onRemoveImage = function(index, imageURLArr) {
        $uibModal.open({
            templateUrl: 'components/account/curriculum/delete-word.html',
            windowClass: 'no-animation-modal',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.modalTitle = $translate.instant("common.delete");
                $scope.modalBody = $translate.instant("curriculum.messages.model_delete_word_image");
                $scope.delete = function() {
                    $uibModalInstance.close();
                    imageURLArr.splice(index, 1);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    };

    function clearCustomWordData() {
        curriculum.model.wordItem.wordName = "";
        curriculum.model.customWrdImgArr = [];
        curriculum.model.customWrdImgURLArr = [];
        curriculum.model.isWordPrsnt = false;
    }

    function getWords() {
        var handleSuccess = function(data) {
            if (data.length > 0) {
                angular.forEach(data, function(word) {
                    var formatedWrd = getCustomWordObj(word);
                    curriculum.customWords.push(formatedWrd);
                });
            }
        };
        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    getWords();
                });
            } else {
                messagesFactory.listwordsError(status);
            }
        };
        curriculum.customWords = [];
        CurriculumService.listWordsApi()
            .success(handleSuccess)
            .error(handleError);
    }

    function getCustomWordObj(word) {
        var customWrdObj, formatedDate, date = new Date(word.createdAt),
            imageURLArr = [],
            imgObj;
        //image url validation
        if (word.imageURL) {
            if (angular.isArray(word.imageURL)) {
                for (var imgCounter = 0; imgCounter < word.imageURL.length; imgCounter++) {
                    imgObj = { fileObj: null, image64Bit: word.imageURL[imgCounter] };
                    imageURLArr.push(imgObj);
                }
            } else {
                imgObj = { fileObj: null, image64Bit: word.imageURL };
                imageURLArr.push(imgObj);
            }
        }
        formatedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        customWrdObj = {
            id: word.id,
            Words: word.wordName,
            dateAdded: word.createdAt,
            picture: imageURLArr,
            isEditMode: false,
            isFileTypeError: false,
            showSizeLimitError: false,
            formatedDate: formatedDate
        };
        return customWrdObj;
    }

    function getWordsByCategory(carArr) {
        var handleSuccess = function(data) {
            if (data.anatomy && data.anatomy.length > 0) {
                if (CurriculumService.selectedWordGroupCount(data.anatomy) === data.anatomy.length) {
                    curriculum.checkselectAll = true;
                }
                curriculum.group.anatomyWords = [];
                var sortedanatomyArr = appService.simpleSort(data.anatomy, 'Word');
                curriculum.group.anatomyWords = utilsFactory.chunkArray(sortedanatomyArr, 4);
            }
            if (data.bathroom && data.bathroom.length > 0) {
                if (CurriculumService.selectedWordGroupCount(data.bathroom) === data.bathroom.length) {
                    curriculum.selectedAll = true;
                }
                curriculum.group.bathroomWords = [];
                var sortedbathroomArr = appService.simpleSort(data.bathroom, 'Word');
                curriculum.group.bathroomWords = utilsFactory.chunkArray(sortedbathroomArr, 4);
            }
        };
        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    getWordsByCategory(carArr);
                });
            } else {
                messagesFactory.getGroupwordsError(status);
            }
        };
        CurriculumService.getGroupWords(carArr)
            .success(handleSuccess)
            .error(handleError);
    }

    curriculum.checkAll = function(type, arr) {
        if (arr.length > 0) {
            for (var i = 0; arr.length > i; i++) {
                if (arr[i].length > 0) {
                    for (var ii = 0; arr[i].length > ii; ii++) {
                        arr[i][ii].groupedflag = type;
                    }
                }
            }
        }
    };

    curriculum.checkItemBy = function(topIndex, index, arr, type, selectType) {
        arr[topIndex][index].groupedflag = type;
        var totalCount = _.union(arr[0], arr[1], arr[2], arr[3]).length;
        var selectedCount = _.filter(_.union(arr[0], arr[1], arr[2], arr[3]), function(gword) {
            return gword.groupedflag;
        }).length;
        if (selectType === 'anatomy') {
            curriculum.checkselectAll = totalCount === selectedCount;
        } else {
            curriculum.selectedAll = totalCount === selectedCount;
        }
    };

    curriculum.onAddBanWord = function(banWordForm) {
        var handleSuccess = function() {
            curriculum.model.banWord = "";
            banWordForm.$setPristine();
            getBannedWordsList();
        };
        var handleError = function() {
            if (status === 401) {
                authService.generateNewToken(function() {
                    curriculum.onAddBanWord(banWordForm);
                });
            }
        };
        if (curriculum.model.banWord) {
            var banWordObj = { "word": curriculum.model.banWord };
            CurriculumService.createBannedWordAPI(banWordObj)
                .success(handleSuccess)
                .error(handleError);
        }
    };

    curriculum.onDeleteBanWord = function(banWord) {
        var handleSuccess = function() {
            getBannedWordsList();
        };

        var handleError = function() {
            if (status === 401) {
                authService.generateNewToken(function() {
                    curriculum.onDeleteBanWord(banWord);
                });
            }
        };
        $uibModal.open({
            templateUrl: 'components/account/curriculum/delete-word.html',
            windowClass: 'no-animation-modal',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.modalTitle = $translate.instant("common.delete");
                $scope.modalBody = $translate.instant("curriculum.messages.model_delete_word");
                $scope.delete = function() {
                    $uibModalInstance.close();
                    CurriculumService.deleteBannedWordAPI(banWord.id)
                        .success(handleSuccess)
                        .error(handleError);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    };

    curriculum.customWordListSort = function(type) {
        if (typeof curriculum.sortType.reverse === "undefined") {
            curriculum.sortType.reverse = false;
        } else {
            curriculum.sortType.reverse = (curriculum.sortType.reverse) ? false : true;
        }
        curriculum.sortType.column = type;
        curriculum.customWords = appService.simpleSort(curriculum.customWords, type, curriculum.sortType.reverse);
    };

    function getBannedWordsList() {
        var handleSuccess = function(data) {
            curriculum.model.bannedWordList = data;
        };
        var handleError = function() {
            if (status === 401) {
                authService.generateNewToken(function() {
                    getBannedWordsList();
                });
            }
        };
        CurriculumService.getBannedWordsAPI(userID)
            .success(handleSuccess)
            .error(handleError);
    }

    function structureFormData() {
        var data = {};
        data.wordName = curriculum.model.wordItem.wordName;
        data.imageURL = curriculum.model.customWrdImgURLArr;
        data.audioURL = "";
        return data;
    }

    function isFileTypeSuported(ft) {
        return $.inArray(ft, ['image', 'image/jpeg', 'image/jpg', '', 'image/png']) > -1;
    }

    function saveCustomWords() {
        var formData = structureFormData();
        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    saveCustomWords();
                });
            } else {
                messagesFactory.savewordsError(status);
            }

        };
        var handleSuccess = function(data) {
            messagesFactory.savewordsSuccess(data);
            clearCustomWordData();
            var word = getCustomWordObj(data);
            curriculum.customWords.push(word);
        };
        CurriculumService.saveWordApi(formData)
            .success(handleSuccess)
            .error(handleError);
    }

    function uploadCustomWordImages(localImgFilesArr, isUpdateMode, wordItem) {
        curriculum.model.customWrdImgURLArr = [];
        var fileObjArr = [];
        var handleSuccess = function(data) {
            curriculum.model.customWrdImgURLArr = _.map(data.files, function(obj) {
                return obj.url;
            });
            if (!isUpdateMode && curriculum.model.customWrdImgURLArr.length === curriculum.model.customWrdImgArr.length) {
                saveCustomWords();
            } else if (isUpdateMode && wordItem && fileObjArr.length === curriculum.model.customWrdImgURLArr.length) {
                var cus_word_images = (curriculum.model.customWrdImgURLArr.length > 0) ? angular.copy(curriculum.model.customWrdImgURLArr) : [];
                var cloned_wordItem = angular.copy(wordItem);
                if (cloned_wordItem.picture.length > 0) {
                    _.each(cloned_wordItem.picture, function(item) {
                        if (item.image64Bit.indexOf('data:') === -1) {
                            cus_word_images.push(item.image64Bit);
                        }
                    });
                    cloned_wordItem.picture = cus_word_images;
                }
                updateCustomWords(cloned_wordItem);
            }
        };

        var handleError = function(error, status) {
            if (status === 401) {
                authService.generateNewToken(function() {
                    uploadCustomWordImages(localImgFilesArr, isUpdateMode, wordItem);
                });
            } else {
                messagesFactory.uploadCustomWordImagesError(status, error);
                if(wordItem){
                    wordItem.isEditMode = true;
                }
            }
        };
        fileObjArr = _.filter(_.map(localImgFilesArr, function(obj) {
            return obj.fileObj;
        }), function(fObj) {
            return fObj !== null;
        });

        CurriculumService.uploadMultipleFileApi(fileObjArr)
            .success(handleSuccess)
            .error(handleError);
    }

    function updateCustomWords(wordItem) {
        if (!curriculum.addImgInTableRowItem.isFileTypeError && !curriculum.addImgInTableRowItem.showSizeLimitError) {
            var formData = {
                id: wordItem.id,
                wordName: wordItem.Words,
                audioURL: "",
                imageURL: (angular.isString(wordItem.picture[0])) ? wordItem.picture : _.map(wordItem.picture, function(obj) {
                    return obj.image64Bit;
                })
            };
            var handleError = function(error, status) {
                if (status === 401) {
                    authService.generateNewToken(function() {
                        updateCustomWords(wordItem);
                    });
                } else {
                    messagesFactory.updatewordsError(status);
                    wordItem.Words = curriculum.model.previousWrdItm;
                    wordItem.isEditMode = true;
                }
            };
            var handleSuccess = function(data) {
                messagesFactory.updatewordSuccess(data);
                clearCustomWordData();
            };
            CurriculumService.updateWordApi(wordItem.id, formData)
                .success(handleSuccess)
                .error(handleError);
        } else {
            wordItem.isEditMode = !wordItem.isEditMode;
        }
    }

    (function() {
        getWords();
        getWordsByCategory('6,8');
        flashService.showPreviousMessage();
    })();
}]);