# Demo Steps

1) **Setup**
- Ensure MySQL is running and database `order_db` exists.
- Copy `.env.example` → `.env` and update credentials + `CRM_BASE_URL` if needed.
- Install dependencies: `npm install`.
- Sync + seed: `npm run db:sync`.

2) **Start servers**
- CRM mock: `npm run crm` (listens on `http://localhost:4000`).
- API (new terminal): `npm run dev` (listens on `http://localhost:3000`).

3) **Quick walkthrough**
- `GET http://localhost:3000/products` → seeded catalog.
- `POST http://localhost:3000/orders` with sample body to place an order (copies product price to `unit_price`).
- `GET http://localhost:3000/orders/1` → shows order with customer + items + products.
- `GET http://localhost:3000/customers/1/with-crm` → merges local customer with CRM profile (`crm-123`).

4) **What to say in the interview**
- "This is a minimal order management backend on Express with Sequelize + MySQL for persistence. Customers/products/orders are standard CRUD resources with relations. On startup we sync models and seed demo data. There’s also a mock Salesforce-like CRM service; `/customers/:id/with-crm` fetches the local customer and enriches it with the external profile via axios with a 2s timeout. The code is organized by layers: routes → controllers → services → models, keeping DB access and integration logic isolated."
