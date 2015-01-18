'use strict';

exports.up = function(knex, Promise) {
    return knex.schema.dropTable('migrations');  
};

exports.down = function(knex, Promise) {
    return knex.schema.createTable('migrations', function (table) {
        table.increments().primary();
        table.text('name').index('migrations_name_index')
            .unique().notNullable();
        table.timestamp('ran_at', true);
    });
};
