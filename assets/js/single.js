// Get HTML elements so we can work with them
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // Get repo name from url query string
    var repoName = document.location.search.split("=")[1];
    if (repoName) {
        // Fetch issues and display repo name
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {
        // Redirect to homepage
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo) {
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // Fetch the repo issues
    fetch(apiURL).then(function(response) {
        // If request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
                 // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            document.location.replace("./index.html");
        }
    });
}

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
      }
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        // Create span for issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        // Append to container
        issueEl.appendChild(titleEl);
        // Create type element
        var typeEl = document.createElement("span");
        // Check if issue is pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        // Append to container
        issueEl.appendChild(typeEl);
        // Append to HTML container
        issueContainerEl.appendChild(issueEl);
      }
}

var displayWarning = function(repo) {
    // Add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit the ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "full issues list for this repository at GitHub.";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    // append to warning container
    limitWarningEl.appendChild(linkEl);
}

getRepoName();