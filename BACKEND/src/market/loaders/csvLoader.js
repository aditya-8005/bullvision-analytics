const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const AppError = require("../../errors/AppError");

async function loadHistory(filePath) {

    return new Promise((resolve, reject) => {

        // Check if CSV exists before creating the stream
        if (!fs.existsSync(filePath)) {

            const symbol = path.basename(filePath, ".csv");

            return reject(
                new AppError(
                    `Historical data for '${symbol}' not found.`,
                    404
                )
            );

        }

        const candles = [];

        const stream = fs.createReadStream(filePath);

        stream.on("error", (err) => {
            reject(err);
        });

        stream
            .pipe(csv())
            .on("data", (row) => {

                candles.push({
                    date: row.DATE,
                    open: Number(row.OPEN),
                    high: Number(row.HIGH),
                    low: Number(row.LOW),
                    close: Number(row.CLOSE),
                    volume: Number(row.VOLUME)
                });

            })
            .on("end", () => {
                resolve(candles);
            })
            .on("error", (err) => {
                reject(err);
            });

    });

}

module.exports = {
    loadHistory
};