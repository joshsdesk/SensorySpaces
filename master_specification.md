# SensorySpaces — Master Application Specification (Ultimate - AI Complete)

> **STATUS**: ACTIVE DEVELOPMENT
> **VERSION**: 3.0.0 (Ultimate AI-Complete)
> **DATE**: 2026-01-14

---

## SECTION 1 — RESEARCH & VALIDATION

### 1.1 Market Analysis
The market for accessibility tools is growing, but specifically tailored tools for the ASD community remain fragmented.
- **Trend**: Increased awareness of sensory-friendly needs (Sensory Hours at museums, cinema screenings).
- **Gap**: No centralized, mobile-first platform that aggregates specialized "Sensory-friendly" data from both public APIs and community submissions.

### 1.2 Competitor Evaluation
- **Autism Speaks Directory**: Large dataset, but poor mobile experience and clunky UI.
- **Google Maps**: General accessibility tags available, but lacks granular "Sensory" filters (noise, lighting, crowd density).
- **SensorySpaces Advantage**: Mobile-first, real-time weather/environmental integration, and a specialized "Data Normalization" layer that finds sensory hours in government datasets.

### 1.3 Target Persona & "Aha!" Moment
- **Persona**: "The Prepared Parent" — Parents/Guardians of children with ASD who avoid outings due to environmental unpredictability.
- **"Aha!" Moment**: Seeing a "Calm Window" forecast for a museum, confirming that noise, light, and crowds will be within the child's tolerance range *before* they leave the house.

### 1.4 MVP Hypothesis
By shifting from an "Event Directory" to a "Sensory-Attribute Discovery System," we can unlock 10x more inventory by inferring sensory conditions from standard event data, rather than waiting for venues to self-label.

---

## SECTION 2 — APP IDENTITY, OVERVIEW & BRAND SOUL

### 2.1 Identity & Mission
- **App Name**: SensorySpaces
- **Tagline**: Find Your Safe Space.
- **Mission**: To make the world predictable and accessible for neurodivergent families.

### 2.2 Brand Personality
- **Vibe**: Calming, Trustworthy, Premium, Inclusive.
- **Tone of Voice**: Empathetic, clear, and professional.

### 2.3 Visual Identity & Assets
- **Logo Concept**: "Sensory Bridge" — A minimalist 'S' formed by interlocking waves.
- **Primary Colors**: Lavender (`#5E35B1`) and Calming Blue (`#64B5F6`).
- **Standardized Assets**:
    - `client/assets/logo_light.png`: Primary logo for light backgrounds.
    - `client/assets/logo_dark.png`: Primary logo for dark backgrounds.
    - `client/assets/logo_transparent.png`: Transparent variant for UI overlays.
    - `client/assets/icon.png`: Square app icon.
    - `client/assets/splash-icon.png`: Splash screen asset.

---

## SECTION 3 — USER FLOWS & FUNCTIONALITY

### 3.1 Core Workflows
1. **The "Explore & Filter" Loop**: User searches for "Museums" (Denver Focus) -> Filters by "Quiet Hours" -> Views "Sensory Profile" -> Checks "Weather/Crowd Forecast".
2. **The "Personalization" Onboarding**: Parent inputs anonymous child attributes -> Search results are badged with matches.
3. **The "Profile & Organization" Loop**: User saves event -> Item appears in "Saved Events" & "Calendar".
4. **The "Offline Safe-Space" Loop**: User accesses "Saved Events" offline (AsyncStorage).

---

## SECTION 3.1 — ACCESS CONTROL & PERMISSIONS (RBAC)

### 3.1.1 User Roles
- **Guest**: Browse public events, view base sensory info.
- **Guardian (Member)**: Save events, create child profiles, submit reviews.
- **Admin**: Verify submissions, moderate reviews, configure ingestion.

### 3.1.2 Permission Matrix
| Feature | Guest | Guardian | Admin |
| :--- | :---: | :---: | :---: |
| Search Events | R | R | R |
| View Sensory Details | R | R | R |
| Save Events | - | CRUD | CRUD |
| Submit New Spaces | - | C | CRUD |
| Verify Submissions | - | - | U |

---

## SECTION 4 — UI/UX DESIGN & VISUAL ASSETS

### 4.1 Layout & Components
- **Framework**: Expo / React Native.
- **Design System**: 
    - **Header**: Glassmorphic search bar with integrated weather widget.
    - **Cards**: `AppCard` (Rounded 24px, subtle shadows).
    - **Buttons**: `AppButton` (Pill-shaped, `#5E35B1`).
    - **Blur**: `expo-blur` for premium overlays.

### 4.2 Accessibility (WCAG)
- **Contrast**: High-contrast mode toggle.
- **Typography**: Min 16pt body, 28pt titles.

---

## SECTION 4.1 — SYSTEM STATES & MICRO-INTERACTIONS

### 4.1.1 Loading & Performance
- **Skeleton Screens**: During event fetching.
- **Optimistic UI**: Immediate feedback on "Save".

### 4.1.2 Feedback Loop
- **Error Handling**: Global `ErrorBoundary`.
- **Success Anims**: Haptic feedback on interactions.

---

## SECTION 5 — TECHNICAL SPECIFICATIONS + CLEAN-CODE STANDARDS

### 5.1 Architecture
- **Frontend**: React Native (Expo), Redux Toolkit.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose) with `2dsphere` indexing.
- **API**: Axios with centralized error handling.

### 5.2 Data Model (Layer A vs Layer B)
- **Layer A (Metadata)**: `title`, `venue`, `date` (Standard details).
- **Layer B (Sensory Profile)**: `noiseLevel`, `lighting`, `crowdDensity` (Derived/Asserted).
- **Provenance**: Each attribute tracks `source`, `confidence`, `status`, `version`.

---

## SECTION 5.1 — THIRD-PARTY ECOSYSTEM & INTEGRATIONS
- **Weather**: Open-Meteo.
- **Events**: PredictHQ, Google Places (Ingestion).
- **Auth**: Supabase Auth (Planned).

---

## SECTION 5.2 — DATA PIPELINE & SOURCE LOGISTICS

### 5.2.1 Data Ownership
- **User-Generated**: Event submissions, reviews.
- **Admin-Managed**: Venue Baselines, Static Seeds.
- **AI-Derived**: Inferred attributes (Noise/Components).

### 5.2.2 Ingestion Strategy
1. **Source**: APIs (PredictHQ) + Seed Scripts.
2. **Normalization**: `dataNormalizer.js` maps raw data to Layer A.
3. **Enrichment**: `SensoryInferenceEngine` populates Layer B.

---

## SECTION 6 — AI SYSTEM ARCHITECTURE (SENSORY INFERENCE)

### 6.1 Role & Implementation
- **Role**: Authoritative (but human-overridable) inference of sensory conditions.
- **Implementation**: Rule-based Deterministic/Hybrid Engine (`SensoryInferenceEngine.js`).
- **Input**: Title, Description, Venue Name.
- **Output**: Sensory Profile (Noise, Light, Crowd).

### 6.2 Conflict Resolution Matrix
priority: `Human > StrongNLP > Baseline > WeakNLP`.
- **Tie-breaker**: Higher confidence wins.

### 6.3 Confidence Scoring
`Confidence = (SourceWeight * MatchStrength) * DecayFactor`
- **Weights**: Human(1.0), StrongNLP(0.8), Baseline(0.6), WeakNLP(0.3).
- **Decay**: If `lastUpdatedAt > 180 days` and not verified, apply `0.85` decay factor.

### 6.4 Governance & Ops
- **Versioning**: `inference.version` tracks logic updates.
- **Reprocessing**: Batch job `reprocessInference.js` updates old events when Logic V2 is deployed.
- **Rollback**: Legacy tags preserved for safety.

---

## SECTION 7 — DEVOPS, INFRASTRUCTURE & CI/CD

### 7.1 Environment
- **Hosting**: Vercel (API potential) / Railway.
- **DB**: MongoDB Atlas.

### 7.2 CI/CD
- **Pipeline**: Jest Tests -> Linting -> EAS Build.
- **Migration**: `migrate_inference_v2.js` for schema updates.

---

## SECTION 8 — TESTING & QUALITY ASSURANCE

### 8.1 Strategy
- **Golden Dataset**: `golden_events.json` (50+ ambiguous cases) to prevent regression.
- **Unit**: Test `computeConfidence` math.
- **Integration**: Verify `dataNormalizer` -> `InferenceEngine` flow.

---

## SECTION 9 — PERFORMANCE OPTIMIZATION & SCALABILITY

### 9.1 Benchmarks
- **Search**: < 500ms (Geo + Text Index).
- **Startup**: < 3s.

---

## SECTION 10 — DATA PRIVACY, COMPLIANCE & USER DATA POLICY

### 10.1 Privacy (Strict Shielding)
- **Zero-PII**: No child names/DOB stored remotely.
- **Local-Only**: Personalization logic runs on device.

---

## SECTION 11 — AI CODE & ASSET GENERATION PROMPTS

### 11.1 Branding
- Use `#5E35B1` (Lavender) and `#64B5F6` (Blue).
- Glassmorphic UI styles.

---

## SECTION 12 — MONETIZATION & MARKETING
- **Freemium**: Core search is free.
- **Premium**: "Historical Insights", Ad-free.

---

## SECTION 13 — FUTURE ENHANCEMENTS & EDGE CASES
- **Q1 2026**: Denver Beta -> Nationwide.
- **Edge Case**: "Conflicting Reviews" -> Use Shadow Score logic to resolve.

---

## SECTION 13.1 — EXECUTION & HANDOFF CONTRACT
**Project Output Tree**:
- `/server/src/services/SensoryInferenceEngine.js` (AI Core)
- `/server/src/models/Event.js` (Schema V2)
- `/server/scripts/reprocessInference.js` (Ops)

**Human Decision Gates**:
- Baseline Registry Edits.
- Golden Dataset Approval.

---

## SECTION 14 — DELIVERABLE SUMMARY
- [x] Master Spec V3 (This Document)
- [x] Sensory Inference Engine
- [x] Venue Baseline Registry
- [x] Refactored Event Schema (Layer A/B)
- [x] Reprocessing Ops Script

---

## SECTION 15 — FINAL FIVE QUESTIONS
1. Which verified "Human" users should have admin override power? (Trusted Verifiers)
2. What is the explicit threshold for "High Confidence" on the UI badge? (0.8?)
3. Should we auto-hide events with "Status: Unknown" or just deprioritize them?
4. Do we need a "Report Inaccuracy" button on the Event Detail screen immediately?
5. Should "Venue Baselines" be localized by time of day (e.g., Library is loud during 'Storytime')?

---
**END OF MASTER SPECIFICATION**