var getUserRepos = function(user) {
    // Format the GitHub API URL
    var apiURL = "https://api.github.com/users/" + user + "/repos";
    // Make fetch request to URL
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
};

getUserRepos();