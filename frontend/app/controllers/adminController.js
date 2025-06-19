angular.module('MediaApp')
  .controller('AdminController', ['$scope', '$http', '$window', 'apiService', function ($scope, $http, $window, apiService) {
    $scope.users = [];
    $scope.categories = [];
    $scope.videos = [];
    $scope.newUser = {};
    $scope.newCategory = '';
    $scope.video = {};

    // ✅ Logout with confirmation
   $scope.logout = function () {
  const sessionId = sessionStorage.getItem('session_id');
  const confirmLogout = confirm("Are you sure you want to log out?");

  if (!confirmLogout) return;

  $http.put('http://localhost:3000/auth/logout', { session_id: sessionId })
    .finally(function () {
      sessionStorage.removeItem('session_id');
      $scope.logoutMessage = "✅ Logged out successfully!";
      
      // Show message briefly, then redirect
      setTimeout(() => {
        $scope.logoutMessage = '';
        $window.location.href = '/index.html';
      }, 1500);

      $scope.$apply(); // force digest cycle for UI update
    });
};

    function loadAll() {
      apiService.getUsers().then(res => $scope.users = res.data);
      apiService.getCategories().then(res => $scope.categories = res.data);
      apiService.getVideos().then(res => $scope.videos = res.data);
    }

    // USERS
    $scope.addUser = function () {
      if (!$scope.newUser.name || !$scope.newUser.email || !$scope.newUser.password) return;
      apiService.addUser($scope.newUser).then(() => {
        $scope.newUser = {};
        loadAll();
      });
    };

    $scope.deleteUser = function (id) {
      apiService.deleteUser(id).then(loadAll);
    };

    // CATEGORIES
    $scope.addCategory = function () {
      if (!$scope.newCategory) return;
      apiService.addCategory({ name: $scope.newCategory }).then(() => {
        $scope.newCategory = '';
        loadAll();
      });
    };

    $scope.deleteCategory = function (id) {
      apiService.deleteCategory(id).then(loadAll);
    };

    // VIDEOS
    $scope.addVideo = function () {
      if (!$scope.video.title || !$scope.video.url || !$scope.video.categoryId) return;
      apiService.addVideo($scope.video).then(() => {
        $scope.video = {};
        loadAll();
      });
    };

    $scope.deleteVideo = function (id) {
      apiService.deleteVideo(id).then(loadAll);
    };

    loadAll();
  }]);
