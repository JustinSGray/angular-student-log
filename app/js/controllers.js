'use strict';


/* root scope */ 
app.run(function($rootScope) {
    
    $rootScope.status_map = [
        {'key':"ENR","long_name":"Enrolled"},
        {'key':"WD ","long_name":"Withdrawn"},
        {'key':"ADM","long_name":"Admitted"}
    ] 

    $rootScope.score_columns = ['r_score_in','r_score_out','w_score_in','w_score_out'];
    $rootScope.teacher_types = ['GenEd','DEC ','LIFT','AC/MH','Indep ']
    $rootScope.teacher_classes = {'GenEd':'','DEC ':'DEC','LIFT':'Lift','AC/MH':'ACMH','Indep ':'Indep'};                     
  });
/* Controllers */

app.controller('people_search',function people_search($scope,$location){
    $scope.q = "";
    $scope.search = function(){
      /*$http({method: 'GET', url: '/api/v1/students/search/',
           params: {format:"json",q:$scope.q}}).
        success(function(data) {
          console.log(data);
        })*/
      $location.search('q',$scope.q).path('/search')
    };
});

app.controller('search',function search($scope,$http,$routeParams){
    $scope.q = $routeParams['q'];

    $http({method: 'GET', url: '/api/v1/students/search/',
       params: {format:"json",q:$scope.q}}).
    success(function(data) {
      $scope.students = data.objects;
      console.log(data.objects);
    })
   
});

app.controller('klasses', function klasses($scope,Klass,$cookies) {
    var klasses = $scope.klasses = Klass.query();
    $scope.csrf = $cookies.csrftoken;

    $scope.addClass = function(class_name) {
        var new_klass = {'name':class_name, 
                      'date':new Date().toJSON(),
                      'active':true};
        Klass.save(new_klass,function(klass){
            klasses.push(klass);
            $scope.class_name = "";
        });
    }

    $scope.delClass = function(klass) {
        var r = confirm("Are you sure you want to delete this class? This will permanently remove all the data about it!!!")
        if(r){
            
            Klass.delete({'classId':klass.id},function(){
              $scope.klasses.splice(klasses.indexOf(klass),1);
            });
        };

    }

    $scope.toggle = function(klass) {
        var i = klasses.indexOf(klass)
        var current = klasses[i].active
        klasses[i].active = !current
        Klass.save(klass);
    }
});

app.controller('klass',function klass($scope,$filter,FullKlass,Interaction,Record,$cookies,$routeParams) {
    $scope.select_options = {all:false}
    $scope.csrf = $cookies.csrftoken;

    function get_klass(){
      $scope.klass = FullKlass.get({'classId':$routeParams.classId},function(){
          angular.forEach($scope.klass.interactions,function(value,key){ 
              $scope.klass.interactions[key].send_msg = $scope.select_options.all;
              
              var name = "klass.interactions["+key+"]";
              
              $scope.$watch(name,function(oldVal,newVal){
                  if(oldVal!=newVal){
                    var inter = $scope.klass.interactions[key]
                    Interaction.save(inter);
                  }
              },true);
              
          });
      });
    };

    get_klass();

    $scope.upload_success = function(){
        get_klass();
    };

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
                         //{"key":"p1","value":"P1"}, //sharon want's these gone for now
                         //{"key":"p2","value":"P2"},
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
        var students = [];
        angular.forEach($filter('filter')($scope.klass.interactions,{'status':'Enr','send_msg':true}),function(value,key){
            students.push(value.student.resource_uri);
        });
        if (students.length) {
            var data = {"klass":$scope.klass.resource_uri,"students":students,
                        "notes":text,"timestamp":new Date().toJSON()}

            Record.save(data);
            $scope.multinote = "";
        }
        else {
            $scope.multinote = "nothing checked";
        }

    }
});

app.controller('interaction',function interaction($scope,Student,Interaction,Record,saveQueue,$routeParams) {

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

    $scope.interaction = Interaction.get({'interactId':$routeParams.interactId},function(){
        var interaction = $scope.interaction;
        $scope.klass = interaction.klass;
        var d = new Date()
        var n = d.getTimezoneOffset()/60;
        var offset = "-0"+n+"00"
        $scope.student = Student.get({'studentId':interaction.student.sep_id},function(){
          angular.forEach($scope.student.records,function(record,key){
            
            record.timestamp =record.timestamp.replace(/\.[0-9]+/,"")
            record.timestamp += offset;
          });
        });
        
        var auto_save = ['status','teacher','q1','q2'];
        angular.forEach(auto_save,function(attr,key){
            $scope.$watch('interaction.'+attr,function(oldVal,newVal){
                $scope.save_interaction();
            },true);
        });

        $scope.$watch('student',function(oldVal,newVal){
            saveQueue.add('student',function(){
                Student.save($scope.student);
                $scope.save_class = null
            });
        },true);

        $scope.$watch('student.dec',function(){
          Student.save($scope.student);
        });
    });

    
    //applies a warning so you know it's not been saved yet
    $scope.onFocus = function(){
        $scope.save_class = "warning"
    };

    $scope.add_note = function(text) {
        var note = {
            "class":$scope.klass,
            "timestamp": new Date().toJSON(),
            "notes":text,
            "students":[$scope.student.resource_uri,],
            "klass":$scope.klass,
        }
        Record.save(note,function(){
            $scope.student.records.push(note);
        })
        
    }

    $scope.save_interaction = function() {
        Interaction.save($scope.interaction);
        $scope.save_class = null
    }            


});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/classes', {templateUrl: 'partials/classes.html', controller: 'klasses'});
    $routeProvider.when('/classes/:classId', {templateUrl: 'partials/class.html', controller: 'klass'});
    $routeProvider.when('/interactions/:interactId',{templateUrl: 'partials/interaction.html',controller:'interaction'});
    $routeProvider.when('/search',{templateUrl: 'partials/search.html',controller:"search"})
    $routeProvider.otherwise({redirectTo: '/classes'});
  }])

