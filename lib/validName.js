module.exports = function(name) {
  // regex to validate packages names according to the spec - https://github.com/bower/bower.json-spec#name
  //
  // - Lowercase, a-z, can contain digits, 0-9, can contain dash or dot but not start/end with them.
  // - Consecutive dashes or dots not allowed.
  // - 50 characters or less.
  return !!name.match(/^[^._-](([a-z0-9])|([._-])?(?!\3)){1,50}[^._-]$/);
};
