'use strict';

exports.up = function (knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "pg_trgm"')
  .then(function () {
    return knex.raw('CREATE INDEX name_full_idx ON packages USING gist (name gist_trgm_ops);');
  })
  .then(function () {
    return knex.raw('CREATE INDEX url_full_idx ON packages USING gist (url gist_trgm_ops);');
  });
};

// First migrations check for table existence for backward compatibility
exports.down = function(knex, Promise) {
  return knex.raw('DROP INDEX IF EXISTS name_full_idx')
    .then(function () {
      return knex.raw('DROP INDEX IF EXISTS url_full_idx');
    })
    .then(function () {
      return knex.raw('DROP EXTENSION IF EXISTS "pg_trgm"');
    });
};
