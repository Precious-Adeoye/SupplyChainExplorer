# SupplyChain Explorer

A graph-powered supply chain management and exploration application built with **ASP.NET Core, C#, HTML, CSS, JavaScript, and CognoDB**.

SupplyChain Explorer models the relationships between suppliers, products, categories, warehouses, and inventory as a connected graph, allowing users to manage supply-chain data and explore relationships between entities.

---

## 1. Overview

Supply chains contain many interconnected entities. A single product can:

* Be supplied by one or more suppliers
* Belong to a category
* Be stored in one or more warehouses
* Have different inventory levels
* Require replenishment when stock reaches a reorder level

SupplyChain Explorer provides a simple interface for managing and exploring these relationships.

The application provides:

* Product management
* Supplier management
* Warehouse management
* Inventory monitoring
* Low-stock identification
* Supply-chain relationship queries
* Graph-based multi-hop traversal

---

## 2. Real-World Use Case

The application represents a simplified supply-chain management system.

For example:

```text
Supplier
   |
   | SUPPLIES
   v
Product
   |
   | BELONGS_TO
   v
Category

Product
   |
   | STORED_AT
   v
Warehouse
```

This allows a user to answer questions such as:

* Which products does a supplier provide?
* Which category does a product belong to?
* Where is a product stored?
* Which products are running low on stock?
* Which suppliers are connected to products stored in a particular warehouse?
* What supply-chain path connects a supplier to a warehouse?

---

# 3. Why a Graph Database?

A supply chain is fundamentally relationship-driven.

A traditional relational database can represent these relationships using multiple tables and foreign keys. However, as the number of relationships increases, queries involving multiple connected entities can require increasingly complex joins.

A graph database represents entities as **nodes** and relationships as **edges**, making relationship traversal a natural operation.

For SupplyChain Explorer, the main graph structure is:

```text
(Supplier)-[:SUPPLIES]->(Product)
(Product)-[:BELONGS_TO]->(Category)
(Product)-[:STORED_AT]->(Warehouse)
```

Inventory information is stored directly on the `STORED_AT` relationship:

```text
STORED_AT
├── quantity
└── reorderLevel
```

This makes it possible to perform multi-hop queries such as:

```cypher
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
      -[:STORED_AT]->(w:Warehouse)
RETURN s.name AS supplier,
       p.name AS product,
       w.name AS warehouse;
```

The graph model therefore makes it straightforward to move through the supply-chain network and discover connected information.

---

# 4. Technology Stack

## Backend

* C#
* .NET 10
* ASP.NET Core Web API
* Neo4j .NET Driver
* Dependency Injection
* Service-layer architecture

## Database

* CognoDB
* openCypher
* Bolt protocol

## Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

## Development Tools

* Visual Studio
* VS Code
* Git
* GitHub
* Swagger/OpenAPI

---

# 5. Architecture

The application follows a layered backend architecture.

```text
                    Frontend
              HTML / CSS / JavaScript
                       |
                       | HTTP
                       v
              ASP.NET Core Web API
                       |
                       v
                  Controllers
                       |
                       v
                   Interfaces
                       |
                       v
                    Services
                       |
                       v
                Neo4j .NET Driver
                       |
                       | Bolt
                       v
                    CognoDB
```

The backend separates HTTP/API responsibilities from business logic and database access.

### Controllers

Controllers expose the REST API endpoints.

Examples:

* `ProductsController`
* `SuppliersController`
* `WarehousesController`
* `InventoryController`

### Interfaces

Interfaces define the service contracts.

Examples:

* `IProductService`
* `ISupplierService`
* `IWarehouseService`
* `IInventoryService`

### Services

Services contain the application logic and execute the relevant Cypher queries through the Neo4j driver.

Examples:

* `ProductService`
* `SupplierService`
* `WarehouseService`
* `InventoryService`

### DTOs

DTOs define the data exchanged between the API and clients.

---

# 6. Data Model

## Nodes

The application uses the following primary node types:

### Product

Represents a product in the supply chain.

Example properties:

```text
name
sku
price
```

### Supplier

Represents a supplier.

Example properties:

```text
name
email
phone
```

### Category

Represents a product category.

Example properties:

```text
name
description
```

### Warehouse

Represents a physical storage location.

Example properties:

```text
name
location
```

## Relationships

### SUPPLIES

Connects a supplier to a product.

```text
(Supplier)-[:SUPPLIES]->(Product)
```

### BELONGS_TO

Connects a product to a category.

```text
(Product)-[:BELONGS_TO]->(Category)
```

### STORED_AT

Connects a product to a warehouse.

```text
(Product)-[:STORED_AT]->(Warehouse)
```

The relationship contains:

```text
quantity
reorderLevel
```

## Data Model Diagram

```text
                         ┌──────────────┐
                         │   Supplier   │
                         └──────┬───────┘
                                │
                             SUPPLIES
                                │
                                ▼
                         ┌──────────────┐
                         │   Product    │
                         │              │
                         │ name         │
                         │ sku          │
                         │ price        │
                         └───┬──────┬───┘
                             │      │
                    BELONGS_TO      │ STORED_AT
                             │      │
                             ▼      ▼
                      ┌──────────┐ ┌─────────────┐
                      │ Category │ │  Warehouse  │
                      └──────────┘ │             │
                                   │ name        │
                                   │ location    │
                                   └─────────────┘

                    STORED_AT relationship
                    ├── quantity
                    └── reorderLevel
```

---

# 7. Project Structure

```text
SupplyChainExplorer/
│
├── .github/
│
├── Backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Dtos/
│   ├── Interfaces/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   └── Backend.csproj
│
├── Frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       └── app.js
│
├── Queries/
│   ├── 01_products.cypher
│   ├── 02_suppliers.cypher
│   ├── 03_inventory.cypher
│   ├── 04_supply_chain_traversal.cypher
│   └── 05_analytics.cypher
│
├── Seed/
│   ├── 01_constraints.cypher
│   └── 02_seed_data.cypher
│
└── README.md
```

---

# 8. Frontend

The frontend is a static HTML/CSS/JavaScript application.

The dashboard provides access to:

* Dashboard
* Products
* Suppliers
* Warehouses
* Inventory

The interface includes:

* Loading states
* Empty states
* Error handling
* Search functionality
* Refresh controls
* Product creation
* Product editing
* Product deletion
* Inventory status information
* Confirmation dialogs
* Toast notifications

The frontend communicates with the ASP.NET Core API using the browser Fetch API.

---

# 9. API Endpoints

## Products

### Get all products

```http
GET /api/Products
```

### Create a product

```http
POST /api/Products
```

### Update a product

```http
PUT /api/Products/{sku}
```

### Delete a product

```http
DELETE /api/Products/{sku}
```

---

## Suppliers

### Get all suppliers

```http
GET /api/Suppliers
```

### Create a supplier

```http
POST /api/Suppliers
```

---

## Warehouses

### Get all warehouses

```http
GET /api/Warehouses
```

### Create a warehouse

```http
POST /api/Warehouses
```

---

## Inventory

### Get inventory

```http
GET /api/Inventory
```

### Create inventory

```http
POST /api/Inventory
```

---

# 10. CognoDB Setup

The application requires a CognoDB instance.

Create a CognoDB database instance and obtain the following credentials:

```text
COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD
```

These values are supplied to the backend through environment variables.

## Local Development

Create a `.env` file inside the `Backend` directory:

```text
COGNODB_URI=your-cognodb-uri
COGNODB_USERNAME=your-username
COGNODB_PASSWORD=your-password
```

Do not commit `.env` to GitHub.

The application reads these values during startup.

---

# 11. Database Constraints and Seed Data

The `Seed` directory contains scripts for preparing a fresh database.

Run:

```text
Seed/01_constraints.cypher
```

first.

This creates uniqueness constraints for important graph entities.

Then run:

```text
Seed/02_seed_data.cypher
```

This creates the initial supply-chain data and relationships.

The seed script uses `MERGE` where appropriate so that the database can be initialized without unnecessarily creating duplicate nodes.

---

# 12. Running the Backend Locally

Navigate to the backend:

```bash
cd Backend
```

Restore dependencies:

```bash
dotnet restore
```

Run the application:

```bash
dotnet run
```

The API will start on the configured local port.

Swagger/OpenAPI is available during development for testing the endpoints.

---

# 13. Publishing the Backend

The backend can be published using:

```bash
dotnet publish -c Release -o publish
```

The generated application can then be started with:

```bash
cd publish
dotnet Backend.dll
```



---

# 14. Render Deployment

The backend is intended to be hosted using a free render hosting tier.

The following environment variables must be configured in PXXL:

```text
COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD
```

The actual credential values are not stored in the GitHub repository.

After deployment, the hosted backend URL should be added below:

```text
Backend API:
TODO - ADD PXXL BACKEND URL
```

---

# 15. Main Cypher Queries

The `Queries` directory contains reusable Cypher queries demonstrating the graph capabilities of the application.

## Products

`Queries/01_products.cypher`

Includes queries for:

* Listing products
* Finding products by SKU
* Finding products supplied by a supplier
* Finding suppliers for a product
* Finding product category and warehouse relationships

## Suppliers

`Queries/02_suppliers.cypher`

Includes queries for:

* Listing suppliers
* Finding products supplied by a supplier
* Counting products per supplier

## Inventory

`Queries/03_inventory.cypher`

Includes queries for:

* Listing inventory
* Finding low-stock products
* Finding inventory within a warehouse

## Supply-Chain Traversal

`Queries/04_supply_chain_traversal.cypher`

Contains multi-hop graph traversal queries.

Example:

```cypher
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
      -[:STORED_AT]->(w:Warehouse)
RETURN s.name AS supplier,
       p.name AS product,
       p.sku AS sku,
       w.name AS warehouse;
```

This demonstrates how the graph can traverse:

```text
Supplier → Product → Warehouse
```

## Analytics

`Queries/05_analytics.cypher`

Contains analytical queries such as:

* Products per supplier
* Inventory value by warehouse
* Low-stock count by warehouse

---

# 16. Example Graph Traversal

A key capability of the application is following relationships through multiple nodes.

For example:

```text
Global Foods
     │
     │ SUPPLIES
     ▼
Premium Rice
     │
     │ STORED_AT
     ▼
Lagos Central Warehouse
```

This relationship can be queried directly using Cypher:

```cypher
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
      -[:STORED_AT]->(w:Warehouse)
WHERE s.name = $supplierName
RETURN s.name AS supplier,
       p.name AS product,
       w.name AS warehouse;
```

This is one of the main reasons a graph database is appropriate for the project.

---

# 17. Error Handling

The application includes handling for common application states.

### Frontend

The frontend handles:

* API loading states
* Empty datasets
* Failed API requests
* Form validation
* Failed create/update/delete operations
* User confirmation before destructive actions

### Backend

The backend uses:

* ASP.NET Core controller responses
* DTO validation
* Service-layer separation
* Parameterized Cypher queries
* Database connection configuration through environment variables

---

# 18. Security and Configuration

Sensitive configuration values are not stored directly in source code.

The following values must never be committed to the public repository:

```text
COGNODB_PASSWORD
COGNODB_USERNAME
private database connection strings
.env
```

The `.gitignore` should exclude:

```text
.env
*.env
bin/
obj/
.vs/
publish/
```

Production credentials should be configured through PXXL environment variables.

---

# 19. Screenshots



```text
screenshots/
├── dashboard.png
├── products.png
├── suppliers.png
├── warehouses.png
└── inventory.png
```

### Dashboard

![Dashboard]([screenshots/dashboard.png](https://github.com/Precious-Adeoye/SupplyChainExplorer/blob/main/Dashboard.png))

### Products

![Products]([screenshots/products.png](https://github.com/Precious-Adeoye/SupplyChainExplorer/blob/main/Products.png))

### Suppliers

![Suppliers]([screenshots/suppliers.png](https://github.com/Precious-Adeoye/SupplyChainExplorer/blob/main/Suppliers.png))

### Warehouses

![Warehouses]([screenshots/warehouses.png](https://github.com/Precious-Adeoye/SupplyChainExplorer/blob/main/Warehouse.png))

### Inventory

![Inventory]([screenshots/inventory.png](https://github.com/Precious-Adeoye/SupplyChainExplorer/blob/main/Inventory.png))

---

# 20. Hosted Application Demo

[**Live Application:**](https://supply-chain-explorer-h2rp.vercel.app/)


**Backend API:**

> [BACKEND URL](https://supplychainexplorer.onrender.com/)

The hosted application demonstrates the working supply-chain management interface and its connection to the deployed ASP.NET Core backend and CognoDB database.

---

# 21. Screen Recording

A short screen recording demonstrates the main functionality of the application.

The recording should show:

1. Opening the hosted application
2. Dashboard overview
3. Viewing products
4. Creating or editing a product
5. Viewing suppliers
6. Viewing warehouses
7. Viewing inventory
8. Demonstrating low-stock information
9. Showing the relationship between supply-chain entities

**Screen Recording:**

> TODO — ADD SCREEN RECORDING LINK

---

# 22. GitHub Repository

[**Repository:**](https://github.com/Precious-Adeoye/SupplyChainExplorer)

The repository contains:

* Complete backend source code
* Complete frontend source code
* Cypher queries
* Database seed scripts
* README documentation
* Project configuration

Credentials and other sensitive environment values are excluded from the repository.

---

# 23. Future Improvements

Potential future improvements include:

* Interactive graph visualization
* Authentication and authorization
* Advanced supply-chain path exploration
* Supplier performance analytics
* Real-time inventory updates
* Automated inventory alerts
* Advanced reporting
* More detailed warehouse and supplier management

---

# 24. Submission Checklist

Before submitting the project, verify the following:

* [x] Backend source code included
* [x] Frontend source code included
* [x] Cypher query files included
* [x] Seed scripts included
* [x] Graph data model documented
* [x] Why a graph database is documented
* [x] Setup instructions included
* [x] CognoDB configuration documented
* [x] API endpoints documented
* [x] Main queries explained
* [x] Final screenshots added
* [x] GitHub repository URL added
* [x] Render hosted application URL added
* [x] Backend deployment URL added
* [x] Screen recording completed
* [x] Screen recording link added
* [x] No credentials committed to GitHub
* [x] Final application tested using the hosted deployment

---

# 25. License

This project was created as a technical portfolio and supply-chain graph database demonstration.
