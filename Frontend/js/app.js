/* =========================================================
   SUPPLY CHAIN EXPLORER
   Main Frontend Application
========================================================= */


/* =========================================================
   STATE
========================================================= */

const state = {

    products: [],

    suppliers: [],

    warehouses: [],

    inventory: [],

    editingProductSku: null,

    deletingProductSku: null

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast = $("#toast");
    const toastMessage = $("#toast-message");

    toastMessage.textContent = message;

    toast.classList.remove("hidden");

    setTimeout(() => {

        toast.classList.add("hidden");

    }, 3000);
}


/* =========================================================
   ERROR HANDLING
========================================================= */

function showTableError(elementId, columns, message) {

    const table = document.getElementById(elementId);

    table.innerHTML = `
        <tr>
            <td colspan="${columns}" class="error-state">
                ${message}
            </td>
        </tr>
    `;
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
    document.querySelectorAll("[data-section]").forEach(button => {
        button.addEventListener("click", () => {
            const section = button.dataset.section;
            if (!section) return;

            document.querySelectorAll(".nav-item").forEach(item => {
                item.classList.toggle(
                    "active",
                    item.dataset.section === section
                );
            });

            document.querySelectorAll(".page-section").forEach(item => {
                item.classList.toggle(
                    "active-section",
                    item.id === section
                );
            });
        });
    });
}


function navigateTo(sectionName) {

    $$(".nav-item").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === sectionName
        );

    });


    $$(".page-section").forEach(section => {

        section.classList.toggle(
            "active-section",
            section.id === sectionName
        );

    });


    if (sectionName === "dashboard") {

        loadDashboard();

    }

    if (sectionName === "products") {

        loadProductsTable();

    }

    if (sectionName === "suppliers") {

        loadSuppliersTable();

    }

    if (sectionName === "warehouses") {

        loadWarehousesTable();

    }

    if (sectionName === "inventory") {

        loadInventoryTable();

    }

}


/* =========================================================
   CONNECTION STATUS
========================================================= */

async function checkConnection() {

    const status = $("#connection-status");

    try {

        await getProducts();

        status.textContent = "Connected";

    } catch (error) {

        console.error(
            "Backend connection failed:",
            error
        );

        status.textContent = "Offline";

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const [
            products,
            suppliers,
            warehouses,
            inventory
        ] = await Promise.all([

            getProducts(),

            getSuppliers(),

            getWarehouses(),

            getInventory()

        ]);


        state.products = products;

        state.suppliers = suppliers;

        state.warehouses = warehouses;

        state.inventory = inventory;


        $("#product-count").textContent =
            products.length;

        $("#supplier-count").textContent =
            suppliers.length;

        $("#warehouse-count").textContent =
            warehouses.length;

        $("#inventory-count").textContent =
            inventory.length;


        renderDashboardProducts(products);

        renderLowStock(inventory);

        updateInventorySummary(inventory);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


/* =========================================================
   DASHBOARD PRODUCTS
========================================================= */

function renderDashboardProducts(products) {

    const table = $("#product-table");

    if (!products || products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    No products found.
                </td>
            </tr>
        `;

        return;

    }


    const displayedProducts =
        products.slice(0, 6);


    table.innerHTML =
        displayedProducts.map(product => `

            <tr>

                <td>
                    <strong>
                        ${escapeHtml(product.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(product.sku)}
                </td>

                <td>
                    ₦${formatNumber(product.price)}
                </td>

            </tr>

        `).join("");

}


/* =========================================================
   LOW STOCK
========================================================= */

function renderLowStock(inventory) {

    const container = $("#low-stock-list");

    const lowStockItems = inventory.filter(item => {

        const quantity =
            Number(item.quantity ?? 0);

        const reorderLevel =
            Number(item.reorderLevel ?? 0);

        return quantity <= reorderLevel;

    });


    if (lowStockItems.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                ✓ All inventory levels are healthy.
            </div>
        `;

        return;

    }


    container.innerHTML =
        lowStockItems.slice(0, 6).map(item => {

            const quantity =
                Number(item.quantity ?? 0);

            const reorderLevel =
                Number(item.reorderLevel ?? 0);


            return `

                <div class="low-stock-item">

                    <div>

                        <div class="low-stock-name">
                            ${escapeHtml(item.productSku)}
                        </div>

                        <div class="low-stock-info">
                            ${escapeHtml(item.warehouseName)}
                            · ${quantity} units
                        </div>

                    </div>

                    <span class="status-badge status-low">
                        Low Stock
                    </span>

                </div>

            `;

        }).join("");

}


/* =========================================================
   PRODUCT TABLE
========================================================= */

async function loadProductsTable() {

    try {

        const products = await getProducts();

        state.products = products;

        renderProductsTable(products);

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        showTableError(
            "products-table",
            4,
            "Unable to load products."
        );

    }

}


function renderProductsTable(products) {

    const table = $("#products-table");

    if (!products || products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No products found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        products.map(product => `

            <tr>

                <td>
                    <strong>
                        ${escapeHtml(product.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(product.sku)}
                </td>

                <td>
                    ₦${formatNumber(product.price)}
                </td>

                <td>

                    <button
                        class="action-btn"
                        data-product-action="edit"
                        data-sku="${escapeHtml(product.sku)}">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-product-action="delete"
                        data-sku="${escapeHtml(product.sku)}">
                        Delete
                    </button>

                </td>

            </tr>

        `).join("");

}


/* =========================================================
   PRODUCT SEARCH
========================================================= */

function setupProductSearch() {

    $("#product-search").addEventListener(
        "input",
        event => {

            const search =
                event.target.value
                    .toLowerCase()
                    .trim();


            const filtered =
                state.products.filter(product => {

                    return (

                        String(product.name)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(product.sku)
                            .toLowerCase()
                            .includes(search)

                    );

                });


            renderProductsTable(filtered);

        }
    );

}


/* =========================================================
   PRODUCT ACTIONS
========================================================= */

function setupProductActions() {

    $("#products-table").addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");

            if (!button) {

                return;

            }


            const action =
                button.dataset.productAction;

            const sku =
                button.dataset.sku;


            if (action === "edit") {

                openEditProductModal(sku);

            }


            if (action === "delete") {

                openDeleteProductModal(sku);

            }

        }
    );

}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openCreateProductModal() {

    state.editingProductSku = null;


    $("#product-modal-title").textContent =
        "Add Product";


    $("#save-product-btn").textContent =
        "Save Product";


    $("#product-form").reset();


    $("#product-sku").disabled = false;


    $("#create-product-extra-fields")
        .classList.remove("hidden");


    $("#product-form-error")
        .classList.add("hidden");


    $("#product-modal")
        .classList.remove("hidden");

}


function openEditProductModal(sku) {

    const product =
        state.products.find(
            item => item.sku === sku
        );


    if (!product) {

        showToast("Product not found.");

        return;

    }


    state.editingProductSku = sku;


    $("#product-modal-title").textContent =
        "Edit Product";


    $("#save-product-btn").textContent =
        "Update Product";


    $("#product-name").value =
        product.name ?? "";


    $("#product-sku").value =
        product.sku ?? "";


    $("#product-price").value =
        product.price ?? "";


    $("#product-sku").disabled = true;


    /*
       Supplier/category/warehouse fields are only
       required when creating a product.
    */

    $("#create-product-extra-fields")
        .classList.add("hidden");


    $("#product-form-error")
        .classList.add("hidden");


    $("#product-modal")
        .classList.remove("hidden");

}


function closeProductModal() {

    $("#product-modal")
        .classList.add("hidden");

    $("#product-form").reset();

    $("#product-sku").disabled = false;

    state.editingProductSku = null;

}


/* =========================================================
   SAVE PRODUCT
========================================================= */

async function saveProduct(event) {

    event.preventDefault();


    const errorBox =
        $("#product-form-error");


    errorBox.classList.add("hidden");


    const name =
        $("#product-name").value.trim();


    const sku =
        $("#product-sku").value.trim();


    const price =
        Number($("#product-price").value);


    if (!name) {

        showFormError(
            "Product name is required."
        );

        return;

    }


    if (!sku) {

        showFormError(
            "Product SKU is required."
        );

        return;

    }


    if (!price || price <= 0) {

        showFormError(
            "Price must be greater than zero."
        );

        return;

    }


    const button =
        $("#save-product-btn");


    button.disabled = true;

    button.textContent = "Saving...";


    try {

        /*
           EDIT PRODUCT
        */

        if (state.editingProductSku) {

            await updateProduct(
                state.editingProductSku,
                {
                    name,
                    price
                }
            );


            showToast(
                "Product updated successfully."
            );

        }


        /*
           CREATE PRODUCT
        */

        else {

            /*
               CreateProductDto from our backend.
            */

            const product = {

                name,

                sku,

                price,

                supplierName:
                    $("#product-supplier")
                        .value.trim(),

                categoryName:
                    $("#product-category")
                        .value.trim(),

                warehouseName:
                    $("#product-warehouse")
                        .value.trim(),

                quantity:
                    Number(
                        $("#product-quantity")
                            .value
                    ),

                reorderLevel:
                    Number(
                        $("#product-reorder")
                            .value
                    )

            };


            await createProduct(product);


            showToast(
                "Product created successfully."
            );

        }


        closeProductModal();


        await loadProductsTable();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Product save error:",
            error
        );


        showFormError(
            error.message ||
            "Unable to save product."
        );

    } finally {

        button.disabled = false;

        button.textContent =
            state.editingProductSku
                ? "Update Product"
                : "Save Product";

    }

}


function showFormError(message) {

    const errorBox =
        $("#product-form-error");

    errorBox.textContent =
        message;

    errorBox.classList.remove("hidden");

}


/* =========================================================
   DELETE PRODUCT
========================================================= */

function openDeleteProductModal(sku) {

    const product =
        state.products.find(
            item => item.sku === sku
        );


    if (!product) {

        showToast("Product not found.");

        return;

    }


    state.deletingProductSku = sku;


    $("#delete-product-name")
        .textContent =
        `${product.name} (${product.sku})`;


    $("#delete-modal")
        .classList.remove("hidden");

}


function closeDeleteProductModal() {

    $("#delete-modal")
        .classList.add("hidden");

    state.deletingProductSku = null;

}


async function confirmDeleteProduct() {

    if (!state.deletingProductSku) {

        return;

    }


    const sku =
        state.deletingProductSku;


    const button =
        $("#confirm-delete-btn");


    button.disabled = true;

    button.textContent = "Deleting...";


    try {

        await deleteProduct(sku);


        closeDeleteProductModal();


        showToast(
            "Product deleted successfully."
        );


        await loadProductsTable();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showToast(
            "Unable to delete product."
        );

    } finally {

        button.disabled = false;

        button.textContent =
            "Delete Product";

    }

}


/* =========================================================
   SUPPLIERS
========================================================= */

async function loadSuppliersTable() {

    try {

        const suppliers =
            await getSuppliers();


        state.suppliers =
            suppliers;


        renderSuppliersTable(
            suppliers
        );


    } catch (error) {

        console.error(
            "Error loading suppliers:",
            error
        );


        showTableError(
            "suppliers-table",
            3,
            "Unable to load suppliers."
        );

    }

}


function renderSuppliersTable(suppliers) {

    const table =
        $("#suppliers-table");


    if (!suppliers || suppliers.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    No suppliers found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        suppliers.map(supplier => `

            <tr>

                <td>
                    <strong>
                        ${escapeHtml(supplier.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(supplier.email)}
                </td>

                <td>
                    ${escapeHtml(supplier.phone)}
                </td>

            </tr>

        `).join("");

}


/* =========================================================
   SUPPLIER SEARCH
========================================================= */

function setupSupplierSearch() {

    $("#supplier-search").addEventListener(
        "input",
        event => {

            const search =
                event.target.value
                    .toLowerCase()
                    .trim();


            const filtered =
                state.suppliers.filter(
                    supplier => {

                        return (

                            String(
                                supplier.name
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                supplier.email
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                supplier.phone
                            )
                            .toLowerCase()
                            .includes(search)

                        );

                    }
                );


            renderSuppliersTable(
                filtered
            );

        }
    );

}


/* =========================================================
   WAREHOUSES
========================================================= */

async function loadWarehousesTable() {

    try {

        const warehouses =
            await getWarehouses();


        state.warehouses =
            warehouses;


        renderWarehousesTable(
            warehouses
        );


    } catch (error) {

        console.error(
            "Error loading warehouses:",
            error
        );


        showTableError(
            "warehouses-table",
            2,
            "Unable to load warehouses."
        );

    }

}


function renderWarehousesTable(warehouses) {

    const table =
        $("#warehouses-table");


    if (!warehouses || warehouses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="2" class="empty-state">
                    No warehouses found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        warehouses.map(warehouse => `

            <tr>

                <td>
                    <strong>
                        ${escapeHtml(
                            warehouse.name
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
                        warehouse.location ??
                        "-"
                    )}
                </td>

            </tr>

        `).join("");

}


/* =========================================================
   WAREHOUSE SEARCH
========================================================= */

function setupWarehouseSearch() {

    $("#warehouse-search").addEventListener(
        "input",
        event => {

            const search =
                event.target.value
                    .toLowerCase()
                    .trim();


            const filtered =
                state.warehouses.filter(
                    warehouse => {

                        return (

                            String(
                                warehouse.name
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                warehouse.location ??
                                ""
                            )
                            .toLowerCase()
                            .includes(search)

                        );

                    }
                );


            renderWarehousesTable(
                filtered
            );

        }
    );

}


/* =========================================================
   INVENTORY
========================================================= */

async function loadInventoryTable() {

    try {

        const inventory =
            await getInventory();


        state.inventory =
            inventory;


        renderInventoryTable(
            inventory
        );


        updateInventorySummary(
            inventory
        );


    } catch (error) {

        console.error(
            "Error loading inventory:",
            error
        );


        showTableError(
            "inventory-table",
            5,
            "Unable to load inventory."
        );

    }

}


function renderInventoryTable(inventory) {

    const table =
        $("#inventory-table");


    if (!inventory || inventory.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No inventory records found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        inventory.map(item => {

            const quantity =
                Number(item.quantity ?? 0);


            const reorderLevel =
                Number(
                    item.reorderLevel ?? 0
                );


            let status;

            let statusClass;


            if (quantity === 0) {

                status = "Out of Stock";

                statusClass =
                    "status-out";

            }

            else if (
                quantity <= reorderLevel
            ) {

                status = "Low Stock";

                statusClass =
                    "status-low";

            }

            else {

                status = "Healthy";

                statusClass =
                    "status-good";

            }


            return `

                <tr>

                    <td>
                        <strong>
                            ${escapeHtml(
                                item.productSku
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(
                            item.warehouseName
                        )}
                    </td>

                    <td>
                        ${quantity.toLocaleString()}
                    </td>

                    <td>
                        ${reorderLevel.toLocaleString()}
                    </td>

                    <td>
                        <span
                            class="status-badge ${statusClass}">
                            ${status}
                        </span>
                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================================================
   INVENTORY SEARCH
========================================================= */

function setupInventorySearch() {

    $("#inventory-search").addEventListener(
        "input",
        event => {

            const search =
                event.target.value
                    .toLowerCase()
                    .trim();


            const filtered =
                state.inventory.filter(
                    item => {

                        return (

                            String(
                                item.productSku
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                item.warehouseName
                            )
                            .toLowerCase()
                            .includes(search)

                        );

                    }
                );


            renderInventoryTable(
                filtered
            );

        }
    );

}


/* =========================================================
   INVENTORY SUMMARY
========================================================= */

function updateInventorySummary(
    inventory
) {

    const lowStock =
        inventory.filter(item => {

            const quantity =
                Number(item.quantity ?? 0);

            const reorderLevel =
                Number(
                    item.reorderLevel ?? 0
                );

            return (
                quantity > 0 &&
                quantity <= reorderLevel
            );

        });


    const outOfStock =
        inventory.filter(item => {

            return Number(
                item.quantity ?? 0
            ) === 0;

        });


    $("#inventory-total")
        .textContent =
        inventory.length;


    $("#inventory-low-stock")
        .textContent =
        lowStock.length;


    $("#inventory-out-stock")
        .textContent =
        outOfStock.length;

}


/* =========================================================
   REFRESH
========================================================= */

async function refreshEverything() {

    showToast("Refreshing data...");


    await Promise.all([

        loadDashboard(),

        loadProductsTable(),

        loadSuppliersTable(),

        loadWarehousesTable(),

        loadInventoryTable(),

        checkConnection()

    ]);


    showToast(
        "Data refreshed successfully."
    );

}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =========================================================
   NUMBER FORMAT
========================================================= */

function formatNumber(value) {

    const number =
        Number(value);


    if (Number.isNaN(number)) {

        return "0";

    }


    return number.toLocaleString(
        "en-NG",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {


    /* Product */

    $("#add-product-btn")
        .addEventListener(
            "click",
            openCreateProductModal
        );


    $("#product-form")
        .addEventListener(
            "submit",
            saveProduct
        );


    $("#close-product-modal")
        .addEventListener(
            "click",
            closeProductModal
        );


    $("#cancel-product-btn")
        .addEventListener(
            "click",
            closeProductModal
        );


    /* Delete */

    $("#close-delete-modal")
        .addEventListener(
            "click",
            closeDeleteProductModal
        );


    $("#cancel-delete-btn")
        .addEventListener(
            "click",
            closeDeleteProductModal
        );


    $("#confirm-delete-btn")
        .addEventListener(
            "click",
            confirmDeleteProduct
        );


    /* Search */

    setupProductSearch();

    setupSupplierSearch();

    setupWarehouseSearch();

    setupInventorySearch();


    /* Refresh buttons */

    $("#refresh-btn")
        .addEventListener(
            "click",
            refreshEverything
        );


    $("#dashboard-refresh")
        .addEventListener(
            "click",
            refreshEverything
        );


    $("#products-refresh")
        .addEventListener(
            "click",
            loadProductsTable
        );


    $("#suppliers-refresh")
        .addEventListener(
            "click",
            loadSuppliersTable
        );


    $("#warehouses-refresh")
        .addEventListener(
            "click",
            loadWarehousesTable
        );


    $("#inventory-refresh")
        .addEventListener(
            "click",
            loadInventoryTable
        );


    /* Close modal when clicking outside */

    $("#product-modal")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("#product-modal")
                ) {

                    closeProductModal();

                }

            }
        );


    $("#delete-modal")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("#delete-modal")
                ) {

                    closeDeleteProductModal();

                }

            }
        );

}


/* =========================================================
   APPLICATION START
========================================================= */

async function initializeApplication() {

    setupNavigation();

    setupEventListeners();


    await checkConnection();


    await loadDashboard();


    /*
       Load the main tables once so the application
       already has data when the user navigates.
    */

    await Promise.all([

        loadProductsTable(),

        loadSuppliersTable(),

        loadWarehousesTable(),

        loadInventoryTable()

    ]);

}


initializeApplication();