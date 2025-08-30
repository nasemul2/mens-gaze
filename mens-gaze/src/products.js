document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    // Fetch products from the JSON file
    const fetchProducts = async () => {
        try {
            const response = await fetch('/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Could not fetch products:", error);
            productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
    };

    // Render products to the DOM
    const renderProducts = (products) => {
        if (products.length === 0) {
            productList.innerHTML = '<p>No products found.</p>';
            return;
        }

        productList.innerHTML = ''; // Clear existing products
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.animationDelay = `${index * 100}ms`; // Staggered animation

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="price">৳ ${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                </div>
            `;
            productList.appendChild(productCard);
        });
    };

    // Initial fetch
    fetchProducts();

    // Mobile navigation toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
