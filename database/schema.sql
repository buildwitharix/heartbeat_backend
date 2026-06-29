CREATE DATABASE IF NOT EXISTS heartbeat_monitor;

USE heartbeat_monitor;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid CHAR(36) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(30) NULL,
  password VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMP NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_uuid_unique (uuid),
  UNIQUE KEY users_email_unique (email),
  KEY users_status_index (status)
);

CREATE TABLE IF NOT EXISTS devices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid CHAR(36) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  device_name VARCHAR(150) NOT NULL,
  hostname VARCHAR(150) NULL,
  username VARCHAR(150) NULL,
  operating_system VARCHAR(100) NULL,
  os_version VARCHAR(100) NULL,
  architecture VARCHAR(50) NULL,
  processor VARCHAR(191) NULL,
  cpu_cores INT UNSIGNED NULL,
  total_ram BIGINT UNSIGNED NULL,
  total_disk BIGINT UNSIGNED NULL,
  mac_address VARCHAR(30) NULL,
  local_ip VARCHAR(45) NULL,
  public_ip VARCHAR(45) NULL,
  app_version VARCHAR(50) NULL,
  status ENUM('online', 'offline') NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMP NULL,
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY devices_uuid_unique (uuid),
  KEY devices_user_id_index (user_id),
  KEY devices_status_index (status),
  KEY devices_last_seen_index (last_seen),
  CONSTRAINT devices_user_id_foreign
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
