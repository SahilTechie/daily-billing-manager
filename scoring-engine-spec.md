# Scoring Engine Spec (Collections Priority)

## Purpose
Define a simple score to prioritize pending customer follow-ups in MVP.

## Why Needed
The owner needs to quickly identify which pending accounts to contact first.

## Inputs
- `pendingAmount` (required)
- `daysSinceLastPayment` (optional, if payment history exists)
- `daysSinceLastBill` (optional)

## Scoring Model (MVP Simple)
Base score from pending amount only:

- `score = min(100, round((pendingAmount / 5000) * 100))`

Optional enhancement (if dates available):
- `score = min(100, base + paymentDelayBonus + billRecencyBonus)`
- `paymentDelayBonus = min(20, floor(daysSinceLastPayment / 7))`
- `billRecencyBonus = min(10, floor(daysSinceLastBill / 15))`

## Buckets
- 80-100: High Priority
- 50-79: Medium Priority
- 0-49: Low Priority

## API/Usage Contract
- Computed on read for pending list (no write needed)
- Returned fields:
  - `pendingAmount`
  - `score`
  - `priorityBucket`

## Sample
If `pendingAmount = 3500`:
- Base = `round((3500/5000)*100)=70`
- Priority = Medium

## Constraints
- Keep deterministic and explainable
- No ML model in MVP
- No external dependency required