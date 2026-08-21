// Get all products

MATCH (p:Product)
RETURN p
ORDER BY p.name;