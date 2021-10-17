// Select HTML elements so we can use them in JS
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

// Function to be executed when form is submitted
var formSubmitHandler = function(event) {
    event.preventDefault();
    // Get value from the input element
    var username = nameInputEl.value.trim();
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username!");
    }
}

// Function to be executed when language button is clicked
var buttonClickHandler = function(event) {
    event.preventDefault();
    var language = event.target.getAttribute("data-language");
    if (language) {
        getFeaturedRepos(language);
    }
}

// Function to get featured repos
var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
     fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            })
        } else {
            alert("Error: GitHub language not found.");
        }
     })
}

// Function to get user repos from GitHub
var getUserRepos = function(user) {
    // Format the GitHub API URL
    var apiURL = "https://api.github.com/users/" + user + "/repos";
    // Make fetch request to URL
    fetch(apiURL).then(function(response) {
        // If the request was successful:
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub user not found!");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub.");
    });
}

var displayRepos = function(repos, searchTerm) {
    // Clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    // Check if the searched user has any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // Loop over the returned repos to display them
    for (var i = 0; i <repos.length; i++) {
        // Format the repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // Create a container for the repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // Create span element to hold the repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        // Append the name to the container
        repoEl.appendChild(titleEl);
        // Create a status element to display
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        // Check if the current repo has open issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        };
        // Append status element with issues status to container
        repoEl.appendChild(statusEl);
        // Append the container to the DOM element
        repoContainerEl.appendChild(repoEl);
    }
}

// Add an event listener to the user-form that calls formSubmitHandler when submitted
userFormEl.addEventListener("submit", formSubmitHandler);

// Add listener to language buttons
languageButtonsEl.addEventListener("click", buttonClickHandler);