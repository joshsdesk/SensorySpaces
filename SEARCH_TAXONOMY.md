# SensorySpaces — Real-World Search Taxonomy Integration

## Overview

This document catalogs the **community-driven search phrases** and **preference filters** integrated into SensorySpaces based on real parent search patterns from autism support communities, forums, and event listings.

---

## Onboarding Questionnaire (8 Questions)

### Q1: What is your child's preferred noise level?
**Options:**
- [ ] Quiet (Libraries, private viewings)
- [ ] Moderate (Museums, cafes)
- [ ] Lively (Concerts, festivals)

**Maps to:** `ChildProfile.preferences.noiseLevel`

---

### Q2: What lighting environments work best?
**Options:**
- [ ] Dim/Low Light
- [ ] Natural Light
- [ ] Bright/Well-Lit
- [ ] Adjustable (prefers control)

**Maps to:** `ChildProfile.preferences.lighting`

---

### Q3: How does your child handle crowds?
**Options:**
- [ ] Small Groups (< 20 people)
- [ ] Medium Groups (20-50 people)
- [ ] Large Events (50+ people)

**Maps to:** `ChildProfile.preferences.crowdDensity`

---

### Q4: What are their interests? (Select multiple)
**Options:**
- [ ] Animals/Nature
- [ ] Museums/Science
- [ ] Music/Performance
- [ ] Sports/Physical Activity
- [ ] Art/Crafts
- [ ] Technology/Gaming
- [ ] Therapeutic Play
- [ ] Outdoor Exploration
- [ ] Indoor Activities

**Maps to:** `ChildProfile.preferences.interests`

---

### Q5: Are there specific sensory triggers to avoid?
**Options:**
- [ ] Loud Sounds (fireworks, alarms)
- [ ] Flashing Lights
- [ ] Strong Smells
- [ ] Crowded Spaces
- [ ] Unpredictable Noises
- [ ] Bright Lights
- [ ] Physical Contact

**Maps to:** `ChildProfile.preferences.avoidances`

---

### Q6: Which event features are important to you? (Select multiple)
**Options:**
- [ ] Quiet Room Available
- [ ] Sensory Tools Provided (headphones, fidgets)
- [ ] Visual Schedules Available
- [ ] Social Stories Available
- [ ] Certified Sensory-Inclusive Venue
- [ ] Flexible Exit/Re-entry
- [ ] Pre-Visit Information Available

**Maps to:** `ChildProfile.preferences.desiredFeatures`

---

### Q7: Preferred time of day for events?
**Options:**
- [ ] Morning (9 AM - 12 PM)
- [ ] Afternoon (12 PM - 5 PM)
- [ ] Evening (5 PM - 8 PM)

**Maps to:** `ChildProfile.preferences.preferredTimeOfDay`

---

### Q8: How important is weather in planning?
**Options:**
- [ ] Critical (only go on perfect days)
- [ ] Important (check forecast)
- [ ] Flexible (we adapt)

**Maps to:** `ChildProfile.preferences.weatherImportance`

---

## Autocomplete Triggers & Suggestions

| User Types | Suggestions |
|------------|------------|
| "sensory" | sensory-friendly events<br>sensory play zones<br>sensory-friendly museum visits<br>sensory nature walks |
| "quiet" | quiet hours events<br>quiet room available<br>low noise event times |
| "museum" | sensory-friendly museum visits<br>museum quiet hours<br>museum sensory guides |
| "family" | family autism activities<br>family autism meetup<br>family events |
| "nature" | sensory nature walks<br>outdoor nature activities<br>gentle exploration |
| "craft" | sensory art & crafts<br>adaptive art programs<br>therapeutic art sessions |
| "support" | autism support meetups<br>parent support groups<br>community support events |

---

## Popular Searches (Empty State)

1. sensory-friendly events
2. quiet hours for families
3. museum sensory hours
4. autism friendly activities
5. therapeutic play events

---

## Synonym Mapping (Query Normalization)

**low_noise:**
- quiet hours
- low noise
- reduced sound
- quiet room available
- audio compatible
- sound-reduced

**sensory_friendly:**
- sensory-friendly
- sensory inclusive
- reduced stimulation
- sensory session
- sensory aware
- neurodivergent friendly

**low_lighting:**
- reduced lighting
- dimmed lights
- low light
- adjusted lighting
- lighting accommodations

**small_crowd:**
- small crowd
- low capacity
- intimate group
- limited attendance
- early access
- private session

**certified_venue:**
- KultureCity certified
- sensory-inclusive certified
- autism certified

---

## Tag Weights for Search Relevance

| Tag | Weight | Use Case |
|-----|--------|----------|
| sensory_friendly | 1.0 | Core designation |
| certified_inclusive | 0.95 | KultureCity/similar certification |
| low_noise | 0.9 | Quiet environment |
| quiet_room | 0.85 | Calm-down space available |
| small_crowd | 0.8 | Limited attendance |
| reduced_lighting | 0.8 | Dimmed lights |
| visual_schedule | 0.75 | Visual supports |
| sensory_tools | 0.7 | Tools provided |
| therapeutic | 0.7 | Therapeutic programming |
| social_stories | 0.65 | Social narratives |

---

## Community-Driven Terms

Phrases identified from real parent posts and event listings:

- "sensory-friendly Sunday" (e.g., Chuck E. Cheese early access)
- "early access events"
- "adaptive outdoor play"
- "inclusion fair"
- "relaxed performance"
- "calm exploration"
- "gentle event"
- "accommodating venue"

---

## Implementation Reference

**Files:**
- [`searchTaxonomy.json`](file:///C:/Users/joshs/Documents/SensorySpaces/server/src/config/searchTaxonomy.json)
- [`keywords.strong.json`](file:///C:/Users/joshs/Documents/SensorySpaces/server/src/config/keywords.strong.json)
- [`keywords.weak.json`](file:///C:/Users/joshs/Documents/SensorySpaces/server/src/config/keywords.weak.json)
- [`ChildProfile.js`](file:///C:/Users/joshs/Documents/SensorySpaces/server/src/models/ChildProfile.js)
- [`autocompleteService.js`](file:///C:/Users/joshs/Documents/SensorySpaces/server/src/services/autocompleteService.js)

**API Endpoints:**
- `GET /api/search/autocomplete?q={query}`
- `GET /api/search/popular`
- `POST /api/search/normalize`
- `GET /api/profiles` (list child profiles)
- `POST /api/profiles` (create with onboarding data)

---

**Last Updated:** 2026-01-21
