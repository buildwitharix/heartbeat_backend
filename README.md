# Heartbeat Backend

Express backend for receiving device heartbeats, tracking device status, and sending offline alerts.

## Setup

```bash
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Database Tables

MySQL table schema is available at `database/schema.sql`.

```bash
mysql -u root -p < database/schema.sql
```

Relationship flow and sample data are available here:

- `database/relationship.md`
- `database/example-data.sql`

```bash
mysql -u root -p < database/example-data.sql
```

## Endpoints

- `GET /health` - API health check
- `POST /api/users/register` - Register user
- `GET /api/users/:userId` - Get user details with devices
- `POST /api/devices` - Store/register a device
- `GET /api/devices` - List devices
- `GET /api/devices/:deviceId` - Get one device
- `POST /api/heartbeats` - Update device heartbeat and system status
- `GET /api/alerts` - List alerts
- `POST /api/alerts/test-email` - Send a test alert email

## Example APIs

Register user:

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Arix\",\"email\":\"arix@example.com\",\"password\":\"secret123\"}"
```

Get user details:

```bash
curl http://localhost:5000/api/users/USER_ID_OR_UUID
```

Store device:

```bash
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"USER_ID_OR_UUID\",\"device_name\":\"Office PC\",\"hostname\":\"office-pc\",\"username\":\"arix\",\"operating_system\":\"Windows\",\"status\":\"online\"}"
```

Heartbeat:

```bash
curl -X POST http://localhost:5000/api/heartbeats \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"DEVICE_ID_OR_UUID\",\"status\":\"online\",\"system_status\":{\"cpu_cores\":8,\"total_ram\":17179869184,\"total_disk\":512000000000,\"local_ip\":\"192.168.1.10\"}}"
```
# heartbeat_backend
