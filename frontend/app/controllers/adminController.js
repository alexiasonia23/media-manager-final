
angular.module('MediaApp')
  .controller('AdminController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.users = [];
    $scope.categories = [];
    $scope.videos = [];
    $scope.newUser = {};
    $scope.newCategory = '';
    $scope.video = {};

    function loadAll() {
      apiService.getUsers().then(res => $scope.users = res.data);
      apiService.getCategories().then(res => $scope.categories = res.data);
      apiService.getVideos().then(res => $scope.videos = res.data);
    }

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