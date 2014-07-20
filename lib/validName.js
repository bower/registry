module.exports = function(name) {
  return !!name.match(/^[^._-](([a-z0-9])|([._-])?(?!\3)){1,50}[^._-]$/);
};
