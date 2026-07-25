# BullVision Master Layer Architecture

## Overview

The Master Layer is responsible for converting trusted external market data into standardized BullVision datasets.

It serves as the bridge between external data providers and the Analytics Engine.

The Master Layer never performs financial calculations.

Its responsibility is to ingest, normalize, validate, and publish master datasets.

---

# Architecture

External Source

↓

Raw Dataset

↓

Normalization

↓

Validation

↓

Master Dataset

↓

Analytics Engine

Each stage has a single responsibility.

---

# Layer Responsibilities

## 1. Raw

Location

master/raw/

Purpose

Stores external datasets exactly as received.

Examples

- Angel One Instrument Master
- NSE Master Lists
- BSE Master Lists

Rules

- Never edit manually.
- Never delete fields.
- Never rename fields.
- Always preserve the original source.

Raw data acts as the immutable source of truth.

---

## 2. Normalized

Location

master/normalized/

Purpose

Transforms raw datasets into BullVision's internal format.

Typical operations include:

- Field renaming
- Type conversion
- Removing irrelevant instruments
- Standardizing symbols
- Standardizing exchange names

Rules

- No calculations.
- No enrichment.
- No validation fixes.

Normalization should only transform structure.

---

## 3. Validated

Location

master/validated/

Purpose

Contains datasets that have successfully passed validation.

Validation includes:

- Required fields
- Unique identifiers
- Duplicate detection
- Schema validation
- Enum validation
- Date validation

Datasets failing validation never move beyond this stage.

---

## 4. Data

Location

master/data/

Purpose

Stores production-ready datasets consumed by BullVision.

Examples

- companies.json
- sectors.json
- benchmarks.json

These files are read-only for the rest of the application.

No service should modify these files directly.

---

# Processing Pipeline

Every dataset follows the same lifecycle.

External Provider

↓

Download

↓

Raw

↓

Normalize

↓

Validate

↓

Production Dataset

↓

Analytics Engine

↓

REST API

↓

Frontend

---

# Scripts

Location

master/scripts/

Purpose

Contains automation scripts.

Examples

- downloadInstrumentMaster.js
- normalizeCompanies.js
- buildBenchmarks.js

Scripts are responsible for moving datasets between stages.

---

# Validators

Location

master/validators/

Purpose

Ensures datasets satisfy BullVision quality standards.

Examples

- companyValidator.js
- benchmarkValidator.js
- sectorValidator.js

Validators never modify data.

They only report errors.

---

# Schemas

Location

master/schemas/

Purpose

Defines the expected structure of every dataset.

Examples

- company.schema.json
- sector.schema.json
- benchmark.schema.json

Schemas act as contracts between the Master Layer and the rest of BullVision.

---

# Documentation

Location

master/docs/

Purpose

Stores technical documentation explaining architecture, workflows, and design decisions.

Documentation should always describe:

- Why something exists.
- How it works.
- Who is responsible for it.

---

# Design Principles

Every component follows one responsibility.

Raw

↓

Normalize

↓

Validate

↓

Publish

No component should perform multiple responsibilities.

---

# Data Ownership

Raw owns the external data.

Normalized owns the transformed data.

Validated owns the verified data.

Data owns the production dataset.

Analytics owns calculations.

Research owns historical knowledge.

---

# Error Handling

If validation fails:

Raw

↓

Normalize

↓

Validation

↓

FAILED

↓

Stop Pipeline

↓

Report Errors

↓

Fix Dataset

↓

Run Again

Production datasets should never contain invalid records.

---

# Future Expansion

The pipeline is designed to support additional datasets without architectural changes.

Future datasets may include:

- ETFs
- Mutual Funds
- REITs
- InvITs
- Global Indices
- Commodities

Each dataset follows the same pipeline.

---

# Architecture Principles

BullVision follows these engineering principles:

- Single Responsibility
- Separation of Concerns
- Immutable Raw Data
- Schema-Driven Validation
- Reproducible Pipelines
- Source Traceability
- Production Safety

Every future dataset must follow this architecture.