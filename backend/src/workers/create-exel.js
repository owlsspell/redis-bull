const fs = require("fs");
const XLSX = require("xlsx");
const { totalOrdersSum } = require("../common/totalSum");

const createExel = (data, fields) => {
  // console.log('data', data);

  const rows = data.map(row => {
    let filtered = fields.map(field => ({ [field]: row[field] }))
    return Object.assign(...filtered)
  })

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();


  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const noRows = range.e.r;
  const noCols = range.e.c;
  const cellRef = XLSX.utils.encode_cell({ c: noCols, r: noRows + 1 });

  let totalSum = totalOrdersSum(data);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");
  XLSX.utils.sheet_add_aoa(worksheet, [fields], { origin: "A1" });
  XLSX.utils.sheet_add_aoa(worksheet, [[totalSum]], { origin: cellRef });


  let widthCol = fields.map((field) => {

    let colLength = field.toString().length;
    let max_width

    rows.forEach((row) => {
      if (row[field].length > colLength) {
        return max_width = row[field].length
      } else {
        return max_width = colLength
      }
    });
    return { wch: max_width }
  })

  worksheet["!cols"] = widthCol;

  XLSX.writeFile(workbook, "Statistics.xlsx");
}

module.exports = { createExel }