// Get inventory across warehouses

MATCH (p:Product)-[r:STORED_AT]->(w:Warehouse)
RETURN
    p.sku AS productSku,
    w.name AS warehouseName,
    r.quantity AS quantity,
    r.reorderLevel AS reorderLevel
ORDER BY w.name, p.sku;