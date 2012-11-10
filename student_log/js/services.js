'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('studentLog.services',[]).value('version', '0.1');

angular.module('studentLog').factory('Klass',function($http){
        
        var Klass = function(data) {
            angular.extend(this, data);
        }

        Klass.get = function(id) {
            return $http({'method':'get','url':'http://localhost/api/v1/classes/'}).then(function(response) {
              return new Klass(response.data);
            });
        };
      return Klass;  
})
