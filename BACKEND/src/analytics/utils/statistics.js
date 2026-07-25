function calculateMean(numbers) {

    if (!Array.isArray(numbers) || numbers.length === 0) {
        throw new Error("Numbers array is required.");
    }

    const sum = numbers.reduce(
        (total, number) => total + number,
        0
    );

    return sum / numbers.length;
}

function calculateVariance(numbers) {

    const mean = calculateMean(numbers);

    const squaredDifferences = numbers.map(number =>
        Math.pow(number - mean, 2)
    );

    return calculateMean(squaredDifferences);
}

function calculateStandardDeviation(numbers) {

    return Math.sqrt(
        calculateVariance(numbers)
    );
}

module.exports = {
    calculateMean,
    calculateVariance,
    calculateStandardDeviation
};