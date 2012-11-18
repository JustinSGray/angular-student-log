'use strict';


/* root scope */ 
app.run(function($rootScope) {
    $rootScope.alert = function(text) {
      alert(text);
    };

    $rootScope.status_map = [
        {'key':"enr","long_name":"Enrolled","short_name":"Enr"},
        {'key':"wd","long_name":"Withdrawn","short_name":"WD"},
        {'key':"adm","long_name":"Admitted","short_name":"Adm"}
    ] 

    $rootScope.score_columns = ['r_score_in','r_score_out','w_score_in','w_score_out'];
    $rootScope.teacher_types = ['GenEd','DEC','Lift','AC/MH','Indep']
    $rootScope.teacher_classes = {'GenEd':'','DEC':'DEC','Lift':'Lift','AC/MH':'ACMH','Indep':'Indep'};                     
  });
/* Controllers */

function klasses($scope,$http,Klass) {
    var klasses = $scope.klasses = Klass.query();

    $scope.addClass = function(class_name) {
        var new_klass = {'name':class_name, 
                      'date':new Date().toJSON(),
                      'active':true};
        Klass.save(new_klass,function(){
            klasses.push(new_klass);
        });
    }

    $scope.delClass = function(klass) {
        var r = confirm("Are you sure you want to delete this class? This will permanently remove all the data about it!!!")
        if(r){
            $scope.klasses.splice(klasses.indexOf(klass),1);
            Klass.delete({'classId':klass.id});
        };

    }

    $scope.toggle = function(klass) {
        var i = klasses.indexOf(klass)
        var current = klasses[i].active
        klasses[i].active = !current
        Klass.save(klass);
    }
}
klasses.$inject = ['$scope','$http','Klass'];

function klass($scope,$filter,Klass,Interaction,Record,$routeParams,$location) {
    $scope.multinote = "Hello?";
    $scope.select_options = {all:false}

    $scope.klass = Klass.get({'classId':$routeParams.classId},function(){
        angular.forEach($scope.klass.interactions,function(value,key){ 
            $scope.klass.interactions[key].send_msg = $scope.select_options.all;
            
            var name = "klass.interactions["+key+"]";
            $scope.$watch(name,function(oldVal,newVal){
                Interaction.save($scope.klass.interactions[key]);
            },true);
            
        });
    });

    

    $scope.$watch("select_options.all",function(newVal,oldVal){
        angular.forEach($filter('filter')($scope.klass.interactions,{'status':'Enr'}),function(value,key){
            value.send_msg = newVal;
        });
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

    $scope.add_multinote = function(text){
        var inters = [];
        angular.forEach($filter('filter')($scope.klass.interactions,{'status':'Enr','send_msg':true}),function(value,key){
            inters.push(value.resource_uri)
        });
        if (inters.length) {
            var data = {"notes":text,"timestamp":new Date().toJSON(),"interactions":inters}

            Record.save(data);
            $scope.multinote = "";
        }
        else {
            $scope.multinote = "nothing checked";
        }

    }                     

    $scope.goStudent = function(studentId) {
        $location.path("/classes/"+klass.id+"/students/"+studentId);
    }

    
    
}
klass.$inject = ['$scope','$filter','Klass','Interaction','Record','$routeParams','$location','saveQueue'];


function interaction($scope,Interaction,$routeParams) {

    $scope.header_map = [{"key":"sep_id","value":"SepID"},
                         {"key":"last_name","value":"Last Name"},
                         {"key":"first_name","value":'First Name'},
                         {"key":"dec","value":'DEC'},
                         {"key":"parents_name","value":"Parent's Name"},
                         {"key":"grade","value":"Gr"},
                         {"key":"phone","value":"Phone #"},
                         {"key":"r_score_in","value":"R in"},
                         {"key":"w_score_in","value":"W in"},
                         {"key":"r_score_out","value":"R out"},
                         {"key":"w_score_out","value":"W out"}];
    var auto_save = ['status','teacher','q1','q2'];

    $scope.interaction = Interaction.get({'interactId':$routeParams.interactId},function(){
        var interaction = $scope.interaction
        $scope.klass = interaction.klass
        $scope.student = interaction.student
        
        angular.forEach(auto_save,function(attr,key){
            $scope.$watch('interaction.'+attr,function(oldVal,newVal){
                $scope.save_interaction();
            },true);
        });
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
        Interaction.save($scope.interaction);
    }            


}
interaction.$inject = ['$scope','Interaction','$routeParams'];


