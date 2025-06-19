angular.module('MediaApp')
  .controller('UserController', ['$scope', '$http', '$window', 'apiService', function($scope, $http, $window, apiService) {
    $scope.groupedVideos = {};
    $scope.searchQuery = '';

    $scope.logout = function () {
      sessionStorage.removeItem('session_id');
      $window.location.href = '/index.html';
    };

    function groupVideos(categories, videos) {
      const grouped = {};
      categories.forEach(cat => grouped[cat.name] = []);

      videos.forEach(video => {
        const category = video.categoryName || 'Uncategorized';
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(video);
      });

      return grouped;
    }

    function applyFilter() {
      const query = ($scope.searchQuery || '').toLowerCase();
      const filtered = {};

      for (const category in $scope.originalGrouped) {
        const matches = $scope.originalGrouped[category].filter(video =>
          video.title.toLowerCase().includes(query)
        );
        if (matches.length > 0) {
          filtered[category] = matches;
        }
      }

      $scope.groupedVideos = filtered;
    }

    $scope.isEmpty = function(obj) {
      return Object.keys(obj).length === 0;
    };

    function loadData() {
      Promise.all([
        apiService.getCategories(),
        apiService.getVideos()
      ]).then(([catRes, vidRes]) => {
        const categories = catRes.data;
        const videos = vidRes.data;

        $scope.originalGrouped = groupVideos(categories, videos);
        applyFilter();
        $scope.$apply(); // Force Angular to update view
      }).catch(err => {
        console.error("Error loading content:", err);
      });
    }

    $scope.$watch('searchQuery', applyFilter);
    loadData();
  }]);
