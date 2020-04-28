
const XLSX = require('xlsx');
const path = require('path');

const getExcelJson = () => {
    // Leer la ruta del archivo Excel.
    const excel = XLSX.readFile(path.join(process.cwd(), 'assets', 'FormatoPosulantes.xlsx'));
    
    const nombreHoja = excel.SheetNames; // regresa un array.

    let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);

    return datos;
};

const functionExcel = {
    getExcelJson
};

module.exports = functionExcel;