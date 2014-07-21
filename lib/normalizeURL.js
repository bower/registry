module.exports = function(url) {
  url = url || '';

  var githubURLRegex = /^(?:(?:git:\/\/|https?:\/\/(?:(?:\w+\:)?\w+@)?)|git@)(?:www\.)?github.com(?:\:|\/|:\/)([^\/]+)\/(.*?)(?:\.git)?(?:\/)?$/;
  var matchedURL = url.match(githubURLRegex);
  var username;
  var repo;

  if (matchedURL) {
    username = matchedURL[1];
    repo = matchedURL[2];

    url = 'git://github.com/' + username + '/' + repo + '.git';
  }

  return url;
};
