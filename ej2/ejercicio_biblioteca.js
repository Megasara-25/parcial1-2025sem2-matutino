/**
 * EJERCICIO DE PARCIAL: SISTEMA DE GESTIÓN DE BIBLIOTECA UNIVERSITARIA
 * parece ser que el navegador no soporta import de JSON con assert { type: 'json' }, por lo tanto
 * he utilizado un fetch para cargar el JSON como si fuera una llamada a una API REST,
 * para solucionarlo de manera rapida y eficiente 
 */

let biblioteca = null;

// Cargar datos desde JSON
async function cargarDatos() {
  try {
    const response = await fetch('./datos_biblioteca.json');
    const bibliotecaData = await response.json();
    biblioteca = JSON.parse(JSON.stringify(bibliotecaData));
    return biblioteca;
  } catch (error) {
    console.error('Error al cargar datos:', error);
    return null;
  }
}

function libroDisponible(libro) {
  if (!Array.isArray(libro.prestamos) || libro.prestamos.length === 0) return true;
  const ultimo = libro.prestamos[libro.prestamos.length - 1];
  return ultimo.fechaDevolucion != null;
}

// Función para prestar libro 
export async function prestarLibro(idLibro, idEstudiante, fechaPrestamo) {
  if (!biblioteca) {
    await cargarDatos();
  }
  
  const libro = biblioteca.libros.find(l => l.id === Number(idLibro));
  if (!libro) return `Error: libro ${idLibro} no existe`;

  const estudiante = biblioteca.estudiantes.find(e => e.id === Number(idEstudiante));
  if (!estudiante) return `Error: estudiante ${idEstudiante} no existe`;

  if (!libroDisponible(libro)) return `Error: el libro "${libro.titulo}" no está disponible`;

  // Registrar prestamo en el libro
  if (!Array.isArray(libro.prestamos)) libro.prestamos = [];
  libro.prestamos.push({
    estudiante: estudiante.nombre,      
    fechaPrestamo,
    fechaDevolucion: null
  });

  // Actualizar disponibilidad del libro
  libro.disponible = false;

  // Registrar en el estudiante
  if (!Array.isArray(estudiante.librosActuales)) estudiante.librosActuales = [];
  if (!estudiante.librosActuales.includes(libro.id)) {
    estudiante.librosActuales.push(libro.id);
  }

  return `Préstamo exitoso: "${libro.titulo}" prestado a ${estudiante.nombre}`;
}

// Función para buscar libros 
export async function buscarLibros(filtros = {}) {
  if (!biblioteca) {
    await cargarDatos();
  }
  
  const { titulo, autor, categoria, disponible } = filtros;
  const like = (a, b) => {
    if (b == null || String(b).trim() === '') return true;
    if (a == null) return false;
    return String(a).toLowerCase().includes(String(b).toLowerCase());
  };

  return biblioteca.libros.filter(libro => {
    const disp = libroDisponible(libro);             
    const okDisp = disponible === undefined ? true : (disponible ? disp : !disp);
    return okDisp
      && like(libro.titulo, titulo)
      && like(libro.autor, autor)
      && like(libro.categoria, categoria);
  });
}