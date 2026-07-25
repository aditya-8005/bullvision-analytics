const { supabase } = require("../../config/supabase");
const { throwIfSupabaseError } = require("../../utils/supabaseError");
const { getHistoricalData } = require("../providers/yahooProvider");

function normalizeSymbol(symbol) {
    return symbol
        .trim()
        .toUpperCase()
        .replace(/(?:-EQ|[._]NS)$/, "");
}

function toYahooSymbol(symbol) {
    return `${normalizeSymbol(symbol)}.NS`;
}

function nextDate(date) {
    const value = new Date(`${date}T00:00:00.000Z`);
    value.setUTCDate(value.getUTCDate() + 1);
    return value.toISOString().slice(0, 10);
}

function toCandle(row) {
    return {
        date: row.price_date,
        open: row.open === null ? null : Number(row.open),
        high: row.high === null ? null : Number(row.high),
        low: row.low === null ? null : Number(row.low),
        close: Number(row.close),
        volume: row.volume === null ? null : Number(row.volume),
    };
}

/**
 * Estimate the minimum number of trading-day rows we should expect
 * from the Supabase cache for a given date range. Uses ~65% of
 * calendar days as a rough approximation of trading days, with a
 * floor of 2 (the minimum the analytics calculators require).
 */
function expectedMinRows(startDate, endDate) {
    const calendarDays = Math.round(
        (new Date(endDate) - new Date(startDate)) / 86400000
    );
    return Math.max(Math.round(calendarDays * 0.65), 2);
}

async function getHistory(symbol) {
    const normalizedSymbol = normalizeSymbol(symbol);

    const toDate = new Date().toISOString().slice(0, 10);
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 10);
    const fromDateStr = fromDate.toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from("historical_prices")
        .select("price_date, open, high, low, close, volume")
        .eq("symbol", normalizedSymbol)
        .order("price_date");
    throwIfSupabaseError(error, "Could not load historical prices");

    const minRows = expectedMinRows(fromDateStr, toDate);
    if (data.length >= minRows) {
        return data.map(toCandle);
    }

    return fetchAndCacheHistory(normalizedSymbol, fromDateStr, toDate);
}

async function getHistoryBetween(symbol, startDate, endDate) {
    const normalizedSymbol = normalizeSymbol(symbol);
    const { data, error } = await supabase
        .from("historical_prices")
        .select("price_date, open, high, low, close, volume")
        .eq("symbol", normalizedSymbol)
        .gte("price_date", startDate)
        .lte("price_date", endDate)
        .order("price_date");
    throwIfSupabaseError(error, "Could not load historical prices");

    const minRows = expectedMinRows(startDate, endDate);
    if (data.length >= minRows) {
        return data.map(toCandle);
    }

    return fetchAndCacheHistory(normalizedSymbol, startDate, endDate);
}

async function getPriceOnDate(symbol, date) {
    const normalizedSymbol = normalizeSymbol(symbol);
    const { data, error } = await supabase
        .from("historical_prices")
        .select("price_date, open, high, low, close, volume")
        .eq("symbol", normalizedSymbol)
        .eq("price_date", date)
        .maybeSingle();
    throwIfSupabaseError(error, "Could not load historical price");

    if (data) {
        return toCandle(data);
    }

    const candles = await fetchAndCacheHistory(
        normalizedSymbol,
        date,
        nextDate(date)
    );

    return candles.find(candle => candle.date === date) || null;
}

async function fetchAndCacheHistory(symbol, fromDate, toDate) {
    const candles = await getHistoricalData(
        toYahooSymbol(symbol),
        fromDate,
        toDate
    );

    if (!candles.length) {
        return [];
    }

    const rows = candles.map(candle => ({
        symbol,
        exchange: "NSE",
        price_date: candle.date,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
        source: "yahoo-finance",
    }));

    const { error } = await supabase
        .from("historical_prices")
        .upsert(rows, { onConflict: "symbol,exchange,price_date" });
    throwIfSupabaseError(error, "Could not cache historical prices");

    return candles;
}

module.exports = {
    getHistory,
    getHistoryBetween,
    getPriceOnDate
};
