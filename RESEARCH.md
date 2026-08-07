# SensorySpaces - Data Research & Sources

This document tracks potential data sources for sensory-friendly events and locations, as identified in the research phase.

## 1. Government Open Data APIs
- **Data.gov (US)**: Metadata for government datasets (events, community listings, parks, facilities).
- **Data.gov.uk (UK)**: Open datasets across many categories.
- **Colorado Information Marketplace**: State-level open data for community events/locations.
- **US Census Bureau**: Geographic and demographic context for location filtering.

## 2. Public API Directories
- **GitHub "public-apis" list**: General directory for finding location/event endpoints.
- **GitHub "free-public-apis"**: Curated city and governmental open data.
- **PublicAPIs.io**: Searchable directory filtered by category.

## 3. Event-Specific APIs
- **OpenWeb Ninja Real-Time Events**: Aggregated public event details (Free tier available).
- **Ticketmaster Discovery API**: The primary source for national tours, theater (relaxed performances), and arena events.
- **Fáilte Ireland Events**: Open event listings via API/CSV (Repurposable example).

## 4. Community & Organization Sources (Manual/Scraping)
- **Autism Speaks**: Event submission page (needs scraper/ingestion).
- **Autism Action Partnership**: Sensory-focused events calendar (HTML/ICS).
- **Mobilizon**: Open-source event platform for hosting/managing proprietary datasets.

## Integration Strategy

1. **Phase 2.1: Discovery & Normalization**
   - Query government catalogs (Data.gov) for "sensory", "quiet", "ASD", "parks", "libraries".
   - Test OpenWeb Ninja API with ASD-specific keyword filters.
2. **Phase 2.2: Scraper Development**
   - Build lightweight scrapers for Autism Speaks and high-value community calendars.
3. **Phase 2.3: Data Enrichment**
   - Merge disparate sources into the SensorySpaces backend format.
   - Initial verification process for "Verified" badge.
