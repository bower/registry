'use strict';

// First migrations check for table existence for backward compatibility
exports.up = function(knex, Promise) {
    return knex.transaction(function(knex) {
        return Promise.all([
            knex.schema.hasTable('migrations').then(function (exists) {
                if (exists) return;
                return knex.schema.createTable('migrations', function (table) {
                    table.increments().primary();
                    table.text('name').index('migrations_name_index')
                        .unique().notNullable();
                    table.timestamp('ran_at', true);
                });
            }),
            knex.schema.hasTable('packages').then(function (exists) {
                if (exists) return;
                return knex.schema.createTable('packages', function (table) {
                    table.increments().primary();
                    table.text('name').index('packages_name_index')
                        .unique().notNullable();
                    table.text('url').notNullable();
                    table.timestamp('created_at', true);
                    table.integer('hits').default(0);
                });
            })
        ]);
    });
};

exports.down = function(knex, Promise) {
    console.warn('First migration cannot be rollbacked');
};
