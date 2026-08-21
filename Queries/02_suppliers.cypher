// 1. List all suppliers
MATCH (s:Supplier)
RETURN s
ORDER BY s.name;

// 2. Find products supplied by a supplier
MATCH (s:Supplier {name: $supplierName})-[:SUPPLIES]->(p:Product)
RETURN s, p
ORDER BY p.name;

// 3. Count products supplied by each supplier
MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)
RETURN s.name AS supplier,
       count(p) AS productCount
ORDER BY productCount DESC;