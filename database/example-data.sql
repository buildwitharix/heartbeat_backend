USE heartbeat_monitor;

INSERT INTO users (
  uuid,
  full_name,
  email,
  phone,
  password,
  status
) VALUES (
  UUID(),
  'Arix',
  'arix@example.com',
  NULL,
  '$2b$10$replace_with_real_hashed_password',
  'active'
);

SET @arix_user_id = LAST_INSERT_ID();

INSERT INTO devices (
  uuid,
  user_id,
  device_name,
  hostname,
  username,
  operating_system,
  status,
  last_seen
) VALUES
  (
    UUID(),
    @arix_user_id,
    'Office PC',
    'office-pc',
    'arix',
    'Windows',
    'online',
    NOW()
  ),
  (
    UUID(),
    @arix_user_id,
    'Home Laptop',
    'home-laptop',
    'arix',
    'Windows',
    'offline',
    NULL
  ),
  (
    UUID(),
    @arix_user_id,
    'Gaming PC',
    'gaming-pc',
    'arix',
    'Windows',
    'online',
    NOW()
  );

