function mapHistoricalData(rawData, request) {

    const candles = rawData.data.map((candle) => ({

        date: candle[0],

        open: Number(candle[1]),

        high: Number(candle[2]),

        low: Number(candle[3]),

        close: Number(candle[4]),

        volume: Number(candle[5]),

    }));

    return {

        exchange: request.exchange,

        symbolToken: request.symbolToken,

        interval: request.interval,

        from: request.from,

        to: request.to,

        totalCandles: candles.length,

        candles,

    };

}

module.exports = {
    mapHistoricalData,
};