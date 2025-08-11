# Database Migrations Guide

## Overview
Your Node.js server now has Knex.js migrations set up to handle database schema changes automatically. No more manual SQL updates!

## How It Works
- **Migrations** are versioned files that define database changes
- **Knex tracks** which migrations have been applied
- **Team members** run the same migration commands to stay in sync
- **Production deploys** can run migrations automatically

## Common Commands

```bash
# Navigate to server directory
cd server

# Install dependencies (run once)
npm install

# Create a new migration
npm run migrate:make add_new_table

# Run all pending migrations
npm run migrate:latest

# Check migration status
npm run migrate:status

# Rollback last migration (if needed)
npm run migrate:rollback
```

## Creating Migrations

### 1. Create New Migration
```bash
npm run migrate:make add_user_preferences
```
This creates: `migrations/20250811_002_add_user_preferences.js`

### 2. Edit Migration File
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('user_preferences', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('theme').defaultTo('light');
    table.boolean('email_notifications').defaultTo(true);
    table.timestamps(true, true);
    
    table.foreign('user_id').references('id').inTable('users');
    table.index('user_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_preferences');
};
```

### 3. Run Migration
```bash
npm run migrate:latest
```

## Migration Examples

### Add Column to Existing Table
```javascript
exports.up = function(knex) {
  return knex.schema.alterTable('projects', function(table) {
    table.boolean('is_featured').defaultTo(false);
    table.index('is_featured');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('projects', function(table) {
    table.dropColumn('is_featured');
  });
};
```

### Add Foreign Key
```javascript
exports.up = function(knex) {
  return knex.schema.alterTable('projects', function(table) {
    table.integer('category_id').unsigned();
    table.foreign('category_id').references('id').inTable('categories');
  });
};
```

### Create Index
```javascript
exports.up = function(knex) {
  return knex.schema.alterTable('projects', function(table) {
    table.index(['status', 'created_date']);
  });
};
```

## Development Workflow

### Daily Development
1. **Pull latest code**: `git pull`
2. **Run migrations**: `npm run migrate:latest`
3. **Start coding**

### Adding New Features
1. **Create migration**: `npm run migrate:make feature_name`
2. **Write migration code**
3. **Test migration**: `npm run migrate:latest`
4. **Commit both code and migration**

### Team Synchronization
- **Everyone runs**: `npm run migrate:latest` after pulling changes
- **Migrations are version controlled** in Git
- **Database stays in sync** automatically

## Production Deployment

### Option 1: Manual
```bash
npm run migrate:latest
```

### Option 2: Automatic (in deployment script)
Add to your deployment process:
```bash
cd server
npm install
npm run migrate:latest
npm start
```

## Environment Setup

Make sure your `.env` file has:
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
```

## Troubleshooting

### Migration Failed
```bash
# Check what went wrong
npm run migrate:status

# Rollback if needed
npm run migrate:rollback

# Fix migration file and try again
npm run migrate:latest
```

### Reset Database (Development Only)
```bash
# Rollback all migrations
npm run migrate:rollback --all

# Run fresh migrations
npm run migrate:latest
```

## Best Practices

1. **Always write `down` functions** for rollbacks
2. **Test migrations** before committing
3. **Use descriptive names** for migration files
4. **One logical change** per migration
5. **Never edit** existing migration files once committed
6. **Add indexes** for performance on large tables

Your database schema changes are now version controlled and automated! 🎉
