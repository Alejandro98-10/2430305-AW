// --- Importación necesaria para usar input interactivo en Node.js ---
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Constantes
const CALIFICACION_MINIMA_APROBATORIA = 70;
const CALIFICACIONES_POR_MATERIA = 4;
const PROMEDIO_REPROBADO_ESPECIAL = 60;
// --- Fin de la adaptación ---

// La función 'ingresarCalificaciones' necesita ser asíncrona para usar rl.question
function ingresarCalificaciones(nombreMateria, callback) {
    const calificaciones = [];
    let i = 1;

    // Función recursiva para solicitar las 4 notas una por una
    function solicitarCalificacion() {
        if (i > CALIFICACIONES_POR_MATERIA) {
            return callback(calificaciones); // Termina y devuelve las notas
        }

        rl.question(`Ingrese la calificación de la Unidad ${i} para ${nombreMateria} (0-100): `, (input) => {
            const calificacion = parseFloat(input.trim());

            if (isNaN(calificacion) || calificacion < 0 || calificacion > 100) {
                console.log("Calificación inválida. Debe ser un número entre 0 y 100.");
                solicitarCalificacion(); // Vuelve a pedir la misma nota
            } else {
                calificaciones.push(calificacion);
                i++;
                solicitarCalificacion(); // Pide la siguiente nota
            }
        });
    }
    
    solicitarCalificacion();
}


// La función procesarMateria permanece igual (es solo cálculo)
function procesarMateria(nombreMateria, calificaciones) {
    let promedioCalculado;
    let estado;
    let sumaCalificaciones = 0;
    let minimoEsMenorASetenta = false;

    // A. Revisar la regla especial de reprobación
    for (const calificacion of calificaciones) {
        sumaCalificaciones += calificacion;
        if (calificacion < CALIFICACION_MINIMA_APROBATORIA) {
            minimoEsMenorASetenta = true;
            break;
        }
    }

    // B. Asignar promedio y estado
    if (minimoEsMenorASetenta) {
        promedioCalculado = PROMEDIO_REPROBADO_ESPECIAL;
        estado = "No aprobado";
    } else {
        promedioCalculado = sumaCalificaciones / CALIFICACIONES_POR_MATERIA;
        estado = "Aprobado";
    }
    
    promedioCalculado = Math.round(promedioCalculado * 100) / 100;

    return {
        materia: nombreMateria,
        calificaciones: calificaciones.join(", "),
        promedio: promedioCalculado,
        estado: estado
    };
}

// Función para mostrar los resultados (usando console.log en lugar de alert)
function mostrarResultados(resultados) {
    if (resultados.length === 0) {
        console.log("No se procesaron materias.");
        return;
    }

    let salida = "--- Reporte de Calificaciones ---\n\n";

    resultados.forEach(res => {
        salida += `Materia: ${res.materia}\n`;
        salida += `Calificaciones (Unidades): ${res.calificaciones}\n`;
        salida += `Promedio Final: ${res.promedio}\n`;
        salida += `Estado: ${res.estado}\n`;
        salida += "--------------------------------\n";
    });

    console.log(salida);
}


// Función principal adaptada para ser asíncrona
function calcularCalificaciones(i = 1, numMaterias = 0, resultados = []) {
    if (numMaterias === 0) {
        // Paso 1: Solicitar el número de materias
        rl.question("Ingrese el número de materias (N): ", (inputN) => {
            const N = parseInt(inputN.trim());
            if (isNaN(N) || N <= 0) {
                console.log("Por favor, ingrese un número válido mayor a 0.");
                return calcularCalificaciones(); // Vuelve a pedir N
            }
            calcularCalificaciones(1, N, []); // Inicia el bucle de materias
        });
        return;
    }

    // Paso 2: Iterar sobre cada materia (función recursiva)
    if (i <= numMaterias) {
        rl.question(`Ingrese el nombre de la materia ${i}: `, (nombreMateria) => {
            
            // Llama a la función asíncrona para ingresar las calificaciones
            ingresarCalificaciones(nombreMateria, (calificaciones) => {
                
                if (calificaciones.length === CALIFICACIONES_POR_MATERIA) {
                    const resultadoMateria = procesarMateria(nombreMateria, calificaciones);
                    resultados.push(resultadoMateria);
                } else {
                    console.log(`No se pudieron ingresar las ${CALIFICACIONES_POR_MATERIA} calificaciones para ${nombreMateria}. Se omite esta materia.`);
                }

                // Llama al siguiente paso del bucle
                calcularCalificaciones(i + 1, numMaterias, resultados);
            });
        });
        return;
    }

    // Paso 3: Mostrar resultados y cerrar la interfaz de lectura
    mostrarResultados(resultados);
    rl.close();
}

// **INICIO DE LA APLICACIÓN**
calcularCalificaciones();