// Trace products through the supply chain

MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
OPTIONAL MATCH (p)-[:BELONGS_TO]->(c:Category)
OPTIONAL MATCH (p)-[r:STORED_AT]->(w:Warehouse)

RETURN
    s.name AS supplier,
    p.name AS product,
    p.sku AS sku,
    c.name AS category,
    w.name AS warehouse,
    r.quantity AS quantity,
    r.reorderLevel AS reorderLevel
ORDER BY s.name, p.name;