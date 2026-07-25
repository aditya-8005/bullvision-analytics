const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

const { getHistoricalData } = require("../providers/yahooProvider");

async function downloadHistory(symbol, fromDate, toDate) {

    const history = await getHistoricalData(
        symbol,
        fromDate,
        toDate
    );

    const outputDir = path.join(__dirname, "..", "generated", "daily");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${symbol.replace(".", "_")}.csv`;

    const csvWriter = createObjectCsvWriter({

        path: path.join(outputDir, fileName),

        header: [
            { id: "date", title: "DATE" },
            { id: "open", title: "OPEN" },
            { id: "high", title: "HIGH" },
            { id: "low", title: "LOW" },
            { id: "close", title: "CLOSE" },
            { id: "volume", title: "VOLUME" }
        ]
    });

    await csvWriter.writeRecords(history);

    console.log(`Downloaded ${history.length} candles.`);
    console.log(`Saved to ${fileName}`);
}

module.exports = {
    downloadHistory
};