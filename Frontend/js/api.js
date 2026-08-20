const API_BASE_URL = "https://localhost:7038";

async function getProducts() {
    const response = await fetch(`${API_BASE_URL}/api/Products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return await response.json();
}
async function updateProduct(sku, product) {
    const response = await fetch(
        `${API_BASE_URL}/api/Products/${encodeURIComponent(sku)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error("Update failed:", {
            status: response.status,
            statusText: response.statusText,
            response: errorText
        });

        throw new Error(
            `Failed to update product: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


async function deleteProduct(sku) {
    const response = await fetch(
        `${API_BASE_URL}/api/Products/${encodeURIComponent(sku)}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
}

async function getSuppliers() {
    const response = await fetch(`${API_BASE_URL}/api/Suppliers`);

    if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
    }

    return await response.json();
}

async function getWarehouses() {
    const response = await fetch(`${API_BASE_URL}/api/Warehouses`);

    if (!response.ok) {
        throw new Error("Failed to fetch warehouses");
    }

    return await response.json();
}

async function getInventory() {
    const response = await fetch(`${API_BASE_URL}/api/Inventory`);

    if (!response.ok) {
        throw new Error("Failed to fetch inventory");
    }

    return await response.json();
}

async function createProduct(product) {
    const response = await fetch(
        `${API_BASE_URL}/api/Products`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error("Create failed:", {
            status: response.status,
            response: errorText
        });

        throw new Error(
            `Failed to create product: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}

async function createSupplier(supplier) {
    const response = await fetch(
        `${API_BASE_URL}/api/Suppliers`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(supplier)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to create supplier: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


async function updateSupplier(name, supplier) {
    const response = await fetch(
        `${API_BASE_URL}/api/Suppliers/${encodeURIComponent(name)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(supplier)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update supplier: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


async function deleteSupplier(name) {
    const response = await fetch(
        `${API_BASE_URL}/api/Suppliers/${encodeURIComponent(name)}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to delete supplier: ${response.status} ${errorText}`
        );
    }
}

async function createWarehouse(warehouse) {
    const response = await fetch(
        `${API_BASE_URL}/api/Warehouses`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(warehouse)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to create warehouse: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


async function updateWarehouse(name, warehouse) {
    const response = await fetch(
        `${API_BASE_URL}/api/Warehouses/${encodeURIComponent(name)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(warehouse)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update warehouse: ${response.status} ${errorText}`
        );
    }

    return await response.json();
}


async function deleteWarehouse(name) {
    const response = await fetch(
        `${API_BASE_URL}/api/Warehouses/${encodeURIComponent(name)}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to delete warehouse: ${response.status} ${errorText}`
        );
    }
}