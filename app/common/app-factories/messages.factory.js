/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
'use strict';
angular.module('app').factory('messagesFactory', ['$translate', 'flashService', '$timeout', '$state', function($translate, flashService, $timeout, $state) {

    var service = {};

    function netWorkError() {
        /*
         * @Todos: appService.handleOffline
         * @param1: uibmodal
         * @param2: state
         * @param3: boolean
         */
    }
    service.loginErrorMessages = function(status) {
        var message;
        if (status === 424) {
            message = $translate.instant('user.validationMessages.email_notverified');
        } else if (status === 423) {
            message = $translate.instant('user.validationMessages.email_inactive');
        } else {
            message = $translate.instant('user.validationMessages.email_password_mismatch');
        }
        flashService.showError(message, false);
    };

    service.registerSuccessMessages = function(successObj) {
        if (successObj) {
            flashService.showCustomMessage("register", true);
        }
    };

    service.registerErrorMessages = function(status) {
        var message;
        if (status === 412) {
            message = $translate.instant('user.register.messages.email_registered');
        }
        if (status === 400) {
            message = $translate.instant('user.validationMessages.email_valid');
        }
        if (status === 500) {
            message = $translate.instant('user.validationMessages.password_strength ');
        }
        flashService.showError(message, false);
    };

    service.forgotSuccessMessages = function(successObj) {
        if (successObj) {
            flashService.showCustomMessage('forgot', true);
        }
    };

    service.forgotErrorMessages = function(status) {
        var message;
        if (status === 500) {
            message = $translate.instant('user.validationMessages.email_valid ');
        }
        flashService.showError(message, false);
    };

    service.resetpasswordSuccessMessages = function(successObj) {
        if (successObj) {
            flashService.showCustomMessage("reset", true);
        }
    };

    service.resetpasswordErrorMessages = function() {
        flashService.showCustomMessage("resetError", true);
    };

    service.dashboardfeedsError = function(status) {
        if (status === -1) {
            netWorkError();
        }
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant("dashboard.messages.error_get_feeds"), false);
        }
    };
    service.dashboardTermsConditionPrivacyPolicyError = function(status) {
        if (status === -1) {
            netWorkError();
        } else {
            flashService.showError($translate.instant("dashboard.messages.error_get_termscondition_privacypolicy"), false);
        }
    };

    service.settingseditprofileSuccessMessages = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('settings.messages.profile_edit_success '), true);
        }
    };

    service.settingseditprofileErrorMessages = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant('settings.messages.profile_edit_error '), false);
        }
    };

    service.settingschangepasswordSuccessMessages = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('settings.messages.password_change_new_login'), false);
        }
    };

    service.settingschangepasswordErrorMessages = function(status) {
        var message;
        if (status === 500) {
            message = $translate.instant('settings.messages.old_passwpord_wrong');
        } else {
            message = $translate.instant('settings.messages.error_change_password');
        }
        flashService.showError(message, false);
    };

    service.settingsNotificationsSuccessMessages = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('settings.messages.nofifications_success_msg'), true);
        }
    };

    service.settingsNotificationsErrorMessages = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant('settings.messages.update_nofifications_error_msg'), false);
        }
    };

    service.settingsgetNotifictaionsErrorMessages = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant('settings.messages.get_nofifications_error_msg'), false);
        }

    };

    service.updateMissingLettersErrorMessages = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant('settings.messages.update_missing_letters_error'), false);
        }
    };

    service.updateMissingLettersSuccessMessages = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('settings.messages.missing_letters_updated'), false);

        }
    };

    service.getmissinglettesErrorMessages = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant('settings.messages.get_missing_letters_error'), false);
        }
    };
    service.customisesearchwordError = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant("curriculum.messages.error_adding_custom_words"), false);
        }
    };

    service.submitGroupwordsSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('curriculum.messages.groupword_success_msg'), false);
        }
    };

    service.submitGroupwordsError = function(status) {
        if ((status !== "") && (status !== "-1")) {
            flashService.showError($translate.instant("curriculum.messages.error_updatinging_badwords"), false);
        }

    };

    service.deletewordSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant("curriculum.messages.delete_success"), false);
        }
    };

    service.deletewordError = function(status) {
        if ((status !== "") && (status !== "-1")) {
            flashService.showError($translate.instant("curriculum.messages.error_deleting_word"), false);
        }
    };

    service.listwordsError = function(status) {
        if ((status !== "") && (status !== "-1")) {
            flashService.showError($translate.instant("curriculum.messages.error_getting_custom_words"), false);
        }

    };

    service.getGroupwordsError = function(status) {
        if ((status !== "") && (status !== "-1")) {
            flashService.showError($translate.instant("curriculum.messages.error_getting_badwords"), false);
        }

    };

    service.searchwordsError = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant("curriculum.messages.error_getting_words"), false);
        }
    };

    service.getwordsError = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant("curriculum.messages.error_getting_players"), false);
        }
    };

    service.savewordsSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('curriculum.messages.word_success_msg'), false);
        }
    };

    service.savewordsError = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant("curriculum.messages.error_adding_custom_words"), false);
        }


    };

    service.updatewordSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('curriculum.messages.word_update_msg'), false);
        }
    };

    service.updatewordsError = function(status) {
        if (status === 500) {
            flashService.showError($translate.instant('curriculum.messages.exit_custom_word'), false);
        } else {
            flashService.showError($translate.instant("curriculum.messages.error_update_custom_word"), false);
        }
    };

    service.uploadfileError = function(status) {
        if ((status !== "") && (status !== "-1")) {
            flashService.showError($translate.instant("player.messages.error_file_upload"), false);
        }

    };


    service.firmwarecreateError = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant("admin.messages.invalid_firmware"), false);
        }
    };

    service.firmwareuploadError = function(status) {
        if ((status !== '-1') && (status !== '')) {
            flashService.showError($translate.instant("admin.messages.firmware_upload_error"), false);
        }
    };

    service.firmwarecreateSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant('admin.messages.firmware_success'), true);
        }
    };

    service.getPlayersError = function(status) {
        if ((status !== "") && (status !== '-1')) {
            flashService.showError($translate.instant("player.messages.error_getting_players"), false);
        }

    };

    service.getPlayerwordsError = function(status) {
        if ((status !== "") && (status !== "-1")) {
            flashService.showError($translate.instant("player.messages.error_getting_words"), false);
        }
    };

    service.createPlayerSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant("player.messages.add_success"), false);
        }
    };

    service.createPlayerError = function(status) {
        if (status === 406) {
            flashService.showError($translate.instant("player.messages.player_limit_exceeded"), false);
        }else{
            flashService.showError($translate.instant("player.messages.error_adding_player"), false);
        }
    };

    service.createPlayerLimitError = function() {
        flashService.showError($translate.instant("player.messages.player_limit_exceeded"), false);
    };

    service.updatePlayerSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant("player.messages.edit_player_success"), false);
        }
    };

    service.updatePlayerError = function(status) {
        if (status === 500) {
            flashService.showError($translate.instant('player.messages.player_not_exist'), false);
            $timeout(function(){
                $state.go("account.players");
            }, 4000)
        } else {
            flashService.showError($translate.instant("player.messages.error_update_player"), false);
        }
    };

    service.deletePlayerSuccess = function(successObj) {
        if (successObj) {
            flashService.showSuccess($translate.instant("player.messages.delete_success"), false);
        }
    };

    service.deletePlayerError = function(status) {
        if (status === 405) {
            flashService.showError($translate.instant("player.messages.player_not_exist"), true);
            $timeout(function(){
                $state.go("account.players");
            }, 4000)
        } else {
            flashService.showError($translate.instant("player.messages.error_deleting_players"), false);
        }
    };
    service.getAvatarError = function(status) {
        if ((status !== "") && (status !== '-1')) {
            flashService.showError($translate.instant("player.messages.error_getting_avatar"), false);
        }
    };
    service.getPlayerbyIDError = function(status) {
        if (status !== "" && (status !== '-1')) {
            flashService.showError($translate.instant("player.messages.error_getting_players"), false);
        }
    };

    service.getminibadgessError = function(status) {
        if (status !== "" && (status !== '-1')) {
            flashService.showError($translate.instant("player.messages.error_getting_minibadges"), false);

        }
    };

    service.getPlayerHighlightsError = function(status) {
        if (status !== "" && status !== '-1') {
            flashService.showError($translate.instant("player.messages.error_getting_player_highlights"), false);
        }
    };

    service.uploadCustomWordImagesError = function(status, error) {
        if(status === 409) {
            flashService.showError($translate.instant("curriculum.messages.please_select_png_or_jpg_file_type"), false);
        } else if(status === 415) {
            if(error.error){
                flashService.showError($translate.instant("curriculum.messages.invalid_file_format")+ ' ( '+ error.error.filename+' )', false);
            }
        } else if(status === 400) {
            flashService.showError($translate.instant("curriculum.messages.allow_only_five_images"), false);
        } else if(status === 413) {
            flashService.showError($translate.instant("curriculum.messages.images_size_exceeded"), false);
        }
    }

    return service;
}]);