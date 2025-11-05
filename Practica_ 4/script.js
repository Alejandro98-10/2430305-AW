// 1. ESTRUCTURA DE DATOS: ARRAY DE USUARIOS
const usuariosRegistrados = [
    {
        correo: "test@ejemplo.com",
        contrasena: "pass123"
    },
    {
        correo: "admin@sistema.com",
        contrasena: "supersecreto"
    },
];

// 2. LÓGICA DE AUTENTICACIÓN (Función llamada desde el botón en el HTML)
function iniciarSesion() {
    // A. Capturar valores
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    
    // Ocultar cualquier mensaje de error anterior
    document.getElementById('mensajeError').style.display = 'none';

    // B. Buscar coincidencia en el array
    const usuarioEncontrado = usuariosRegistrados.find(user => 
        user.correo === emailInput && user.contrasena === passwordInput
    );

    // C. Resultado de la Autenticación
    if (usuarioEncontrado) {
        // ✅ Acceso Correcto
        mostrarVistaBienvenida(usuarioEncontrado.correo);
    } else {
        // ❌ Acceso Incorrecto
        document.getElementById('mensajeError').style.display = 'block';
    }
}

// 3. CAMBIO DE VISTA (Lógica de Interfaz)
function mostrarVistaBienvenida(correoUsuario) {
    const vistaLogin = document.getElementById('vistaLogin');
    const vistaBienvenida = document.getElementById('vistaBienvenida');

    // Ocultar la vista de login
    vistaLogin.style.display = 'none';

    // Mostrar la vista de bienvenida
    vistaBienvenida.style.display = 'block';

    // Insertar el mensaje de bienvenida
    vistaBienvenida.innerHTML = `
        <span style="font-size: 50px;">🎉</span>
        <p>¡Bienvenido **${correoUsuario}**!</p>
        <p style="font-size: 16px; font-weight: normal; color: #666;">Has accedido correctamente al sistema.</p>
    `;
}