const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const { totalOrdersSum } = require("../common/totalSum");

const createPdf = (data, fields) => {

  let doc = new PDFDocument({ margin: 30, size: 'A4' });
  // save document

  doc.pipe(fs.createWriteStream("./document.pdf"));

  // doc.pipe(res); 

  let labels = []


  fields.forEach(item => {
    labels.push({ label: item, property: item, renderer: null, headerColor: 'green', align: 'center', width: (item === "email" ? 150 : 60) })
  })

  let totalSum = totalOrdersSum(data);


  (async function createTable() {
    // table
    const table = {
      title: 'Statistics',
      headers: labels,
      datas: [...data, { totalSum: totalSum }],
    };

    await doc.table(table, {
      divider: {
        header: { disabled: false, width: 2, opacity: 1 },
        horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
      },
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {

        doc.font("Helvetica").fontSize(8);
        indexColumn === fields.length - 1 && doc.addBackground(rectCell, 'blue', 0.15);

        const { x, y, width, height } = rectCell;

        if (indexColumn === 0 || indexRow !== data.length || indexColumn === fields.length - 1) {
          doc
            .lineWidth(.5)
            .moveTo(x, y)
            .lineTo(x, y + height)
            .stroke();
        }

        if (indexColumn === fields.length - 1) {
          doc
            .lineWidth(.5)
            .moveTo(x + width, y)
            .lineTo(x + width, y + height)
            .stroke();
        }


      },
    });
    // doc.pipe(res);
    // return doc

    return doc.end();
  })();
}

module.exports = { createPdf }