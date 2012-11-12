'use strict';

/* Controllers */

function klasses($scope,$http,Klass) {
    var klasses = $scope.klasses = Klass.query();

    /*$scope.klasses = [];
    $http.get('/api/v1/classes/').then(function(response) {
              console.log(response.data.objects);
              $scope.klasses = response.data.objects;
            });*/

    $scope.addClass = function(class_name) {
        klasses.push({'name':class_name, 
                      'date':"today!",
                      'active':true});
        $scope.next_id++;
    }

    $scope.delClass = function(klass) {
        var r = confirm("Are you sure you want to delete this class? This will permanently remove all the data about it!!!")
        if(r){
            $scope.klasses.splice(klasses.indexOf(klass),1);
        };
    }

    $scope.toggle = function(klass) {
        var i = klasses.indexOf(klass)
        var current = klasses[i].active
        klasses[i].active = !current

    }
}
klasses.$inject = ['$scope','$http','Klass'];

function klass($scope,$filter,Klass,$routeParams,$location) {
    $scope.klass = Klass.get({'classId':$routeParams.classId},function(){
        angular.forEach($scope.klass.interactions,function(value,key){ 
            $scope.klass.interactions[key].send_msg = false;
        })
    });
    //Msg#SepIDLast NameFirst NameDECP1 P2TeacherStatusParent's NameGrPhone #R inW inR outW out
    $scope.header_map = [{"key":"sep_id","value":"SepID"},
                         {"key":"last_name","value":"Last Name"},
                         {"key":"first_name","value":'First Name'},
                         {"key":"dec","value":'DEC'},
                         {"key":"p1","value":"P1"},
                         {"key":"p2","value":"P2"},
                         {"key":"teacher","value":"Teacher"},
                         {"key":"status","value":"Status"},
                         {"key":"parents_name","value":"Parent's Name"},
                         {"key":"grade","value":"Gr"},
                         {"key":"phone","value":"Phone #"},
                         {"key":"r_score_in","value":"R in"},
                         {"key":"w_score_in","value":"W in"},
                         {"key":"r_score_out","value":"R out"},
                         {"key":"w_score_out","value":"W out"}];

    $scope.status_map = [
        {'key':"enr","long_name":"Enrolled","short_name":"Enr"},
        {'key':"wd","long_name":"Withdrawn","short_name":"WD"},
        {'key':"adm","long_name":"Admitted","short_name":"Adm"}
    ]  

    $scope.score_columns = ['r_in','r_out','w_in','w_out'];                    

    $scope.teacher_types = ['GenEd','DEC','Lift','AC/MH','Indep']
    $scope.teacher_classes = {'GenEd':'','DEC':'DEC','Lift':'Lift','AC/MH':'ACMH','Indep':'Indep'};
    
    $scope.goStudent = function(studentId) {
        $location.path("/classes/"+klass.id+"/students/"+studentId);
    }
    
}
klass.$inject = ['$scope','$filter','Klass','$routeParams','$location'];


function interaction($scope,Interaction,$routeParams) {

    $scope.header_map = [{"key":"sep_id","value":"SepID"},
                         {"key":"last_name","value":"Last Name"},
                         {"key":"first_name","value":'First Name'},
                         {"key":"dec","value":'DEC'},
                         {"key":"parents_name","value":"Parent's Name"},
                         {"key":"grade","value":"Gr"},
                         {"key":"phone","value":"Phone #"},
                         {"key":"r_in","value":"R in"},
                         {"key":"w_in","value":"W in"},
                         {"key":"r_out","value":"R out"},
                         {"key":"w_out","value":"W out"}];

    $scope.status_map = [
        {'key':"enr","long_name":"Enrolled","short_name":"Enr"},
        {'key':"wd","long_name":"Withdrawn","short_name":"WD"},
        {'key':"adm","long_name":"Admitted","short_name":"Adm"}
    ] 

    $scope.score_columns = ['r_in','r_out','w_in','w_out'];
    $scope.teacher_types = ['GenEd','DEC','Lift','AC/MH','Indep']
    $scope.teacher_classes = {'GenEd':'','DEC':'DEC','Lift':'Lift','AC/MH':'ACMH','Indep':'Indep'};
    

    var interaction = $scope.interaction = Interaction.get({'interactId':$routeParams.interactId},function(){
        $scope.klass = interaction.klass
        $scope.student = interaction.student
    });

    $scope.add_note = function(text) {
        var note = {
            "class":$scope.klass,
            "date_time": new Date(),
            "note":text
        }
        $scope.klass_data.notes.push(note);
    }

    $scope.save_interaction = function() {
        console.log($scope.interaction);
        Interaction.save($scope.interaction);
    }            


}
interaction.$inject = ['$scope','Interaction','$routeParams'];


