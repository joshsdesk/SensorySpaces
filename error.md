# Error Log & Regression Prevention

This document tracks significant bugs, their root causes, fixes, and the tests added to prevent regressions.

| ID | Problem Description | Root Cause | Fix Summary | Test Added/Updated |
|---|---|---|---|---|
| SS-001 | Seed data validation failed | 'Crowd Controlled' was used in `seedEvents.js` but was not in the `Event` model enum. | Updated `seedEvents.js` to use `Low Crowds`. | Mongoose enum validation now protects this. |
| | | | | |

## Detailed Error History

<!-- Add detailed write-ups here -->
