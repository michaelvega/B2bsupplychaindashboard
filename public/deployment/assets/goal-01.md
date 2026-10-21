# Goal 01: Get the average home value for a trade area

> Status: pending review · Source: user interviews + conversation logs · Owner: Analyst persona

## What the user is trying to do

Ask for the average home value in a trade area and get one clear number back, for the right time period, without having to say which area or period again on the next question.

## Evidence

- Seen in 11 of 44 analyst conversations (sample data, for illustration).
- Typical ask: "What is the average home value around 123 Main St?"
- Today's failure: the assistant asks which data source to use, or returns a number with no zone or date attached.

## What "done" looks like

1. The answer names the trade area and the time period it covers.
2. A follow-up ("and last year?") reuses the same area without repeating the address.
3. The number can be traced to the data it came from.

## Proposed change for the coding agent

- Add a default trade-area lookup that resolves the area from conversation context.
- Return the zone, period and source with every number.
- Add an eval that replays this goal and checks all three points above.

## Risks

- Ambiguous addresses may resolve to the wrong area; ask once when confidence is low.

*Illustrative file for the demo. Not real customer data.*
