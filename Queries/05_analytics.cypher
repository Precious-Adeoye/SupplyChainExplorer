// Products per supplier
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
RETURN s.name AS supplier,
       count(p) AS products
ORDER BY products DESC;


// Inventory value by warehouse
MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse)
RETURN w.name AS warehouse,
       sum(p.price * r.quantity) AS inventoryValue
ORDER BY inventoryValue DESC;


// Low-stock count by warehouse
MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse)
WHERE r.quantity <= r.reorderLevel
RETURN w.name AS warehouse,
       count(p) AS lowStockItems
ORDER BY lowStockItems DESC;