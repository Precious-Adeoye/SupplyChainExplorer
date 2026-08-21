// Supplier -> Product -> Warehouse
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
      -[:STORED_AT]->(w:Warehouse)
RETURN s.name AS supplier,
       p.name AS product,
       p.sku AS sku,
       w.name AS warehouse
ORDER BY s.name, p.name;


// Supplier -> Product -> Warehouse -> Customer
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
      -[:STORED_AT]->(w:Warehouse)
      -[:SERVES]->(c:Customer)
RETURN s.name AS supplier,
       p.name AS product,
       w.name AS warehouse,
       c.name AS customer
ORDER BY s.name, c.name;


// Find everything reachable from a supplier
MATCH (s:Supplier {name: $supplierName})
      -[:SUPPLIES]->(p:Product)
      -[:STORED_AT]->(w:Warehouse)
RETURN s.name AS supplier,
       p.name AS product,
       p.sku AS sku,
       w.name AS warehouse
ORDER BY p.name;