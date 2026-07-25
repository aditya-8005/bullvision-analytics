# BullVision Market Layer

## Purpose

The Market Layer is responsible for market price data.

Unlike the Master Layer, which answers:

> "What is a company?"

the Market Layer answers:

> "What happened to the company's market price over time?"

---

## Responsibilities

- Download historical market data.
- Validate downloaded data.
- Store normalized OHLC datasets.
- Provide historical data to Analytics Layer.
- Remain independent from UI and APIs.

---

## Inputs

Company Service

External Market Data Providers

---

## Outputs

Historical OHLC datasets

Analytics-ready market data

---

## Pipeline

Provider

↓

Downloader

↓

Validator

↓

Storage

↓

Analytics