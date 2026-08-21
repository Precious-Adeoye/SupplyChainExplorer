CREATE CONSTRAINT product_sku_unique IF NOT EXISTS
FOR (p:Product)
REQUIRE p.sku IS UNIQUE;

CREATE CONSTRAINT supplier_name_unique IF NOT EXISTS
FOR (s:Supplier)
REQUIRE s.name IS UNIQUE;

CREATE CONSTRAINT warehouse_name_unique IF NOT EXISTS
FOR (w:Warehouse)
REQUIRE w.name IS UNIQUE;

CREATE CONSTRAINT category_name_unique IF NOT EXISTS
FOR (c:Category)
REQUIRE c.name IS UNIQUE;