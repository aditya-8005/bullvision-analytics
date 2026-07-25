# BullVision Master Data Governance

## Purpose

The Master Layer depends on external data providers.

This document defines how BullVision acquires, validates, versions, and maintains master datasets while preserving data integrity.

The goal is to ensure that every production dataset is reproducible, traceable, and trustworthy.

---

# Source Hierarchy

BullVision follows a strict source priority.

Primary Source

- Angel One Instrument Master

Secondary Sources

- NSE India
- BSE India

Reference Sources

- Ministry of Corporate Affairs (MCA)

When multiple sources provide the same field, the higher-priority source takes precedence unless explicitly overridden.

---

# Source of Truth

BullVision never edits external datasets.

External data is always stored unchanged inside:

master/raw/

All transformations occur after the raw stage.

---

# Dataset Lifecycle

Every master dataset follows this lifecycle.

External Source

↓

Raw

↓

Normalized

↓

Validated

↓

Production

Only validated datasets are allowed into production.

---

# Versioning

Every production dataset contains metadata.

Example

version

createdAt

updatedAt

source

generator

This allows BullVision to reproduce any dataset in the future.

---

# Regeneration Policy

Production datasets may only be regenerated when:

- External source is updated.
- Schema changes.
- Validation rules change.
- Import pipeline changes.
- Manual approval is provided.

Datasets should never regenerate automatically during normal application execution.

---

# Schema Evolution

If an external provider changes its format:

Do not patch the production dataset manually.

Instead:

Update Normalizer

↓

Run Validation

↓

Generate New Dataset

↓

Review

↓

Publish

Schemas always evolve before production datasets.

---

# Validation Policy

Every dataset must pass:

- Schema validation
- Required field validation
- Duplicate detection
- Enum validation
- Type validation
- Business rule validation

Validation failures stop the pipeline immediately.

---

# Immutability

Raw datasets are immutable.

Production datasets are treated as read-only.

Application code must never modify production datasets.

---

# Traceability

Every production dataset must be traceable back to:

- Source
- Download date
- Generator version
- Schema version

No production dataset should exist without provenance.

---

# Change Management

Changes to:

Schemas

Validators

Normalizers

Import scripts

must be reviewed before regenerating production datasets.

---

# Error Handling

Pipeline failure should never produce partial output.

If validation fails:

Discard generated dataset.

Log all validation errors.

Fix the issue.

Regenerate.

---

# Auditability

BullVision should always be able to answer:

Where did this data originate?

When was it downloaded?

Which schema validated it?

Which generator produced it?

Which version is currently deployed?

---

# Future Compatibility

The governance model is designed to support:

Additional exchanges

Additional brokers

Additional asset classes

International markets

without changing the pipeline architecture.

---

# Engineering Principles

BullVision follows:

Authenticity

Traceability

Reproducibility

Immutability

Deterministic Builds

Single Source of Truth

Separation of Concerns