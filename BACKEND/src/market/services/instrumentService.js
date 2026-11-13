const fs = require('fs');
const path = require('path');

// ─── Enrichment Provider ────────────────────────────────────────────────
let instruments = [];
let symbolMap = new Map();
let aliasesMap = {};

try {
    const aliasPath = path.join(__dirname, '../data/companyAliases.json');
    aliasesMap = JSON.parse(fs.readFileSync(aliasPath, 'utf8'));
} catch (error) {
    console.error("Failed to load companyAliases.json:", error.message);
}

// ─── Lightweight Levenshtein Distance ───────────────────────────────────
function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = b[i - 1] === a[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[b.length][a.length];
}

// ─── Normalized Search Index Builder ────────────────────────────────────
const loadInstruments = (instrumentData) => {
    // Reset collections
    instruments = [];
    symbolMap = new Map();

    // Memory optimization: Only pre-index NSE cash equities (-EQ).
    // Out of ~160k+ instruments in ScripMaster, search and quotes strictly operate
    // on NSE equities (~2,400 scrips). Pre-tokenizing all instruments consumed ~250MB+ heap.
    // Indexing only equities consumes <3MB heap while preserving 100% of search functionality.
    for (let i = 0; i < instrumentData.length; i++) {
        const inst = instrumentData[i];

        if (inst.exch_seg === "NSE" && inst.symbol && inst.symbol.endsWith("-EQ")) {
            const baseSymbol = inst.symbol.replace("-EQ", "").toUpperCase();
            const aliasInfo = aliasesMap[baseSymbol] || { companyName: "", aliases: [] };

            inst.companyName = aliasInfo.companyName;
            inst.aliases = aliasInfo.aliases;

            // Build a flat searchable string
            const searchParts = [baseSymbol, inst.companyName, ...inst.aliases];
            inst._searchIndex = searchParts.join(" ").toLowerCase();

            // Pre-tokenize for fast prefix/word-boundary matching
            inst._searchTokens = inst._searchIndex
                .split(/[\s,.\-&]+/)
                .filter(t => t.length > 0);

            inst._baseSymbol = baseSymbol.toLowerCase();

            instruments.push(inst);

            // Register fast O(1) lookup keys
            symbolMap.set(inst.symbol.toUpperCase(), inst);
            symbolMap.set(baseSymbol, inst);
        }
    }

    console.log(
        `${instruments.length} active NSE equity instruments indexed into memory.`
    );

    return instruments;
};

const findInstrument = (query) => {
    if (!query) return null;
    const cleanQuery = query.trim().toUpperCase();

    // Fast O(1) direct symbol lookup
    if (symbolMap.has(cleanQuery)) {
        return symbolMap.get(cleanQuery);
    }
    const withEq = cleanQuery.endsWith("-EQ") ? cleanQuery : `${cleanQuery}-EQ`;
    if (symbolMap.has(withEq)) {
        return symbolMap.get(withEq);
    }

    const results = searchInstruments(query);
    return results.length === 0 ? null : results[0];
};

// ─── Ranking Engine ─────────────────────────────────────────────────────
function scoreInstrument(inst, searchQuery, queryWords) {
    const baseSymbol = inst._baseSymbol;
    const compName = (inst.companyName || "").toLowerCase();
    const aliases = inst.aliases || [];

    // Tier 1: Exact match (100–90)
    if (baseSymbol === searchQuery) return 100;
    if (aliases.includes(searchQuery)) return 95;
    if (compName === searchQuery) return 90;

    // Tier 2: Prefix match (85–70)
    if (baseSymbol.startsWith(searchQuery)) return 85;
    if (aliases.some(a => a.startsWith(searchQuery))) return 80;
    if (compName.startsWith(searchQuery)) return 75;

    // Tier 3: Word-boundary prefix (each query word starts a token)
    const tokens = inst._searchTokens;
    if (queryWords.every(qw => tokens.some(t => t.startsWith(qw)))) return 65;

    // Tier 4: Substring match (55–40)
    if (queryWords.every(qw => compName.includes(qw))) return 55;
    if (baseSymbol.includes(searchQuery)) return 45;
    if (aliases.some(a => a.includes(searchQuery))) return 40;

    return 0;
}

// ─── Search API ─────────────────────────────────────────────────────────
const searchInstruments = (query) => {
    if (!query) return [];

    const searchQuery = query.toLowerCase().trim();
    if (!searchQuery) return [];

    const queryWords = searchQuery.split(/\s+/).filter(Boolean);

    // Phase 1: Filter candidates — all query words must appear in the index
    const candidates = instruments.filter((instrument) => {
        if (instrument.exch_seg !== "NSE" || !instrument.symbol.endsWith("-EQ")) return false;
        return queryWords.every(qw => instrument._searchIndex.includes(qw));
    });

    // Phase 2: Score and rank
    if (candidates.length > 0) {
        candidates.sort((a, b) => {
            const scoreDiff = scoreInstrument(b, searchQuery, queryWords) -
                              scoreInstrument(a, searchQuery, queryWords);
            if (scoreDiff !== 0) return scoreDiff;
            return a.symbol.localeCompare(b.symbol);
        });
        return candidates.slice(0, 50);
    }

    // Phase 3: Fuzzy fallback — only for single-word queries ≥3 chars
    if (queryWords.length === 1 && searchQuery.length >= 3) {
        const maxDistance = searchQuery.length <= 4 ? 1 : 2;

        const fuzzyResults = instruments
            .filter(inst => inst.exch_seg === "NSE" && inst.symbol.endsWith("-EQ"))
            .map(inst => {
                const baseDist = levenshtein(searchQuery, inst._baseSymbol);
                if (baseDist <= maxDistance) return { inst, dist: baseDist };

                const aliases = inst.aliases || [];
                for (const alias of aliases) {
                    const aliasDist = levenshtein(searchQuery, alias);
                    if (aliasDist <= maxDistance) return { inst, dist: aliasDist };
                }
                return null;
            })
            .filter(Boolean);

        fuzzyResults.sort((a, b) => a.dist - b.dist || a.inst.symbol.localeCompare(b.inst.symbol));
        return fuzzyResults.slice(0, 20).map(r => r.inst);
    }

    return [];
};

module.exports = {
    loadInstruments,
    searchInstruments,
    findInstrument,
};