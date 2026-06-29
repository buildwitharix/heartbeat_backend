# User Device Relationship

One user can have multiple devices.

```text
users
-----
id
name
email

  |
  | 1
  |
  v

devices
-------
id
user_id
device_name
hostname
status
last_seen
```

## Example

```text
Arix
|-- Office PC
|-- Home Laptop
`-- Gaming PC
```

## SQL Relationship

`devices.user_id` stores the owner of each device.

```sql
CONSTRAINT devices_user_id_foreign
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
```

When a user is deleted, all devices belonging to that user are deleted automatically.

