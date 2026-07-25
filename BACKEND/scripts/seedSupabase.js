/* Seeds Supabase from the repository's existing version-controlled datasets. */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { supabase } = require("../src/config/supabase");
const { throwIfSupabaseError } = require("../src/utils/supabaseError");

const root = path.join(__dirname, "..");
const chunkSize = 500;

async function upsertInChunks(table, rows, options) {
    for (let index = 0; index < rows.length; index += chunkSize) {
        const { error } = await supabase
            .from(table)
            .upsert(rows.slice(index, index + chunkSize), options);
        throwIfSupabaseError(error, `Could not seed ${table}`);
    }
}

function readJson(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function loadHistoricalPrices() {
    const directory = path.join(root, "src", "market", "generated", "daily");
    if (!fs.existsSync(directory)) return [];

    return fs.readdirSync(directory)
        .filter(file => file.endsWith(".csv"))
        .flatMap(file => {
            const symbol = path.basename(file, ".csv")
                .toUpperCase()
                .replace(/(?:-EQ|[._]NS)$/, "");
            const lines = fs.readFileSync(path.join(directory, file), "utf8")
                .trim().split(/\r?\n/);
            const [, ...records] = lines;
            return records.filter(Boolean).map(line => {
                const [price_date, open, high, low, close, volume] = line.split(",");
                return {
                    symbol,
                    exchange: "NSE",
                    price_date,
                    open,
                    high,
                    low,
                    close,
                    volume,
                    source: "repository-csv",
                };
            });
        });
}

async function seed() {
    const events = readJson("src/market/data/events.json").map(event => ({
        id: event.id, name: event.name, category: event.category,
        country: event.country, start_date: event.startDate, end_date: event.endDate,
        description: event.description, details: {},
    }));
    const companies = readJson("src/master/generated/companies.json").map(company => ({
        id: company.id, name: company.name, listings: company.listings, metadata: {},
    }));

    await upsertInChunks("companies", companies, { onConflict: "id" });
    await upsertInChunks("historical_events", events, { onConflict: "id" });
    const prices = loadHistoricalPrices();
    if (prices.length) {
        await upsertInChunks("historical_prices", prices, { onConflict: "symbol,exchange,price_date" });
    }
    console.log(`Seeded ${companies.length} companies, ${events.length} events, and ${prices.length} prices.`);
}

seed().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
