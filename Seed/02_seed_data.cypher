// ================================
// SUPPLIERS
// ================================

MERGE (global:Supplier {name: "Global Foods"})
SET global.email = "contact@globalfoods.com",
    global.phone = "+2348000000000";

MERGE (fresh:Supplier {name: "Fresh Harvest Ltd"})
SET fresh.email = "sales@freshharvest.com",
    fresh.phone = "+2348111111111";


// ================================
// CATEGORIES
// ================================

MERGE (grains:Category {name: "Grains"})
SET grains.description = "Rice, wheat and other grain products";

MERGE (beverages:Category {name: "Beverages"})
SET beverages.description = "Juices and other beverage products";


// ================================
// WAREHOUSES
// ================================

MERGE (lagos:Warehouse {name: "Lagos Central Warehouse"})
SET lagos.location = "Lagos, Nigeria";

MERGE (ph:Warehouse {name: "Port Harcourt Warehouse"})
SET ph.location = "Port Harcourt, Nigeria";


// ================================
// PRODUCTS
// ================================

MERGE (rice:Product {sku: "RICE-101"})
SET rice.name = "Premium Rice",
    rice.price = 80000;

MERGE (wheat:Product {sku: "WHEAT-001"})
SET wheat.name = "Wheat",
    wheat.price = 75000;

MERGE (juice:Product {sku: "JUICE-001"})
SET juice.name = "Mango Juice",
    juice.price = 3500;


// ================================
// PRODUCT RELATIONSHIPS
// ================================

MERGE (global)-[:SUPPLIES]->(rice);
MERGE (global)-[:SUPPLIES]->(wheat);
MERGE (fresh)-[:SUPPLIES]->(juice);

MERGE (rice)-[:BELONGS_TO]->(grains);
MERGE (wheat)-[:BELONGS_TO]->(grains);
MERGE (juice)-[:BELONGS_TO]->(beverages);


// ================================
// INVENTORY
// ================================

MERGE (rice)-[riceStock:STORED_AT]->(lagos)
SET riceStock.quantity = 100,
    riceStock.reorderLevel = 20;

MERGE (wheat)-[wheatStock:STORED_AT]->(ph)
SET wheatStock.quantity = 75,
    wheatStock.reorderLevel = 15;

MERGE (juice)-[juiceStock:STORED_AT]->(lagos)
SET juiceStock.quantity = 200,
    juiceStock.reorderLevel = 50;