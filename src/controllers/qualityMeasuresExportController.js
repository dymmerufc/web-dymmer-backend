const fs = require("fs");
const tmp = require("tmp");
const PDFDocumentWithTables = require("../util/PDFDocumentWithTables");

function exportToPDF(req, res) {
    const { dataDescription, data } = req.body;

    const { name: fileName } = tmp.fileSync({
        prefix: "measures",
        postfix: ".pdf",
    });

    const doc = new PDFDocumentWithTables({ layout: "landscape" });

    doc.pipe(fs.createWriteStream(fileName));

    const table = {
        headers: dataDescription,
        rows: data,
    };
    doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold"),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.end();

    return res.download(fileName);
}

function exportToCSV(req, res) {
    const { dataDescription, data } = req.body;

    const { name: fileName } = tmp.fileSync({
        prefix: "measures",
        postfix: ".csv",
    });

    let csvStr = `${dataDescription.join(",")}\n`;

    data.forEach((element) => {
        csvStr += `${element.join(",")}\n`;
    });

    fs.writeFileSync(fileName, csvStr);

    return res.download(fileName);
}

module.exports = {
    exportToPDF,
    exportToCSV,
};
