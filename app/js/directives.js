'use strict';

/* Directives */


angular.module('studentLog.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    }}]).
  directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        var panes = $scope.panes = [];

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        }

        this.addPane = function(pane) {
          if (panes.length == 0) $scope.select(pane);
          panes.push(pane);
        }
      },
      template:
        '<div class="tabbable">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
  }).
  directive('pane', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
  }).
  directive('saveFocus', function(uiState) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {

            $(element).bind('blur', function(e) {
                scope.$apply(uiState.blur(element));
            });
            $(element).bind('focus', function(e) {
                scope.$apply(uiState.focus(element));
            });
        }
    };
  }).
  directive('ngFocus',function(){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope,element,attrs){
          element.bind('focus', function(){
             scope.$eval(attrs.ngFocus);
          });
        }
    };
  }).
  directive('ngBlur',function(){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope,element,attrs){
          element.bind('blur', function(){
             scope.$eval(attrs.ngBlur);
          });
        }
    };
  }).
  directive('passing',function(){
    return {
      restrict: "A",
      scope:false,
      priority: 0,
      link: function(scope,element,attrs){
        //passing: inter.student.r_score_in>=400||inter.student.r_score_in.indexOf('FE')>=0}
        var score = scope.$eval(attrs.passing);
        if(score&&(score>=400||score.indexOf('FE')>=0)){
            element.addClass('passing');
            
        }
        element.append(score);
      }
    }
  }).
  directive('ajaxform',function(){
    return {
      restrict:"A",
      scope:false,
      link: function(scope,element,attrs){
          

          var file_input = $($(element).find('input[type=file]')[0])
          var ngModel_var = file_input.attr('ng-model'); 
          
          var attr_set = attrs['ajaxform'].split(',');
          var status_class_var = attr_set[0];
          var status_msg_var = attr_set[1];
          if (attr_set.length > 2) { //third one is success callback
          var success_cb = attr_set[2];
          }


          $(file_input).bind('change',function(){
            if (ngModel_var) {
              var file_name = file_input.val().replace(/C:\\fakepath\\/i, '')
              scope.$apply(ngModel_var+'="'+file_name+'"');
            }
            scope.$apply(status_class_var+"=''");
            scope.$apply(status_msg_var+"=''");
            
            //element.submit();
          });
          

          element.ajaxForm({
            success: function(resp,status,xhr,element){
              var msg = resp.msg;
              scope.$apply(status_class_var+"=''");
              scope.$apply(status_msg_var+"='"+msg+"'");
              scope.$apply(success_cb);
            },
            error: function(resp,status,xhr,element){
              
              var msg = angular.fromJson(resp.responseText).msg;
              scope.$apply(status_class_var+"='error'");
              scope.$apply(status_msg_var+"='"+msg+"'");
           
              //var err_msg = resp.responseText
            },
            dataType: 'json'
        })
      } 
  }
  });
