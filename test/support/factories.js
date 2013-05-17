"use strict";

module.exports = {
  package: function (resource, name, url) {
    this.resource = resource || 'package';
    this.name = name || "default";
    this.url = url || "default";
  }
};
