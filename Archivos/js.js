
const registerForm = document.querySelector('#registerModal form');

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = registerForm.querySelectorAll('input')[0].value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if(password !== confirmPassword){
            alert('Las contraseñas no coinciden');
            return;
        }

        const userData = {
            nombre: nombre,
            email: email,
            password: password
        };  

        localStorage.setItem('usuarioRegistrado', JSON.stringify(userData));

        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');

        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal.hide();
    });
}


const loginForm = document.querySelector('#loginModal form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailLogin = loginForm.querySelector('input[type="email"]').value;
        const passLogin = loginForm.querySelector('input[type="password"]').value;

      
        if (emailLogin === 'magiaepigea@gmail.com' && passLogin === 'Magia391634*') {
            alert("¡Hola! Redirigiendo al Panel de Control");
            sessionStorage.setItem('sesionActiva', 'admin')
            window.location.href = 'admin.html'; 
            return; 
        }  


       
        const datosGuardados = localStorage.getItem('usuarioRegistrado');

        if (datosGuardados) {
            const usuario = JSON.parse(datosGuardados);

            if (emailLogin === usuario.email && passLogin === usuario.password) {
                alert(`¡Bienvenido de nuevo, ${usuario.nombre}!`);
                sessionStorage.setItem('sesionActiva', 'usuario');
                
                // Redirige al usuario normal al index.html
                window.location.href = 'index.html'; 
            } else {
                alert('Correo o contraseña incorrectos.');
            }
        } else {
            alert('No hay ninguna cuenta registrada con estos datos.');
        }
    });
}

// ojo de la contraseña
function togglePassword(inputId, iconSpan) {
    const input = document.getElementById(inputId);
    const icon = iconSpan.querySelector("i");
  
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    }
}

// --- Carrito: cantidad, agregar y renderizar en modal ---
document.addEventListener('DOMContentLoaded', function () {
    const CART_KEY = 'magia_cart';

    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function updateBadge() {
        const cart = getCart();
        const total = cart.reduce((s, it) => s + Number(it.qty), 0);
        const badge = document.querySelector('.cart-count');
        if (!badge) return;
        if (total > 0) { badge.style.display = 'inline-block'; badge.textContent = total; }
        else { badge.style.display = 'none'; }
    }

    function renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) return;
        const cart = getCart();
        container.innerHTML = '';
        if (cart.length === 0) {
            container.innerHTML = '<div class="text-muted">No hay productos en el carrito.</div>';
            return;
        }
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-group-item d-flex justify-content-between align-items-center cart-item';
            div.innerHTML = `
                <div class="d-flex align-items-center" style="gap:.75rem">
                    <img src="${item.img||''}" alt="" style="width:56px;height:56px;object-fit:cover;border-radius:6px;display:${item.img? 'block':'none'}">
                    <div>
                        <strong>${item.title}</strong>
                        <div class="small">Cantidad: ${item.qty}</div>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">Eliminar</button>
                </div>`;
            container.appendChild(div);
        });

        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                let cart = getCart();
                cart = cart.filter(i => i.id !== id);
                saveCart(cart);
                renderCart();
                updateBadge();
            });
        });
    }

    // Handle add-to-cart with select option
    document.addEventListener('click', function (e) {
        const addBtn = e.target.closest('.add-to-cart');
        if (addBtn) {
            const card = addBtn.closest('.cardInf') || addBtn.closest('.item') || addBtn.closest('.product-card');
            let title = 'Producto';
            if (card) {
                const h3 = card.querySelector('h3');
                const p = card.querySelector('p');
                const t = card.querySelector('.item p');
                title = (h3 && h3.innerText) || (p && p.innerText) || (t && t.innerText) || title;
            }
            const qtySelect = card ? card.querySelector('.qty-select') : null;
            const qty = qtySelect ? Math.max(1, parseInt(qtySelect.value)||1) : 1;
            const imgEl = card ? card.querySelector('img') : null;
            const img = imgEl ? imgEl.src : '';

            // Build item object
            const itemObj = {
                id: Date.now().toString() + Math.floor(Math.random()*1000),
                title: title.trim(),
                qty: Number(qty),
                img: img
            };

            // Merge if same title exists
            const cart = getCart();
            const existing = cart.find(i => i.title === itemObj.title && i.img === itemObj.img);
            if (existing) {
                existing.qty = Number(existing.qty) + Number(itemObj.qty);
            } else {
                cart.push(itemObj);
            }
            saveCart(cart);
            renderCart();
            updateBadge();

            // show modal
            const cartModalEl = document.getElementById('cartModal');
            if (cartModalEl) {
                const cartModal = new bootstrap.Modal(cartModalEl);
                cartModal.show();
            }
            return;
        }
    });

    // Initialize
    renderCart();
    updateBadge();
});