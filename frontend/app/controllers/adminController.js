angular.module('MediaApp').controller('AdminController', ['$scope', 'apiService', function($scope, apiService) {
  // Get session token from localStorage
  $scope.sessionToken = localStorage.getItem('session_id');
  
  // Initialize data arrays
  $scope.users = [];
  $scope.categories = [];
  $scope.videos = [];
  
  // User Management
  $scope.newUser = {};
  $scope.createUser = function() {
      if (!$scope.newUser.name || !$scope.newUser.email || !$scope.newUser.password) {
          alert('Please fill all user fields');
          return;
      }
      
      $http.post('/user', {
          session_id: $scope.sessionToken,
          name: $scope.newUser.name,
          email: $scope.newUser.email,
          passwd: $scope.newUser.password
      }).then(function(response) {
          alert('User created successfully!');
          $scope.newUser = {}; // Clear form
          $scope.loadUsers(); // Refresh user list
      }).catch(function(error) {
          alert('Error creating user: ' + (error.data ? error.data.message : 'Unknown error'));
      });
  };
  
  $scope.loadUsers = function() {
      $http.get('/users/' + $scope.sessionToken)
      .then(function(response) {
          $scope.users = response.data;
      }).catch(function(error) {
          console.error('Error loading users:', error);
      });
  };
  
  $scope.deleteUser = function(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
          $http.delete('/user/' + $scope.sessionToken + '/' + userId)
          .then(function(response) {
              alert('User deleted successfully!');
              $scope.loadUsers(); // Refresh user list
          }).catch(function(error) {
              alert('Error deleting user: ' + (error.data ? error.data.message : 'Unknown error'));
          });
      }
  };
  
  // Category Management
  $scope.newCategory = {};
  $scope.addCategory = function() {
    if (!$scope.newCategory.name) {
      alert('Please enter a category name');
      return;
    }
    apiService.addCategory($scope.newCategory)
      .then(function(response) {
        alert('Category added successfully!');
        $scope.newCategory = {};
        $scope.loadCategories();
      })
      .catch(function(error) {
        alert('Error adding category: ' + (error.data && error.data.message ? error.data.message : 'Unknown error'));
      });
  };
  
  $scope.loadCategories = function() {
    apiService.getCategories()
      .then(function(response) {
        $scope.categories = response.data;
      })
      .catch(function(error) {
        alert('Error loading categories: ' + (error.data && error.data.message ? error.data.message : 'Unknown error'));
      });
  };
  
  $scope.deleteCategory = function(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
      apiService.deleteCategory(categoryId)
        .then(function(response) {
          alert('Category deleted successfully!');
          $scope.loadCategories();
        })
        .catch(function(error) {
          alert('Error deleting category: ' + (error.data && error.data.message ? error.data.message : 'Unknown error'));
        });
    }
  };
  
  // Video Management
  $scope.newVideo = {};
  $scope.createVideo = function() {
      if (!$scope.newVideo.title || !$scope.newVideo.url || !$scope.newVideo.category_id) {
          alert('Please fill all required video fields (title, URL, category)');
          return;
      }
      
      $http.post('/video', {
          session_id: $scope.sessionToken,
          title: $scope.newVideo.title,
          url: $scope.newVideo.url,
          description: $scope.newVideo.description || '',
          category_id: $scope.newVideo.category_id
      }).then(function(response) {
          alert('Video created successfully!');
          $scope.newVideo = {}; // Clear form
          $scope.loadVideos(); // Refresh video list
      }).catch(function(error) {
          alert('Error creating video: ' + (error.data ? error.data.message : 'Unknown error'));
      });
  };
  
  $scope.loadVideos = function() {
      $http.get('/videos/' + $scope.sessionToken)
      .then(function(response) {
          $scope.videos = response.data;
      }).catch(function(error) {
          console.error('Error loading videos:', error);
      });
  };
  
  $scope.deleteVideo = function(videoId) {
      if (confirm('Are you sure you want to delete this video?')) {
          $http.delete('/video/' + $scope.sessionToken + '/' + videoId)
          .then(function(response) {
              alert('Video deleted successfully!');
              $scope.loadVideos(); // Refresh video list
          }).catch(function(error) {
              alert('Error deleting video: ' + (error.data ? error.data.message : 'Unknown error'));
          });
      }
  };
  
  $scope.getCategoryName = function(categoryId) {
      var category = $scope.categories.find(function(cat) {
          return cat.id == categoryId;
      });
      return category ? category.name : 'Unknown Category';
  };
  
  // Load all data when controller initializes
  $scope.loadUsers();
  $scope.loadCategories();
  $scope.loadVideos();
}]);