// 1. List inventory
MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse)
RETURN p.sku AS productSku,
       p.name AS product,
       w.name AS warehouse,
       r.quantity AS quantity,
       r.reorderLevel AS reorderLevel
ORDER BY p.name;

// 2. Find low-stock products
MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse)
WHERE r.quantity <= r.reorderLevel
RETURN p.sku AS productSku,
       p.name AS product,
       w.name AS warehouse,
       r.quantity AS quantity,
       r.reorderLevel AS reorderLevel
ORDER BY r.quantity;

// 3. Find inventory in a warehouse
MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse {name: $warehouseName})
RETURN p, r, w
ORDER BY p.name;