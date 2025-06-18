angular.module('mediaApp').controller('LoginController', function($scope, apiService, $location) {
    // Inject $location to handle redirection after successful login

    $scope.user = {};
    $scope.error = null; // Initialize error to null instead of an empty string.
                        // This makes ng-if="error" evaluate to false by default.

    $scope.login = function() {
        // Clear any previous error messages before attempting a new login
        $scope.error = null;

        apiService.login($scope.user.username, $scope.user.password)
            .then(function(response) {
                const sessionId = response.data.session_id; // The server returns a session_id on success
                localStorage.setItem('session_id', sessionId); // Store the token in the user's browser
                console.log("Login successful. Session ID:", sessionId);

                // Assuming successful authentication leads to the administration panel
                // You'll need to define a route for your admin panel (e.g., '/admin')
                $location.path('/admin'); // Redirect to the admin panel
            })
            .catch(function(error) {
                console.error("Login failed:", error);
                // Set a user-friendly error message based on the error response
                if (error && error.data && error.data.message) {
                    $scope.error = error.data.message;
                } else {
                    $scope.error = 'Invalid username or password. Please try again.';
                }
            });
    };
});