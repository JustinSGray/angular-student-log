'use strict';


// Declare app level module which depends on filters, and services
angular.module('studentLog', ['studentLog.filters', 'studentLog.services', 'studentLog.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/classes', {templateUrl: 'partials/classes.html', controller: klasses});
    $routeProvider.when('/classes/:classId', {templateUrl: 'partials/class.html', controller:klass});
    $routeProvider.when('/classes/:classId/students/:studentId',{templateUrl: 'Partials/class_student.html',controller:klass_student})
    $routeProvider.otherwise({redirectTo: '/classes'});
  }]);
