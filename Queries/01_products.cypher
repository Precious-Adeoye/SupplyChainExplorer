// 1. List all products
MATCH (p:Product)
RETURN p
ORDER BY p.name;

// 2. Find a product by SKU
MATCH (p:Product {sku: $sku})
RETURN p;

// 3. Find products supplied by a supplier
MATCH (s:Supplier {name: $supplierName})-[:SUPPLIES]->(p:Product)
RETURN p
ORDER BY p.name;

// 4. Find suppliers for a product
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product {sku: $sku})
RETURN s
ORDER BY s.name;

// 5. Find the category and warehouse for a product
MATCH (p:Product {sku: $sku})
OPTIONAL MATCH (p)-[:BELONGS_TO]->(c:Category)
OPTIONAL MATCH (p)-[:STORED_AT]->(w:Warehouse)
RETURN p, c, w;