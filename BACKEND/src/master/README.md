# BullVision Master Data Layer

## Purpose

The Master Data Layer provides the canonical reference data used throughout BullVision.

Unlike the Research Layer, which stores verified historical market events, the Master Layer stores permanent market metadata such as companies, sectors, benchmarks, and other reference information.

This layer acts as the single source of truth for static market entities.

---

# Responsibilities

The Master Layer is responsible for:

- Maintaining company master data.
- Maintaining sector definitions.
- Maintaining benchmark definitions.
- Normalizing data obtained from trusted external sources.
- Validating all master datasets before they are consumed by the Analytics Engine.

The Master Layer never performs market analysis or financial calculations.

---

# Design Philosophy

BullVision follows four principles for master data:

1. Authenticity
2. Consistency
3. Traceability
4. Reproducibility

All master data must originate from trusted sources and pass validation before becoming part of BullVision.

---

# Data Pipeline

Every dataset follows the same pipeline.

External Source

↓

Raw Data

↓

Normalization

↓

Validation

↓

Master Dataset

↓

Analytics Engine

No dataset should bypass this process.

---

# Folder Structure

master/

raw/
    Original data obtained from external sources.

normalized/
    Cleaned and standardized intermediate datasets.

validated/
    Datasets that have passed validation.

data/
    Production-ready master datasets used by BullVision.

schemas/
    JSON schemas defining dataset structure.

validators/
    Validation scripts for every dataset.

scripts/
    Import and transformation scripts.

docs/
    Technical documentation.

---

# External Data Sources

BullVision uses only trusted sources.

Primary Source:

- Angel One Instrument Master

Secondary Sources (when required):

- NSE India
- BSE India
- Ministry of Corporate Affairs (MCA)

External data is never modified directly.

Instead, it is transformed into BullVision's internal format.

---

# Master Datasets

Examples include:

- companies.json
- sectors.json
- benchmarks.json

Future datasets may include:

- indices.json
- exchanges.json
- etfs.json
- mutualFunds.json

---

# What BullVision Stores

Only permanent reference information.

Examples:

- Company name
- Trading symbol
- ISIN
- Sector
- Industry
- Exchange
- Listing date
- Benchmark

BullVision does not store dynamic market values here.

Examples:

- Current price
- Market capitalization
- PE ratio
- EPS
- RSI
- MACD
- Drawdown
- Recovery
- Volatility

These are calculated or fetched dynamically by other layers.

---

# Validation Policy

Every master dataset must satisfy:

- Schema validation.
- Required fields.
- Unique identifiers.
- Duplicate detection.
- Consistent formatting.

No dataset becomes production-ready until validation succeeds.

---

# Relationship with Other Layers

Research Layer

↓

Master Layer

↓

Analytics Engine

↓

API

↓

Frontend

The Master Layer provides context.

The Research Layer provides historical knowledge.

The Analytics Engine combines both with live and historical market data.

---

# Versioning

Every master dataset includes:

- version
- createdAt
- updatedAt

This ensures compatibility across future BullVision releases.

---

# Future Compatibility

The Master Layer is designed to support:

- BullVision V1 Analytics
- BullVision V2 Machine Learning
- Additional exchanges
- Additional asset classes
- Automated dataset updates

No architectural changes should be required when new datasets are introduced.