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
  directive('saveChange',function(uiState) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope,element,attrs) {
            $(element).bind('change',function() {
                scope.$apply(uiState.focus(element));
                scope.$apply(uiState.blur(element));
            })
      }
    } 
  });