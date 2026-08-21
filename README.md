# SupplyChain Explorer

Graph-powered supply-chain management and exploration application.

## Stack
- ASP.NET Core / .NET 9
- C#
- CognoDB
- Neo4j.Driver
- openCypher / Bolt
- HTML, CSS, JavaScript

## Features
- Product CRUD
- Supplier CRUD
- Warehouse CRUD
- Inventory monitoring
- Search and filtering
- Dashboard statistics
- Low-stock detection
- Graph relationships between supply-chain entities
- Parameterized Cypher queries
- Loading, empty and error states

## Environment

Create `Backend/.env` locally:

COGNODB_URI=your-bolt-uri
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password

Never commit `.env`.

## Run

Backend:

```bash
cd Backend
dotnet restore
dotnet run
```

Frontend:

Open `Frontend/index.html` through a local static server.

## Graph model

Supplier -[:SUPPLIES]-> Product
Product -[:BELONGS_TO]-> Category
Product -[:STORED_AT]-> Warehouse
Warehouse -[:SERVES]-> Customer
Supplier -[:LOCATED_IN]-> Country

## Deployment

Deploy the ASP.NET API to a .NET-compatible host and configure:
COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD

Deploy the static Frontend folder to a static host.

After backend deployment, change `API_BASE_URL` in `Frontend/js/api.js` from the local HTTPS URL to the deployed API URL.
