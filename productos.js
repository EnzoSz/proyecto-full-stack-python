/* const fs = import('fs');

function importarProductos() {
  // Definimos la ruta del archivo
  const rutaArchivo = './data/pastas.json';
  // Verificamos que el archivo exista
  if (!fs.existsSync(rutaArchivo)) {
    throw new Error('El archivo no existe');
  }
  // Leemos el archivo y lo parseamos a JSON
  const contenido = JSON.parse(fs.readFileSync(rutaArchivo, 'utf8'));
  return contenido
}

module.exports = { importarProductos }; */
function importarProductos() {
  const rutaArchivo = "../data/pastas.json";
  return fetch(rutaArchivo)
    .then((response) => response.json()) //indicamos el formato en que queremos obtener la informacion
    .then((data) => data); //data es el objeto que nos devuelve la promesa
}

export { importarProductos };
