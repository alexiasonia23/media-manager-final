angular.module('MediaApp')
    .service('apiService', ['$http', function($http) {
        const API_URL = 'http://localhost:3000';

        this.login = function(user) {
            return $http.post(`${API_URL}/auth/login`, user);
        };

        this.getVideos = function() {
            return $http.get(`${API_URL}/videos`);
        };

        this.getCategories = function() {
            return $http.get(`${API_URL}/categories`);
        };

        this.addVideo = function(video) {
            return $http.post(`${API_URL}/videos`, video);
        };

        this.updateVideo = function(id, video) {
            return $http.put(`${API_URL}/videos/${id}`, video);
        };

        this.deleteVideo = function(id) {
            return $http.delete(`${API_URL}/videos/${id}`);
        };

        this.addCategory = function(category) {
            return $http.post(`${API_URL}/categories`, category);
        };

        this.updateCategory = function(id, category) {
            return $http.put(`${API_URL}/categories/${id}`, category);
        };

        this.deleteCategory = function(id) {
            return $http.delete(`${API_URL}/categories/${id}`);
        };
    }]);