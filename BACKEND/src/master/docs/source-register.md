# BullVision Source Register

## Purpose

This document maintains the official registry of all external data sources used by BullVision.

Each source is documented before it becomes part of the data pipeline.

This ensures traceability, reproducibility, and maintainability.

---

# Source 001

Name

Angel One Instrument Master

Status

Primary Source

Purpose

Provides the complete list of tradable instruments available through Angel One SmartAPI.

Used For

- Company discovery
- Symbol mapping
- Token mapping
- Exchange identification
- Instrument identification

Access Method

HTTP GET

Source URL

https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json

Authentication

None

File Format

JSON

Top Level Structure

Array

Approximate Size

~52 MB (may change over time)

Update Frequency

Maintained by Angel One.
BullVision assumes the dataset may change without prior notice.

Raw Storage

src/master/raw/angel/OpenAPIScripMaster.json

Pipeline

External Source

↓

Raw

↓

Normalized

↓

Validated

↓

Production

Current Status

Downloaded

Verified

Ready for Data Discovery

Notes

This is an Instrument Master, not a Company Master.

The dataset contains multiple asset classes including indices, equities, derivatives, and other instruments.

BullVision will derive its internal Company Master from this dataset rather than using it directly.