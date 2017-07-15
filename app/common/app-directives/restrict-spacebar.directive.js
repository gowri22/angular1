/********************************************************************************
* Copyright (c) 2017 Square Panda Inc.                                          *
* All Rights Reserved.                                                          *
* Dissemination, use, or reproduction of this material is strictly forbidden    *
* unless prior written permission is obtained from Square Panda Inc.            *
*********************************************************************************/
app.directive('disallowSpaces', function() {
  return {
    restrict: 'A',

    link: function($scope, $element) {
      $element.bind('input', function() {
        $(this).val($(this).val().replace(/ /g, ''));
      });
    }
  };
});