const allSizes = ["S", "M", "L", "XL", "XXL", "40", "41", "42", "43", "ONESIZE"];

// 8 нақты категория
const categories = [
    { id: "all", name: "Барлық тауарлар" },
    { id: "vetrovki", name: "Ветровки" },
    { id: "kardigany", name: "Кардиганы" },
    { id: "poluzamoki", name: "Полузамоки" },
    { id: "dwoyki", name: "Двойки" },
    { id: "futbolki", name: "Футболки" },
    { id: "jeans-bruki-trico", name: "Джинсы-Брюки-Трико" },
    { id: "obuvi", name: "Обуви" },
    { id: "aksessuary", name: "Акксексуары" }
];

const defaultProducts = [
    {
        id: 1,
        title: "Minimal Windbreaker",
        price: 21000,
        category: "vetrovki",
        img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500",
        availableSizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 2,
        title: "Classic Knit Cardigan",
        price: 18500,
        category: "kardigany",
        img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
        availableSizes: ["M", "L", "XL"],
        inStock: true
    },
    {
        id: 3,
        title: "Zip Sweatshirt",
        price: 16000,
        category: "poluzamoki",
        img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500",
        availableSizes: ["S", "M", "L"],
        inStock: true
    },
    {
        id: 4,
        title: "Urban Matching Set",
        price: 29000,
        category: "dwoyki",
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
        availableSizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 5,
        title: "Heavyweight Cotton Tee",
        price: 7500,
        category: "futbolki",
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
        availableSizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 6,
        title: "Relaxed Fit Cargo Pants",
        price: 14000,
        category: "jeans-bruki-trico",
        img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
        availableSizes: ["M", "L", "XL"],
        inStock: true
    },
    {
        id: 7,
        title: "Minimalist Leather Sneakers",
        price: 25000,
        category: "obuvi",
        img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
        availableSizes: ["40", "41", "42", "43"],
        inStock: true
    },
    {
        id: 8,
        title: "Minimalist Crossbody Bag",
        price: 9500,
        category: "aksessuary",
        img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
        availableSizes: ["ONESIZE"],
        inStock: true
    }
];

let products = JSON.parse(localStorage.getItem('freeman_products_v9')) || defaultProducts;
let cart = [];
let selectedSizes = {};
let currentCategory = 'all';

function init() {
    renderDrawerLinks();
    renderProducts();
    renderAdminForm();
    updateCartUI();
}

function renderDrawerLinks() {
    const container = document.getElementById('drawerLinks');
    container.innerHTML = categories.map(cat => `
        <button class="drawer-link ${currentCategory === cat.id ? 'active' : ''}" 
                onclick="selectCategory('${cat.id}', this)">
            ${cat.name}
        </button>
    `).join('');
}

function toggleDrawer() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const isOpen = drawer.classList.toggle('open');
    overlay.style.display = isOpen ? 'block' : 'none';
}

function selectCategory(catId, btn) {
    currentCategory = catId;
    document.querySelectorAll('.drawer-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const found = categories.find(c => c.id === catId);
    document.getElementById('currentCategoryTitle').innerText = found ? found.name : "Каталог";

    renderProducts();
    toggleDrawer();
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const itemCount = document.getElementById('itemCount');

    const filtered = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);

    itemCount.innerText = `${filtered.length} тауар`;

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: span 2; text-align: center; color: var(--text-secondary); padding: 40px; font-size: 0.85rem;">Бұл бөлікте әзірге тауар жоқ.</div>';
        return;
    }

    grid.innerHTML = filtered.map(product => {
        if (!selectedSizes[product.id] || !product.availableSizes.includes(selectedSizes[product.id])) {
            selectedSizes[product.id] = product.availableSizes[0] || null;
        }

        const hasSizes = product.availableSizes && product.availableSizes.length > 0;

        const sizesButtons = product.availableSizes.map(size => {
            const isSelected = selectedSizes[product.id] === size;
            return `<button class="size-btn ${isSelected ? 'active' : ''}" onclick="selectSize(${product.id}, '${size}')" ${!product.inStock ? 'disabled' : ''}>${size}</button>`;
        }).join('');

        return `
            <div class="product-card ${(!product.inStock || !hasSizes) ? 'out-of-stock' : ''}">
                <div class="img-wrapper">
                    <img src="${product.img}" alt="${product.title}" loading="lazy">
                    ${(!product.inStock || !hasSizes) ? '<div class="out-badge">Таусылды</div>' : ''}
                </div>
                <div class="card-details">
                    <div>
                        <div class="product-title">${product.title}</div>
                        <div class="product-price">${product.price.toLocaleString()} ₸</div>
                    </div>
                    
                    <div class="size-selector">${sizesButtons}</div>

                    <button class="add-btn" 
                            onclick="addToCart(${product.id})" 
                            ${(!product.inStock || !hasSizes) ? 'disabled' : ''}>
                        ${product.inStock && hasSizes ? '+ Себетке' : 'Таусылды'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Админ панельді категориялар бойынша бөліп көрсету
function renderAdminForm() {
    const container = document.getElementById('adminFormContainer');
    container.innerHTML = '';

    // Тек 8 негізгі категорияны аламыз (all-дан басқа)
    const validCategories = categories.filter(c => c.id !== 'all');

    validCategories.forEach(cat => {
        const catProducts = products.filter(p => p.category === cat.id);
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'admin-category-section';
        
        let sectionHTML = `<div class="admin-category-title">${cat.name} (${catProducts.length})</div>`;

        if (catProducts.length === 0) {
            sectionHTML += `<div style="font-size: 0.75rem; color: #a1a1aa; margin-bottom: 8px;">Тауар жоқ</div>`;
        } else {
            catProducts.forEach(p => {
                const originalIndex = products.findIndex(item => item.id === p.id);
                
                let categoryOptions = validCategories.map(c => `
                    <option value="${c.id}" ${p.category === c.id ? 'selected' : ''}>${c.name}</option>
                `).join('');

                let sizesHtml = allSizes.map(size => {
                    const active = p.availableSizes.includes(size);
                    return `<button class="admin-size-chip ${active ? 'active' : ''}" onclick="toggleSizeForProduct(${originalIndex}, '${size}')">${size}</button>`;
                }).join('');

                sectionHTML += `
                    <div class="admin-item" data-id="${p.id}">
                        <label>Тауар аты:</label>
                        <input type="text" value="${p.title}" onchange="updateProduct(${originalIndex}, 'title', this.value)">
                        
                        <label>Бағасы (₸):</label>
                        <input type="number" value="${p.price}" onchange="updateProduct(${originalIndex}, 'price', Number(this.value))">

                        <label>Категорияны ауыстыру:</label>
                        <select onchange="updateProduct(${originalIndex}, 'category', this.value)">
                            ${categoryOptions}
                        </select>
                        
                        <label>Өлшемдер:</label>
                        <div class="admin-sizes-toggle">${sizesHtml}</div>

                        <label>Статус:</label>
                        <select onchange="updateProduct(${originalIndex}, 'inStock', this.value === 'true')">
                            <option value="true" ${p.inStock ? 'selected' : ''}>Сатылымда бар</option>
                            <option value="false" ${!p.inStock ? 'selected' : ''}>Толық таусылды</option>
                        </select>

                        <button class="delete-product-btn" onclick="deleteProduct(${originalIndex})">Тауарды өшіру</button>
                    </div>
                `;
            });
        }

        sectionDiv.innerHTML = sectionHTML;
        container.appendChild(sectionDiv);
    });
}

function toggleSizeForProduct(productIndex, size) {
    const product = products[productIndex];
    const sizeIndex = product.availableSizes.indexOf(size);
    
    if (sizeIndex > -1) {
        product.availableSizes.splice(sizeIndex, 1);
    } else {
        product.availableSizes.push(size);
    }

    saveAndReload();
}

function updateProduct(index, field, value) {
    products[index][field] = value;
    saveAndReload();
}

function deleteProduct(index) {
    if (confirm("Бұл тауарды шынымен өшіргіңіз келе ме?")) {
        products.splice(index, 1);
        saveAndReload();
    }
}

function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'flex';
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

function addNewProductItem() {
    const title = document.getElementById('newTitle').value.trim();
    const price = Number(document.getElementById('newPrice').value);
    const category = document.getElementById('newCategory').value;
    const img = document.getElementById('newImg').value.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500";

    if (!title || !price) {
        alert("Тауар аты мен бағасын толтырыңыз!");
        return;
    }

    const newProduct = {
        id: Date.now(),
        title: title,
        price: price,
        category: category,
        img: img,
        availableSizes: ["S", "M", "L", "XL"],
        inStock: true
    };

    products.push(newProduct);
    saveAndReload();
    closeAddProductModal();

    // Input өрістерін тазарту
    document.getElementById('newTitle').value = '';
    document.getElementById('newPrice').value = '';
    document.getElementById('newImg').value = '';
}

function saveAndReload() {
    localStorage.setItem('freeman_products_v9', JSON.stringify(products));
    renderProducts();
    renderAdminForm();
}

// Заманауи құпия сөз терезесі арқылы кіру
function openAdminLogin() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('adminPasswordInput').value = '';
}

function closeAdminLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function verifyAdminPassword() {
    const pwd = document.getElementById('adminPasswordInput').value;
    if (pwd === "7777") { // Құпия сөз
        closeAdminLogin();
        document.getElementById('adminModal').style.display = 'flex';
    } else {
        alert("Құпия сөз қате!");
    }
}

function toggleAdmin() {
    const modal = document.getElementById('adminModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function selectSize(productId, size) {
    selectedSizes[productId] = size;
    renderProducts();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const size = selectedSizes[productId];
    if (!size) return;
    cart.push({ ...product, size });
    updateCartUI();
}

function updateCartUI() {
    const countElem = document.getElementById('cartCount');
    const totalElem = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        countElem.innerText = "Себет бос";
    } else {
        countElem.innerText = `${cart.length} тауар таңдалды`;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalElem.innerText = `${total.toLocaleString()} ₸`;
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert("Себет бос!");
        return;
    }
    const phoneNumber = "77001112233";
    let message = "Сәлеметсіз бе! FREEMAN ALMATY сайтынан тапсырыс бергім келеді:\n\n";
    let total = 0;
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.title}* [Өлшемі: ${item.size}] — ${item.price.toLocaleString()} ₸\n`;
        total += item.price;
    });
    message += `\n*Жалпы сумма:* ${total.toLocaleString()} ₸`;
    message += `\n\nТапсырысты рәсімдеуге көмектесесіз бе?`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
}

init();