'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('studentLog.services',['tpResource']).
factory('Klass', function($resource){
  return $resource('/api/v1/classes/:classId', {}, {
    query: {method:'GET', params:{classId:""}, isArray:true}
  });
}).
value('version', '0.1')

/*
angular.module('studentLog').factory('Klass', ['$http', function($http) {
  // Book is a class which we can use for retrieving and 
  // updating data on the server
  var Klass = function(data) {
    angular.extend(this, data);
  }

  // a static method to retrieve Book by ID
  Klass.query = function() {
    var klasses = [];
    $http.get('/api/v1/classes/').then(function(response) {
        
        angular.forEach(response.data.objects,function(value,index){
            console.log(value);
            klasses.push(new Klass(value));
        });
    });
    return klasses;
  };

  // an instance method to create a new Book
  Klass.prototype.create = function() {
    var klass = this;
    return $http.post('/class/', klass).then(function(response) {
      klass.id = response.data.id;
      return klass;
    });
  }

  return Klass;
}]);
*/
