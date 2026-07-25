/**
 * Maps Angel One quote data to BullVision's internal quote model.
 *
 * @param {Object} quote - Raw quote returned by Angel One
 * @param {Object} instrument - Instrument from Instrument Master
 * @returns {Object}
 */
const mapQuote = (quote, instrument) => {
    return {
        symbol: instrument.name,
        tradingSymbol: instrument.symbol,
        exchange: instrument.exch_seg,
       

        price: quote.ltp,

        open: quote.open,
        high: quote.high,
        low: quote.low,
        previousClose: quote.close,

        change: quote.netChange,
        changePercent: quote.percentChange,

        averagePrice: quote.avgPrice,

        volume: quote.tradeVolume,

        lastTradeQuantity: quote.lastTradeQty,

        fiftyTwoWeekHigh: quote["52WeekHigh"],
        fiftyTwoWeekLow: quote["52WeekLow"],

        lowerCircuit: quote.lowerCircuit,
        upperCircuit: quote.upperCircuit,

        totalBuyQuantity: quote.totBuyQuan,
        totalSellQuantity: quote.totSellQuan,

        marketDepth: quote.depth,

        exchangeFeedTime: quote.exchFeedTime,
        exchangeTradeTime: quote.exchTradeTime,
    };
};

module.exports = {
    mapQuote,
};