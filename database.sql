-- Database: accounting_erp

DROP DATABASE IF EXISTS accounting_erp;
CREATE DATABASE accounting_erp;
USE accounting_erp;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies Table
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    address TEXT,
    financial_year_start DATE NOT NULL,
    financial_year_end DATE NOT NULL,
    currency_symbol VARCHAR(10) DEFAULT '₹',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Account Groups Table
CREATE TABLE account_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    parent_group VARCHAR(100) NULL, -- self-referencing or simple string for predefined
    category ENUM('Asset', 'Liability', 'Income', 'Expense') NOT NULL,
    is_predefined BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 4. Ledgers Table
CREATE TABLE ledgers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    group_id INT NOT NULL,
    ledger_name VARCHAR(100) NOT NULL,
    opening_balance DECIMAL(15, 2) DEFAULT 0.00,
    opening_balance_type ENUM('Dr', 'Cr') NOT NULL,
    current_balance DECIMAL(15, 2) DEFAULT 0.00, -- Denormalized
    -- Extended Fields
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    pan_number VARCHAR(10),
    gstin VARCHAR(15),
    credit_limit DECIMAL(15, 2) DEFAULT 0.00,
    credit_days INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES account_groups(id) ON DELETE CASCADE
);

-- 5. Vouchers Table (Header)
CREATE TABLE vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    voucher_type ENUM('Payment', 'Receipt', 'Contra', 'Journal') NOT NULL,
    voucher_number VARCHAR(50) NOT NULL,
    voucher_date DATE NOT NULL,
    narration TEXT,
    -- Extended Fields
    reference_no VARCHAR(50),
    reference_date DATE,
    cheque_number VARCHAR(50),
    cheque_date DATE,
    bank_name VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 6. Voucher Entries Table (Details)
CREATE TABLE voucher_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voucher_id INT NOT NULL,
    ledger_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('Dr', 'Cr') NOT NULL,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

-- Sample Data (will be inserted dynamically by PHP logic for specific companies, 
-- but we can insert a dummy user for testing)

-- Insert Dummy User (password: admin123)
-- Hash: $2y$10$8.1p... (standard bcrypt)
-- Using a simple hash for 'admin123' generated via password_hash()
INSERT INTO users (username, password, full_name) VALUES 
('admin', '$2y$10$e.4/..adminhashplaceholder...', 'System Admin');
-- Note: The actual hash will be generated in register.php
