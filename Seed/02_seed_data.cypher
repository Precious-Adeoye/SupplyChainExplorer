// =========================
// SUPPLIERS
// =========================

MERGE (s1:Supplier {name: "Global Foods"})
SET s1.email = "contact@globalfoods.com",
    s1.phone = "+2348000000000"

MERGE (s2:Supplier {name: "Fresh Harvest Ltd"})
SET s2.email = "hello@freshharvest.com",
    s2.phone = "+2348111111111"


// =========================
// CATEGORIES
// =========================

MERGE (c1:Category {name: "Grains"})
SET c1.description = "Rice, wheat and other grain products"

MERGE (c2:Category {name: "Beverages"})
SET c2.description = "Drinks and beverage products"


// =========================
// WAREHOUSES
// =========================

MERGE (w1:Warehouse {name: "Lagos Central Warehouse"})
SET w1.location = "Lagos, Nigeria"

MERGE (w2:Warehouse {name: "Port Harcourt Warehouse"})
SET w2.location = "Port Harcourt, Nigeria"


// =========================
// PRODUCTS
// =========================

MERGE (p1:Product {sku: "RICE-001"})
SET p1.name = "Premium Rice",
    p1.price = 55000

MERGE (p2:Product {sku: "DRINK-001"})
SET p2.name = "Mango Juice",
    p2.price = 3500


// =========================
// SUPPLIES
// =========================

MERGE (s1)-[:SUPPLIES]->(p1)
MERGE (s2)-[:SUPPLIES]->(p2)


// =========================
// CATEGORIES
// =========================

MERGE (p1)-[:BELONGS_TO]->(c1)
MERGE (p2)-[:BELONGS_TO]->(c2)


// =========================
// INVENTORY
// =========================

MERGE (p1)-[i1:STORED_AT]->(w1)
SET i1.quantity = 100,
    i1.reorderLevel = 20

MERGE (p2)-[i2:STORED_AT]->(w2)
SET i2.quantity = 15,
    i2.reorderLevel = 25