// Count products supplied by each supplier

MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
RETURN
    s.name AS supplier,
    count(p) AS productCount
ORDER BY productCount DESC;


// Find products at or below their reorder level

MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse)
WHERE r.quantity <= r.reorderLevel
RETURN
    p.sku AS productSku,
    p.name AS product,
    w.name AS warehouse,
    r.quantity AS quantity,
    r.reorderLevel AS reorderLevel
ORDER BY r.quantity ASC;