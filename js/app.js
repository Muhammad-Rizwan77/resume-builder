// Resume Builder AngularJS Application
(function() {
    'use strict';

    // Main application module
    angular.module('resumeBuilderApp', [])
        .run(['$rootScope', function($rootScope) {
            // Initialize application
            console.log('Resume Builder App initialized');

            // Global error handling
            window.addEventListener('error', function(event) {
                console.error('Global error:', event.error);
            });
        }]);

})();
