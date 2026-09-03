# PROPERTY MANAGEMENT SYSTEM
This is a property management system that allows users to manage properties, tenants, and leases. It provides features for adding, updating, and deleting properties, as well as managing tenant information and lease agreements.

## Features
- Add, update, and delete properties
- Manage tenant information
- Create and manage lease agreements
- Generate reports on properties, tenants, and leases
- User authentication and authorization
- Responsive design for mobile and desktop devices

## Demo Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@r3ntledger.com       | admin123    |
| Manager | manager@r3ntledger.com     | manager123  |
| Tenant  | john@r3ntledger.com        | tenant123   |
| Tenant  | mary@r3ntledger.com        | tenant123   |

## Requirements
- Python 3.x
- SQLite (included) or PostgreSQL

## Backend API

The Django backend lives in `backend/` and uses JWT authentication.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Authentication endpoints are `POST /api/auth/login`, `POST /api/auth/register`,
and `POST /api/auth/refresh`. CRUD endpoints are available under
`/api/users/`, `/api/properties/`, `/api/tenants/`, `/api/leases/`,
`/api/payments/`, `/api/inquiries/`, and `/api/warnings/`.

Login accepts `email` and `password`; successful responses include `access`,
`refresh`, and a serialized `user` object. CRUD requests require the access
token in an `Authorization: Bearer <token>` header.
