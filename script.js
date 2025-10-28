// Constante para la calificación mínima de aprobación por unidad
const CALIFICACION_MINIMA_UNIDAD = 70;

// Constante para el promedio automático si hay reprobación por unidad
const PROMEDIO_REPROBACION = 60;

/**
 * Genera dinámicamente los campos de entrada para las materias y sus 4 unidades.
 */
function generarInputs() {
    const numMaterias = parseInt(document.getElementById('numMaterias').value);
    const container = document.getElementById('materiasContainer');
    const calcularBtn = document.getElementById('calcularBtn');
    container.innerHTML = ''; // Limpiar contenedores anteriores
    document.getElementById('resultados').innerHTML = '';

    if (isNaN(numMaterias) || numMaterias < 1) {
        alert("Por favor, ingrese un número válido de materias.");
        calcularBtn.style.display = 'none';
        return;
    }

    for (let i = 1; i <= numMaterias; i++) {
        const materiaDiv = document.createElement('div');
        materiaDiv.classList.add('materia-input');
        
        // Input para el nombre de la materia
        materiaDiv.innerHTML = `
            <h3>Materia ${i}</h3>
            <label for="nombreMateria${i}">Nombre:</label>
            <input type="text" id="nombreMateria${i}" value="Materia ${i}">
            <label>Calificaciones de las 4 Unidades (Mínimo ${CALIFICACION_MINIMA_UNIDAD} por unidad):</label>
            <div class="calificacion-input">
                <input type="number" id="materia${i}_unidad1" placeholder="Unidad 1" min="0" max="100" required>
                <input type="number" id="materia${i}_unidad2" placeholder="Unidad 2" min="0" max="100" required>
                <input type="number" id="materia${i}_unidad3" placeholder="Unidad 3" min="0" max="100" required>
                <input type="number" id="materia${i}_unidad4" placeholder="Unidad 4" min="0" max="100" required>
            </div>
        `;
        container.appendChild(materiaDiv);
    }

    calcularBtn.style.display = 'block'; // Mostrar botón de calcular
}

/**
 * Calcula el promedio y el estado de aprobación para cada materia.
 */
function calcularPromedios() {
    const numMaterias = parseInt(document.getElementById('numMaterias').value);
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores
    let todosLosDatosValidos = true;

    for (let i = 1; i <= numMaterias; i++) {
        const nombreMateria = document.getElementById(`nombreMateria${i}`).value || `Materia ${i}`;
        
        const c1 = parseFloat(document.getElementById(`materia${i}_unidad1`).value);
        const c2 = parseFloat(document.getElementById(`materia${i}_unidad2`).value);
        const c3 = parseFloat(document.getElementById(`materia${i}_unidad3`).value);
        const c4 = parseFloat(document.getElementById(`materia${i}_unidad4`).value);

        // Validación básica de números
        if (isNaN(c1) || isNaN(c2) || isNaN(c3) || isNaN(c4)) {
            todosLosDatosValidos = false;
            break; 
        }

        // Determinar si hay alguna calificación por debajo del mínimo (70)
        const tieneCalificacionBaja = c1 < CALIFICACION_MINIMA_UNIDAD || 
                                     c2 < CALIFICACION_MINIMA_UNIDAD || 
                                     c3 < CALIFICACION_MINIMA_UNIDAD || 
                                     c4 < CALIFICACION_MINIMA_UNIDAD;

        let promedio;
        let estado;

        if (tieneCalificacionBaja) {
            // Regla: Si hay una calificación menor a 70, el promedio es 60
            promedio = PROMEDIO_REPROBACION; 
            estado = `<span class="no-aprobado">No aprobado</span> (Calificación menor a ${CALIFICACION_MINIMA_UNIDAD} en una unidad)`;
        } else {
            // Si todas son 70 o más, calcular el promedio normal
            const suma = c1 + c2 + c3 + c4;
            promedio = (suma / 4).toFixed(2); // Redondeo a 2 decimales
            
            // Regla: Si el promedio normal es 70 o más, se aprueba
            if (promedio >= CALIFICACION_MINIMA_UNIDAD) {
                estado = `<span class="aprobado">Aprobado</span>`;
            } else {
                // Esto podría ocurrir si todas son >= 70, pero el promedio es < 70 (ej: 70, 70, 70, 70 = 70 Aprobado)
                // Para simplificar, si ya pasó el filtro de unidad < 70, el promedio de 70 se considera aprobado
                estado = `<span class="aprobado">Aprobado</span> (Promedio ${promedio})`;
            }
        }
        
        // Mostrar el resultado en el div de resultados
        const resultadoDiv = document.createElement('div');
        resultadoDiv.classList.add('resultado-materia');
        resultadoDiv.innerHTML = `
            <h4>${nombreMateria}</h4>
            <p><strong>Calificaciones:</strong> U1: ${c1}, U2: ${c2}, U3: ${c3}, U4: ${c4}</p>
            <p><strong>Promedio Final:</strong> ${promedio}</p>
            <p><strong>Estado:</strong> ${estado}</p>
        `;
        resultadosDiv.appendChild(resultadoDiv);
    }

    if (!todosLosDatosValidos) {
        alert("Por favor, ingrese todas las calificaciones de las unidades con números válidos.");
        resultadosDiv.innerHTML = '';
    }
}