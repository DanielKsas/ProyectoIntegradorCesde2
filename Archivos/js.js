// Seleccionamos el formulario de registro por su contexto (dentro del modal)
const registerForm = document.querySelector('#registerModal form');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Capturamos los valores (usando los índices o clases de tus inputs)
    const nombre = registerForm.querySelectorAll('input')[0].value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelectorAll('input[type="password"]')[0].value;

    // Creamos un objeto para guardar más de un dato a la vez
    const userData = {
        nombre: nombre,
        email: email,
        password: password
    };

    // IMPORTANTE: LocalStorage solo guarda TEXTO. 
    // Usamos JSON.stringify para convertir el objeto a texto.
    localStorage.setItem('usuarioRegistrado', JSON.stringify(userData));

    alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
    
    // Opcional: Cerrar modal de registro (usando Bootstrap)
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    modal.hide();
});


const loginForm = document.querySelector('#loginModal form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailLogin = loginForm.querySelector('input[type="email"]').value;
    const passLogin = loginForm.querySelector('input[type="password"]').value;

    // 1. Traemos los datos del Local Storage
    const datosGuardados = localStorage.getItem('usuarioRegistrado');

    if (datosGuardados) {
        // 2. Convertimos el texto de vuelta a Objeto JS
        const usuario = JSON.parse(datosGuardados);

        // 3. Comparamos
        if (emailLogin === usuario.email && passLogin === usuario.password) {
            alert(`¡Bienvenido de nuevo, ${usuario.nombre}!`);
            
            // Guardamos que la sesión está ACTIVA (en SessionStorage para seguridad)
            sessionStorage.setItem('sesionActiva', 'true');
            
            // Redirigir a otra página
            window.location.href = 'dashboard.html';
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    } else {
        alert('No hay ninguna cuenta registrada con estos datos.');
    }
});