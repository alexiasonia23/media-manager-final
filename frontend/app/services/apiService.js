
angular.module('MediaApp')
  .service('apiService', ['$http', function($http) {
    const API_URL = 'http://localhost:3000';

    // Login user
    this.login = function(credentials) {
      return $http.post(`${API_URL}/auth/login`, credentials);
    };

    // Users
    this.getUsers = function () {
      return $http.get(API_URL + '/users');
    };

    this.addUser = function (user) {
      return $http.post(API_URL + '/users', user);
    };

    this.deleteUser = function (id) {
      return $http.delete(API_URL + '/users/' + id);
    };

    // Categories
    this.getCategories = function () {
      return $http.get(API_URL + '/categories');
    };

    this.addCategory = function (category) {
      return $http.post(API_URL + '/categories', category);
    };

    this.deleteCategory = function (id) {
      return $http.delete(API_URL + '/categories/' + id);
    };

    // Videos
    this.getVideos = function () {
      return $http.get(API_URL + '/videos');
    };

    this.addVideo = function (video) {
      return $http.post(API_URL + '/videos', video);
    };

    this.deleteVideo = function (id) {
      return $http.delete(API_URL + '/videos/' + id);
    };
  }]);