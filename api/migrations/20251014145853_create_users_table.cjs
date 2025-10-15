exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps('email_verified_at').nullable();
    table.integer('role_id').notNullable().defaultTo(1); // 1: user, 2: manager , 3: admin
    table.timestamps(true, true); // created_at et updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
