document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productDescriptionInput = document.getElementById('product-description');
    const productImageLinkInput = document.getElementById('product-image-link');
    const adminProductsTbody = document.getElementById('admin-products-tbody');

    let products = [];

    // Fetch products from the JSON file
    const fetchProducts = async () => {
        try {
            // Add a cache-busting query parameter to the URL
            const response = await fetch(`/products.json?v=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            renderProductsTable();
        } catch (error) {
            console.error("Could not fetch products:", error);
            adminProductsTbody.innerHTML = '<tr><td colspan="3">Error loading products. Please check if products.json is valid.</td></tr>';
        }
    };

    // Render the products table
    const renderProductsTable = () => {
        adminProductsTbody.innerHTML = '';
        if (products.length === 0) {
            adminProductsTbody.innerHTML = '<tr><td colspan="3">No products found. Add one using the form above.</td></tr>';
            return;
        }

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">✏️</button>
                    <button class="delete-btn" data-id="${product.id}">🗑️</button>
                </td>
            `;
            adminProductsTbody.appendChild(tr);
        });
    };

    // Handle form submission (Add/Edit)
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            id: productIdInput.value ? parseInt(productIdInput.value) : Date.now(),
            name: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            description: productDescriptionInput.value,
            image: productImageLinkInput.value, // Get image URL from the new input field
        };

        const existingProductIndex = products.findIndex(p => p.id === productData.id);

        if (existingProductIndex > -1) {
            // Editing existing product
            products[existingProductIndex] = productData;
        } else {
            // Adding new product
            products.push(productData);
        }

        await updateProductsJson();
        renderProductsTable();
        productForm.reset();
        productIdInput.value = '';
    });

    // Handle Edit and Delete button clicks
    adminProductsTbody.addEventListener('click', (e) => {
        const target = e.target;
        const id = parseInt(target.dataset.id);

        if (target.classList.contains('edit-btn')) {
            const productToEdit = products.find(p => p.id === id);
            if (productToEdit) {
                productIdInput.value = productToEdit.id;
                productNameInput.value = productToEdit.name;
                productPriceInput.value = productToEdit.price;
                productDescriptionInput.value = productToEdit.description;
                productImageLinkInput.value = productToEdit.image;
                window.scrollTo(0, 0); // Scroll to top to see the form
            }
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this product?')) {
                products = products.filter(p => p.id !== id);
                updateProductsJson();
                renderProductsTable();
            }
        }
    });

    // Save the updated products array to the server
    const updateProductsJson = async () => {
        try {
            const response = await fetch('/api/update-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(products, null, 2),
            });
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            // Optional: Show a more subtle success message instead of an alert
            console.log("Products updated successfully!");
        } catch (error) {
            console.error("Error updating products:", error);
            alert("Failed to update products. Check the console for more details.");
        }
    };

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/admin-login.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    });

    // Initial fetch of products
    fetchProducts();
});
