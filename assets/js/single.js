// Get issues container so we can work with it
var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function (repo) {
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // Fetch the repo issues
    fetch(apiURL).then(function(response) {
        // If request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
            });
        } else {
            alert("There was a problem with your request!");
        }
    });
}

var displayIssues = function (issues) {
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

getRepoIssues("facebook/react");