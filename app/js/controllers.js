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
//Msg#SepIDLast NameFirst NameDECP1 P2TeacherStatusParent's NameGrPhone #R inW inR outW out
    $scope.header_map = [{"key":"sep_id","value":"SepID"},
                         {"key":"last_name","value":"Last Name"},
                         {"key":"first_name","value":'First Name'},
                         {"key":"DEC","value":'DEC'},
                         {"key":"p1","value":"P1"},
                         {"key":"p2","value":"P2"},
                         {"key":"Teacher","value":"Teacher"},
                         {"key":"status","value":"Status"},
                         {"key":"parents_name","value":"Parent's Name"},
                         {"key":"grade","value":"Gr"},
                         {"key":"phone","value":"Phone #"},
                         {"key":"r_in","value":"R in"},
                         {"key":"w_in","value":"W in"},
                         {"key":"r_out","value":"R out"},
                         {"key":"w_out","value":"W out"}];
}
klass.$inject = ['$scope','Klass','$routeParams'];


