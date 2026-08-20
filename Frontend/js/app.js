const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".page-section");

navButtons.forEach(button => {
    button.addEventListener("click", () => {

        const targetSection = button.dataset.section;

        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        document
            .getElementById(targetSection)
            .classList.add("active-section");
    });
});

async function loadProducts() {
    try {
        const products = await getProducts();

        const table = document.getElementById("product-table");

        table.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>₦${product.price.toLocaleString()}</td>
            `;

            table.appendChild(row);
        });

        document.getElementById("product-count").textContent = products.length;

    } catch (error) {
        console.error("Error loading products:", error);
    }
}
 loadProducts();

async function loadDashboard() {
    try {
        const [products, suppliers, warehouses, inventory] =
            await Promise.all([
                getProducts(),
                getSuppliers(),
                getWarehouses(),
                getInventory()
            ]);

        document.getElementById("product-count").textContent =
            products.length;

        document.getElementById("supplier-count").textContent =
            suppliers.length;

        document.getElementById("warehouse-count").textContent =
            warehouses.length;

        document.getElementById("inventory-count").textContent =
            inventory.length;

        const table = document.getElementById("product-table");

        table.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>₦${Number(product.price).toLocaleString()}</td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}


async function loadProductsTable() {
    try {
        const products = await getProducts();

        const table = document.getElementById("products-table");

        table.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>₦${Number(product.price).toLocaleString()}</td>
                <td>
                    <button class="action-btn"
                            data-action="edit"
                            data-sku="${product.sku}">
                        Edit
                    </button>

                    <button class="delete-btn"
                            data-action="delete"
                            data-sku="${product.sku}">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading products table:", error);
    }
}

document
    .getElementById("products-table")
    .addEventListener("click", async (event) => {

        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        const sku = button.dataset.sku;
        const action = button.dataset.action;

        if (action === "delete") {

            const confirmed = confirm(
                `Are you sure you want to delete ${sku}?`
            );

            if (!confirmed) {
                return;
            }

            try {
                await deleteProduct(sku);

                await loadProductsTable();
                await loadDashboard();

                alert("Product deleted successfully.");

            } catch (error) {
                console.error(error);
                alert("Failed to delete product.");
            }
        }

        if (action === "edit") {

            const newName = prompt("Enter the new product name:");

            if (!newName) {
                return;
            }

            const newPrice = prompt("Enter the new price:");

            if (!newPrice) {
                return;
            }

            try {
                await updateProduct(sku, {
                    name: newName,
                    price: Number(newPrice)
                });

                await loadProductsTable();
                await loadDashboard();

                alert("Product updated successfully.");

            } catch (error) {
                console.error(error);
                alert("Failed to update product.");
            }
        }
    });

  loadDashboard();
  loadProductsTable();