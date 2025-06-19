angular.module('MediaApp')
  .controller('AdminController', ['$scope', '$http', '$window', 'apiService', function ($scope, $http, $window, apiService) {
    $scope.users = [];
    $scope.categories = [];
    $scope.videos = [];
    $scope.newUser = {};
    $scope.newCategory = {};
    $scope.newVideo = {};

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
      console.log('newCategory:', $scope.newCategory); 

      if (!$scope.newCategory.name) return;

      console.log("Sending category:", $scope.newCategory); // DEBUG LOG
      apiService.addCategory($scope.newCategory).then(() => {
        $scope.newCategory = {};
        loadAll();
      });
    };

    $scope.deleteCategory = function (id) {
      apiService.deleteCategory(id).then(loadAll);
    };

    // VIDEOS
    $scope.addVideo = function () {
      if (!$scope.newVideo.title || !$scope.newVideo.url || !$scope.newVideo.categoryId) return;
      apiService.addVideo($scope.newVideo).then(() => {
        $scope.newVideo = {};
        loadAll();
      });
    };

    $scope.deleteVideo = function (id) {
      apiService.deleteVideo(id).then(loadAll);
    };

    loadAll();
  }]);
