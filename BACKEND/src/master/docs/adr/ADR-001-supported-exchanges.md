# ADR-001: Supported Exchanges for BullVision V1

## Status

Accepted

## Context

The Angel One Instrument Master contains instruments from multiple exchange segments including:

- NSE
- BSE
- NFO
- BFO
- CDS
- MCX
- NCDEX
- NCO

BullVision V1 is designed as an Indian Stock Market Analytics Platform focused on cash equity analysis.

## Decision

BullVision V1 will process only:

- NSE Cash Equities
- BSE Cash Equities

The following exchange segments are excluded from V1:

- NFO
- BFO
- CDS
- MCX
- NCDEX
- NCO

## Consequences

The Master Layer importer will ignore all non-equity exchange segments.

Future versions may introduce support for derivatives, commodities, and currency markets without changing the Master Layer architecture.