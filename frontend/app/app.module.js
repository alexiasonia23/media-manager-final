angular.module('MediaApp', [])
    .controller('LoginController', ['$scope', '$http', 'apiService', function($scope, $http, apiService) {
        $scope.user = {};
        $scope.error = '';

        $scope.login = function() {
            apiService.login($scope.user)
                .then(function(response) {
                    if (response.data.success) {
                        window.location.href = '/admin';
                    } else {
                        $scope.error = response.data.message || 'Login failed';
                    }
                })
                .catch(function(error) {
                    $scope.error = error.data.message || 'An error occurred';
                });
        };
    }])
    .controller('AdminController', ['$scope', '$http', 'apiService', function($scope, $http, apiService) {
        $scope.videos = [];
        $scope.categories = [];
        $scope.error = '';

        $scope.loadData = function() {
            apiService.getVideos()
                .then(function(response) {
                    $scope.videos = response.data;
                })
                .catch(function(error) {
                    $scope.error = 'Failed to load videos';
                });

            apiService.getCategories()
                .then(function(response) {
                    $scope.categories = response.data;
                })
                .catch(function(error) {
                    $scope.error = 'Failed to load categories';
                });
        };

        $scope.loadData();
    }]);

