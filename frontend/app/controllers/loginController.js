angular.module('MediaApp')
  .controller('LoginController', ['$scope', '$http', '$window', 'apiService', function ($scope, $http, $window, apiService) {
    $scope.user = {
      username: '',
      password: ''
    };
    $scope.error = '';

    $scope.login = function () {
      if (!$scope.user.username || !$scope.user.password) {
        $scope.error = 'Please enter both username and password';
        return;
      }

      apiService.login($scope.user)
        .then(function (response) {
          if (response.data.success) {
            $window.location.href = '/admin.html';
          } else {
            $scope.error = response.data.message || 'Login failed';
          }
        })
        .catch(function (error) {
          console.error('Login error:', error);
          $scope.error = error.data?.message || 'An error occurred during login';
        });
    };
  }]);
