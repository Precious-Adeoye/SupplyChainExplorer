// Get suppliers and the products they supply

MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
RETURN
    s.name AS supplier,
    p.name AS product,
    p.sku AS sku
ORDER BY s.name, p.name;