module.exports = function(name) {
  // regex to validate packages names according to the spec - https://github.com/bower/bower.json-spec#name
  //
  // - Lowercase, a-z, can contain digits, 0-9, can contain dash or dot but not start/end with them.
  // - Consecutive dashes or dots not allowed.
  // - 50 characters or less.

  var isValid = true;
  var errors = [];
  var length;

  if (!name.match(/^.{1,50}$/)) {
      errors.push('be between 1 and 50 characters');
  }
  // TODO: Allow only lowercase characters, but allow re-registering mixed case packages
  // See: https://github.com/bower/bower/issues/1751
  if (!name.match(/^[A-Za-z0-9._-]*$/)) {
      errors.push('only contain lower case a through z, 0 through 9, dots, dashes, and underscores');
  }
  if (!!name.match(/[._-]{2,}/)) {
      errors.push('not have consecutive dashes, dots, or underscores');
  }
  if (!name.match(/^[^._-].*[^._-]$/)) {
      errors.push('not start or end with dashes, dots, or underscores');
  }

  length = errors.length;

  if (length) {

    if (length > 1) {
      errors[length - 1] = 'and must ' + errors[length - 1];
    }

    isValid = {
      error: 'Package names must ' + errors.join(', ') + '.'
    };
  }

  return isValid;
};
