/**
 * Example migration - Add comments table to projects
 * Run with: npm run migrate:latest
 * Rollback with: npm run migrate:rollback
 */

exports.up = function(knex) {
  return knex.schema.createTable('project_comments', function(table) {
    table.increments('id').primary();
    table.integer('project_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.text('comment').notNullable();
    table.boolean('is_approved').defaultTo(false);
    table.timestamps(true, true); // created_at, updated_at
    
    // Foreign key constraints
    table.foreign('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index('project_id');
    table.index('user_id');
    table.index('is_approved');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('project_comments');
};
