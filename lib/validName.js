module.exports = function(name) {
  // regex to validate packages names according to the spec - https://github.com/bower/bower.json-spec#name
  //
  // - Lowercase, a-z, can contain digits, 0-9, can contain dash or dot but not start/end with them.
  // - Consecutive dashes or dots not allowed.
  // - 50 characters or less.
  if (!name.match(/^.{1,50}$/)) {
    return {
      error: 'Package names must be between 1 and 50 characters.'
    };
  }
  if (!name.match(/^[a-z0-9._-]*$/)) {
    return {
      error: 'Package names must only contain lower case a through z, 0 through 9, dots, dashes, and underscores'
    };
  }
  if (!!name.match(/[._-]{2,}/)) {
    return {
      error: 'Package names must not have consecutive dashes, dots, or underscores'
    };
  }
  if (!name.match(/^[^._-].*[^._-]$/)) {
    return {
      error: 'Package names can not start or end with dashes, dots, or underscores'
    };
  }

  return true;
};
