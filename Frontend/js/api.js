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