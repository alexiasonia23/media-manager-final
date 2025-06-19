// Define the main application module
angular.module('MediaApp', [])
    .config(['$httpProvider', function($httpProvider) {
        // Enable CORS
        $httpProvider.defaults.withCredentials = true;
    }]);

