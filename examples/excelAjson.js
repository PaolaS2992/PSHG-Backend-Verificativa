const XLSX = require('xlsx');
const path = require('path');

const excelAjson = () => {
    // Leer la ruta del archivo Excel.
    const excel = XLSX.readFile(path.join(process.cwd(), 'assets', 'FormatoPosulantes.xlsx'));
    
    const nombreHoja = excel.SheetNames; // regresa un array.

    let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);

    console.log(datos); // Hasta Aqui convertimos los datos a JSON.

    // Transformar Fecha.
    const jDatos = [];
    for (let i = 0; i < datos.length; i++) {
        const dato = datos[i];
        const FormatoFecha = new Date((dato.fecha - 25567 + 2) * 86400 * 1000);
        jDatos.push({
            ...dato,
            Fecha: FormatoFecha,
            });
    }

    console.log(jDatos); // Hasta Aqui tratamos la columna fecha.
};

excelAjson();