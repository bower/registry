module.exports = {

  package: function (name, description, keywords, owners, type, url, versions) {
    this.name = name || '';
    this.description = description || '',
    this.keywords = keywords || [];
    this.owners = owners || [];
    this.type = type || '';
    this.url = url || '';
    this.versions = versions || [];
  },

  user: function (name, password, email, url) {
    this.name = name || '';
    this.password = password || [];
    this.email = email || '';
    this.url = url || '';
  },

  info: function (registry, name, description) {
    this.registry = registry || '';
    this.name = name || '';
    this.description = description || '';
  }

};
