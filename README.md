# Order Management Demo (Node.js + Express + MySQL)

A compact backend demo for interview walk-throughs showing a clean Express architecture, Sequelize + MySQL persistence, and an external CRM integration.

## Project Structure
```
/ src
  / config       # DB connection + model sync/seed
  / controllers  # Express controllers
  / models       # Sequelize models
  / routes       # Express routers
  / services     # Business logic + CRM client
  server.js      # App bootstrap
/ crm-mock       # Mock Salesforce-like CRM
.env.example
README.md
DEMO_STEPS.md
```

## Prerequisites
- Node.js (latest LTS)
- MySQL running locally

Create the database:
```sql
CREATE DATABASE order_db;
```

## Environment
1. Copy `.env.example` to `.env` and fill in your values:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=order_db
CRM_BASE_URL=http://localhost:4000
PORT=3000
```

## Install & Run
```bash
npm install
# sync models and seed demo data
npm run db:sync
# start CRM mock server
npm run crm
# in a separate terminal, start main API
npm run dev
```

## Example Requests
- List products: `GET http://localhost:3000/products`
- Create an order:
```http
POST http://localhost:3000/orders
Content-Type: application/json
{
  "customerId": 1,
  "items": [
    { "productId": 1, "quantity": 1 },
    { "productId": 2, "quantity": 2 }
  ]
}
```
- Fetch order with items: `GET http://localhost:3000/orders/1`
- Merge local + CRM profile: `GET http://localhost:3000/customers/1/with-crm`

## Interview Talking Points
- CRUD for customers/products/orders with Sequelize models and explicit associations.
- MySQL persistence configured via environment variables and initialized in `src/config/db.js` (sync + seed).
- External CRM integration implemented in `src/services/crmService.js` and exposed via `/customers/:id/with-crm`.
- Layered structure (routes → controllers → services → models) keeps concerns separated and testable.
