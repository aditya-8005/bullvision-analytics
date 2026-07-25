# BullVision Research Layer

## Overview

The Research Layer is the knowledge foundation of BullVision.

It stores verified historical market events, institutional responses, sector impacts, company impacts, and historical context used by the Analytics Engine.

The Research Layer never performs calculations.

Its responsibility is to provide authentic, structured, and version-controlled historical knowledge that can be consumed by the backend, analytics engine, APIs, and frontend.

---

# Research Philosophy

BullVision follows four fundamental principles.

## 1. Authenticity

Every fact must originate from trusted and verifiable sources.

## 2. Reproducibility

Research should be repeatable and independently verifiable.

## 3. Traceability

Every important claim should be traceable to an official or trusted source.

## 4. Separation of Responsibilities

Research stores historical knowledge.

Analytics calculates financial metrics.

The Research Layer must never store calculated values such as:

- Drawdown
- Recovery
- Recovery Speed
- Volatility
- Relative Performance
- Beta
- Rolling Returns
- Crash Resistance Score
- Stability Score
- Recovery Score

These values are generated dynamically by the Analytics Engine.

---

# Research Workflow

Every historical event follows the same lifecycle.

Research

↓

Verification

↓

Production JSON

↓

Schema Validation

↓

Backend Integration

↓

Analytics Engine

↓

REST API

↓

Frontend

No event should bypass this workflow.

---

# Folder Structure

```
research/

│
├── events/
│      Production historical event dataset.
│
├── loaders/
│      Loads research events into memory.
│
├── validators/
│      Validates research dataset.
│
├── services/
│      Provides research data to backend services.
│
├── schema.json
│      Official BullVision Historical Event Schema.
│
└── README.md
      Documentation for the Research Layer.
```

---

# Historical Dataset

BullVision Historical Knowledge Base Version 1.0 consists of the following verified historical events.

1. 1992 Harshad Mehta Scam
2. 2000 Dot-com Bubble
3. 2008 Global Financial Crisis
4. 2013 Taper Tantrum
5. 2016 Demonetization
6. 2020 COVID-19 Market Crash
7. 2022 Russia–Ukraine War

Every event follows the same production schema.

---

# Naming Convention

Every event file follows the format:

```
YYYY-event-name.json
```

Examples:

```
1992-harshad-mehta.json

2000-dot-com-bubble.json

2008-global-financial-crisis.json

2013-taper-tantrum.json

2016-demonetization.json

2020-covid-crash.json

2022-russia-ukraine-war.json
```

Event IDs should always match the filename.

---

# Event Structure

Every production event must contain the following sections.

- Metadata
- Identity
- Timeline
- Historical Context
- Root Causes
- Market Impact
- Economic Impact
- Government Response
- Central Bank Response
- Regulatory Changes
- Sector Analysis
- Company Impact
- Structural Legacy
- Benchmark
- Related Content
- Analytics Configuration
- UI Metadata
- References
- Verification

Every event must conform to the official `schema.json`.

---

# Data Sources

BullVision uses only trusted and verifiable sources.

## Primary Sources

- Reserve Bank of India (RBI)
- Securities and Exchange Board of India (SEBI)
- National Stock Exchange (NSE)
- Bombay Stock Exchange (BSE)
- Ministry of Finance
- Government of India
- RBI Monetary Policy Reports
- RBI Annual Reports
- Government Economic Survey

## International Sources

- International Monetary Fund (IMF)
- World Bank
- Asian Development Bank (ADB)

## Market Data Provider

- Angel One SmartAPI

Secondary sources may provide additional context but must never override official information.

Examples include:

- Reuters
- Bloomberg
- Official exchange publications

---

# Analytics Pipeline

The Research Layer provides structured knowledge to the Analytics Engine.

```
Historical Event

↓

Historical Price Data

↓

Analytics Engine

↓

Drawdown

↓

Recovery

↓

Volatility

↓

Relative Performance

↓

Scores

↓

REST API

↓

Frontend
```

Research never performs calculations.

Analytics never stores historical knowledge.

---

# Validation Rules

Every production event must satisfy the following requirements.

- Valid JSON
- Valid schema
- Unique Event ID
- Unique Display Order
- Complete Timeline
- Verified References
- Benchmark Defined
- Metadata Present
- Verification Object Present

Every event must pass validation before becoming part of the production dataset.

---

# Verification Policy

Each event must include:

- At least one official source.
- Verified historical timeline.
- Correct benchmark.
- Accurate sector classification.
- Verified institutional responses.
- Company impact where applicable.
- Confidence level.

Events remain unpublished until manually reviewed.

---

# Versioning

Every production event contains:

- version
- createdAt
- updatedAt
- status

Research documents follow semantic versioning.

Examples:

```
1.0.0
1.1.0
2.0.0
```

---

# Future Compatibility

The Research Layer has been designed to support future BullVision releases without requiring structural redesign.

Supported future modules include:

- BullVision V1 Analytics
- BullVision V2 Machine Learning
- Event Prediction
- AI Research Assistant
- Additional Historical Events
- Additional Benchmarks
- Sector Knowledge Base
- Company Knowledge Base
- Global Market Expansion

---

# Engineering Principles

The Research Layer should remain completely independent from business logic.

Never hardcode research inside controllers, services, or analytics modules.

Correct architecture:

```
Research JSON

↓

Loader

↓

Research Service

↓

Analytics Engine

↓

REST API

↓

Frontend
```

Adding a new historical event should only require:

1. Research
2. Production JSON
3. Validation

No backend code changes should be necessary.

---

# BullVision Research Layer Status

Current Status:

```
Schema Version : 1.0

Historical Dataset : Version 1.0

Research Methodology : Complete

Production Dataset : In Progress

Validation System : Pending

Backend Integration : Pending
```

The Research Layer serves as the single source of truth for all historical market knowledge within BullVision.