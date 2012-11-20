'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('studentLog.services',['tpResource']).value('version', '0.1').
factory('Klass', function($resource){
  return $resource('/api/v1/classes/:classId', {}, {
    query: {method:'GET', params:{classId:""}, isArray:true}
  });
}).
factory('Interaction', function($resource){
  return $resource('/api/v1/interactions/:interactId', {}, {
    query: {method:'GET', params:{interactId:""}, isArray:true}
  });
}).
factory('Record', function($resource){
  return $resource('/api/v1/records/:recordId', {}, {
    query: {method:'GET', params:{interactId:""}, isArray:true}
  });
}).
factory('uiState', function() {
    var activeElement = {
        current: null,
        previous: null
    };
    return {
        blur: function(element) {
            //console.log('blurred: ' + $(element).attr('id'));
            activeElement.current = '';
            activeElement.previous = $(element).attr('id');

        },
        focus: function(element) {
            //console.log('focussed: ' + $(element).attr('id'));
            activeElement.current = $(element).attr('id');
        },
        active: activeElement
    };
}).
factory('saveQueue', function(uiState, $rootScope) {
    var registry = {};

    var saveQueue = {
        /**
         * Adds an interaction that should be performed later to the registry under the
         * given key.
         *
         * If an interaction already existed under this key the old interaction will be 
         * overwritten and not executed.
         *
         * @param {string} key The key under which to store the interaction
         * @param {function()} interaction The interaction function to be executed later
         */
        add: function(key, interaction) {
            registry[key] = interaction;
        },

        /**
         * @private
         *
         * Will be called by a watch on focussed state. Executes all pending interactions.
         */
        executeCallbacks: function() {
            angular.forEach(registry, function(value, key, myMap) {
                if (value) {
                    value(key);
                }
            });
            registry = {};
        }
    };

    $rootScope.$watch(function() {
        return uiState.active.current;
    }, function(newValue, oldValue) {
        //console.log("active state change: ",uiState.active.current)
        if (oldValue != newValue) {
            saveQueue.executeCallbacks();
        }
    });
    return saveQueue;
});


