'use strict';

/* Controllers */

function klasses($scope,Klass) {
    var klasses = $scope.klasses = Klass.query();

    $scope.addClass = function(class_name) {
        klasses.push({'name':class_name, 
                      'date':"today!",
                      'active':true});
        $scope.next_id++;
    }

    $scope.delClass = function(klass) {
        klasses.splice(klasses.indexOf(klass),1)
    }

    $scope.toggle = function(klass) {
        var i = klasses.indexOf(klass)
        var current = klasses[i].active
        klasses[i].active = !current

    }
}
klasses.$inject = ['$scope','Klass'];

function klass($scope,Klass,$routeParams) {
    var klass = $scope.klass = Klass.get({'classId':$routeParams.classId})
}
klass.$inject = ['$scope','Klass','$routeParams'];


