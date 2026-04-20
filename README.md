# CRM Cloud Platform - Multi-Tenant

A modern, scalable multi-tenant CRM platform built with NestJS, PostgreSQL, and React TypeScript.

## Project Structure

```
crm/
├── backend/          # NestJS Backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React Frontend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── cahier des charges/  # Project Specifications
```

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env.development
npm run dev
```

The backend will run on `http://localhost:3000`

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.development
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Setup

```bash
# Create master database
createdb crm_master_dev

# Run migrations
cd backend
npm run db:migrate
```

## Documentation

- [API Documentation](./backend/docs/) - Coming soon
- [Architecture Guide](./docs/architecture.md) - Coming soon

## Tech Stack

- **Backend**: NestJS, PostgreSQL, TypeORM, JWT, Passport
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, NextUI
- **Auth**: JWT with tenant context
- **Architecture**: Multi-tenant with database per tenant

## Features (Planned)

- ✅ Multi-tenant architecture
- ✅ JWT Authentication with RBAC
- 🔄 Organizations management
- 🔄 Users & Roles management
- 🔄 CRM modules (Accounts, Contacts, Leads, Opportunities, Activities)
- 🔄 Dynamic entities
- 🔄 Dashboards
- 🔄 Admin panel

## License

MIT
