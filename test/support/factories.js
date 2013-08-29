module.exports = {

  package: function (name, description, keywords, owners, type, url, versions) {
    this.name = name || 'thename';
    this.description = description || 'the package',
    this.keywords = keywords || ['keyword1', 'keyword2'];
    this.owners = owners || ['owner1', 'owner2'];
    this.type = type || 'git';
    this.url = url || 'https://github.com/bower/registry.git';
    this.versions = versions || ['1.2.3', '1.2.4'];
  },

  user: function (name, password, email, url) {
    this.name = name || '';
    this.password = password || [];
    this.email = email || '';
    this.url = url || '';
  },

  info: function (registry, name, description) {
    this.registry = registry || '0.0.1';
    this.name = name || 'bower-registry';
    this.description = description || 'bower registry with couchdb persistence layer';
  }

};
