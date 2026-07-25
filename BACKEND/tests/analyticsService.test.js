const {
    generateAnalytics,
} = require("../src/analytics/services/analyticsService");

const history = [

    { date: "2024-01-01", close: 100, high: 100, low: 100, volume: 1000 },

    { date: "2024-01-02", close: 120, high: 120, low: 120, volume: 1200 },

    { date: "2024-01-03", close: 150, high: 150, low: 150, volume: 1500 },

    { date: "2024-01-04", close: 130, high: 130, low: 130, volume: 1300 },

    { date: "2024-01-05", close: 90, high: 90, low: 90, volume: 900 },

    { date: "2024-01-06", close: 95, high: 95, low: 95, volume: 950 },

    { date: "2024-01-07", close: 110, high: 110, low: 110, volume: 1100 },

    { date: "2024-01-08", close: 130, high: 130, low: 130, volume: 1300 },

    { date: "2024-01-09", close: 145, high: 145, low: 145, volume: 1450 },

    { date: "2024-01-10", close: 151, high: 151, low: 151, volume: 1510 }

];

const analytics = generateAnalytics(history);

console.log(JSON.stringify(analytics, null, 4));