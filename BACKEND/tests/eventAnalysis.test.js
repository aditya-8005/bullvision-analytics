const {

    analyzeEvent

} = require(

    "../src/analytics/services/eventAnalysisService"

);

const event = {

    id: "global-financial-crisis-2008",

    name: "Global Financial Crisis (2008)",

    category: "GLOBAL",

    severity: "EXTREME"

};

const stockCandles = [

    { date:"2024-01-01",close:100 },

    { date:"2024-01-02",close:120 },

    { date:"2024-01-03",close:150 },

    { date:"2024-01-04",close:130 },

    { date:"2024-01-05",close:90 },

    { date:"2024-01-06",close:95 },

    { date:"2024-01-07",close:110 },

    { date:"2024-01-08",close:151 }

];

const benchmarkCandles = [

    { close:100 },

    { close:95 },

    { close:80 },

    { close:72 }

];

(async()=>{

const result=

await analyzeEvent(

event,

stockCandles,

benchmarkCandles

);

console.log(

JSON.stringify(

result,

null,

4

)

);

})();