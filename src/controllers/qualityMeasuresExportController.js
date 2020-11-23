const fs = require("fs");
const tmp = require("tmp");
const PDFDocumentWithTables = require("../util/PDFDocumentWithTables");

async function exportToPDF(req, res) {
    const { dataDescription, data } = req.body;

    const { name: fileName } = tmp.fileSync({
        prefix: "measures",
        postfix: ".pdf",
    });

    const doc = new PDFDocumentWithTables({ layout: "landscape" });

    const fileStream = fs.createWriteStream(fileName);

    doc.pipe(fileStream);

    const table = {
        headers: dataDescription,
        rows: data,
    };
    doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold"),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.end();

    await new Promise((resolve) => {
        fileStream.on("finish", () => resolve());
    });

    res.download(fileName);
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

    return res.download(fileName);
}

module.exports = {
    exportToPDF,
    exportToCSV,
};
