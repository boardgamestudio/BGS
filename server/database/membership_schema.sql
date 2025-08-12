-- Membership Management System Extensions
-- Additional tables for comprehensive membership management

-- Add authentication and membership fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_role ENUM('admin', 'moderator', 'member', 'guest') DEFAULT 'member';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_tier ENUM('free', 'basic', 'premium', 'pro') DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

-- Create User Sessions table for secure session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Membership Plans table
CREATE TABLE IF NOT EXISTS membership_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_period ENUM('monthly', 'yearly', 'lifetime') NOT NULL,
    features JSON,
    max_projects INT,
    max_job_posts INT,
    max_events INT,
    priority_support BOOLEAN DEFAULT FALSE,
    featured_listings BOOLEAN DEFAULT FALSE,
    analytics_access BOOLEAN DEFAULT FALSE,
    stripe_price_id VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create User Subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    stripe_subscription_id VARCHAR(255),
    status ENUM('active', 'inactive', 'cancelled', 'past_due', 'trialing') DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    trial_end TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_plan_id (plan_id),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(plan_id) ON DELETE CASCADE
);

-- Create User Activity Log table
CREATE TABLE IF NOT EXISTS user_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_date (created_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Admin Settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50),
    description TEXT,
    updated_by INT,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Email Templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_text TEXT,
    body_html TEXT,
    variables JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default membership plans
INSERT INTO membership_plans (name, description, price, billing_period, features, max_projects, max_job_posts, max_events) VALUES
('Free', 'Basic access to Board Game Studio', 0.00, 'monthly', '["Community access", "Basic project listing", "Forum participation"]', 1, 1, 1),
('Basic', 'Enhanced features for active members', 9.99, 'monthly', '["Everything in Free", "Priority support", "Up to 5 projects", "Advanced analytics"]', 5, 3, 3),
('Premium', 'Professional tools for serious designers', 29.99, 'monthly', '["Everything in Basic", "Unlimited projects", "Featured listings", "Custom profile", "Direct publisher contact"]', -1, 10, 10),
('Pro', 'Complete access for industry professionals', 99.99, 'monthly', '["Everything in Premium", "White-label options", "API access", "Custom integrations", "Dedicated support"]', -1, -1, -1);

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'Board Game Studio', 'string', 'general', 'Website name displayed in header'),
('site_description', 'Professional community for board game designers and publishers', 'string', 'general', 'Site description for SEO'),
('registration_enabled', 'true', 'boolean', 'users', 'Allow new user registrations'),
('email_verification_required', 'true', 'boolean', 'users', 'Require email verification for new accounts'),
('max_login_attempts', '5', 'number', 'security', 'Maximum login attempts before lockout'),
('session_timeout_hours', '24', 'number', 'security', 'Hours before session expires'),
('maintenance_mode', 'false', 'boolean', 'general', 'Enable maintenance mode');

-- Insert default email templates
INSERT INTO email_templates (template_key, subject, body_text, body_html, variables) VALUES
('welcome', 'Welcome to Board Game Studio!', 
    'Hi {{name}},\n\nWelcome to Board Game Studio! Your account has been created successfully.\n\nBest regards,\nThe BGS Team',
    '<h1>Welcome to Board Game Studio!</h1><p>Hi {{name}},</p><p>Welcome to Board Game Studio! Your account has been created successfully.</p><p>Best regards,<br>The BGS Team</p>',
    '["name", "email"]'
),
('email_verification', 'Verify your Board Game Studio account',
    'Hi {{name}},\n\nPlease verify your email address by clicking this link: {{verification_link}}\n\nBest regards,\nThe BGS Team',
    '<h1>Verify Your Account</h1><p>Hi {{name}},</p><p>Please verify your email address by clicking this link: <a href="{{verification_link}}">Verify Email</a></p><p>Best regards,<br>The BGS Team</p>',
    '["name", "email", "verification_link"]'
),
('password_reset', 'Reset your Board Game Studio password',
    'Hi {{name}},\n\nClick this link to reset your password: {{reset_link}}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe BGS Team',
    '<h1>Password Reset</h1><p>Hi {{name}},</p><p>Click this link to reset your password: <a href="{{reset_link}}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p><p>Best regards,<br>The BGS Team</p>',
    '["name", "email", "reset_link"]'
);
