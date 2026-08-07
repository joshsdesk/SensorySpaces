const VENUE_BASELINES = require('../config/venueBaselines');
const STRONG_KEYWORDS = require('../config/keywords.strong.json');
const WEAK_KEYWORDS = require('../config/keywords.weak.json');

// Weights for Confidence Formula
const WEIGHTS = {
    human: 1.0,
    nlp_strong: 0.8,
    baseline: 0.6,
    nlp_weak: 0.3
};

class SensoryInferenceEngine {
    constructor() {
        this.version = 1; // Increment when rules change
    }

    /**
     * Main Inference Entry Point
     * @param {Object} eventMetadata - { title, description, venueName, date }
     * @returns {Object} fully populated sensoryProfile
     */
    infer(eventMetadata) {
        const profile = {
            noiseLevel: this._resolveAttribute('noiseLevel', eventMetadata),
            lighting: this._resolveAttribute('lighting', eventMetadata),
            crowdDensity: this._resolveAttribute('crowdDensity', eventMetadata),
            details: [] // TODO: Extract specific details like "Quiet Room" separate from core attributes
        };

        return {
            profile,
            version: this.version
        };
    }

    // ----------------------------------------------------------------
    // CORE LOGIC: PROVENANCE & CONFLICT RESOLUTION
    // ----------------------------------------------------------------

    _resolveAttribute(attrName, meta) {
        const candidates = [];

        // 1. Venue Baseline
        const baseline = this._getBaseline(meta.venueName, attrName);
        if (baseline) candidates.push(baseline);

        // 2. Strong NLP
        const strongMatches = this._scanKeywords(meta, attrName, STRONG_KEYWORDS, 'nlp_strong');
        candidates.push(...strongMatches);

        // 3. Weak NLP
        const weakMatches = this._scanKeywords(meta, attrName, WEAK_KEYWORDS, 'nlp_weak');
        candidates.push(...weakMatches);

        // 4. Manual/Human (Passed in meta if available, else ignored)
        if (meta.humanOverride && meta.humanOverride[attrName]) {
            candidates.push({
                value: meta.humanOverride[attrName],
                source: 'human',
                confidence: 1.0,
                sourceDetail: 'Organizer Input'
            });
        }

        // --- CONFLICT RESOLUTION ---
        return this._pickWinner(candidates);
    }

    _pickWinner(candidates) {
        if (!candidates.length) {
            return {
                value: 'Unknown', // Explicit Unknown State
                status: 'unknown',
                source: 'none',
                confidence: 0,
                version: this.version,
                lastUpdatedAt: new Date()
            };
        }

        // Priority Sort: Human > StrongNLP > Baseline > WeakNLP
        const priority = { 'human': 4, 'nlp_strong': 3, 'baseline': 2, 'nlp_weak': 1 };

        candidates.sort((a, b) => {
            const pA = priority[a.source] || 0;
            const pB = priority[b.source] || 0;
            if (pA !== pB) return pB - pA; // Descending priority
            return b.confidence - a.confidence; // Tie-break: Higher confidence wins
        });

        const winner = candidates[0];

        // Status Logic
        let status = 'inferred';
        if (winner.source === 'human') status = 'verified';
        if (winner.confidence < 0.4) status = 'unknown'; // Low confidence threshold

        return {
            ...winner,
            status,
            version: this.version,
            lastUpdatedAt: new Date()
        };
    }

    // ----------------------------------------------------------------
    // HELPERS
    // ----------------------------------------------------------------

    _getBaseline(venueName, attrName) {
        if (!venueName) return null;
        // Simple case-insensitive match for MVP
        // TODO: Fuzzy matching
        const venueKey = Object.keys(VENUE_BASELINES).find(k => k.toLowerCase() === venueName.toLowerCase());

        if (venueKey && VENUE_BASELINES[venueKey].defaults[attrName]) {
            const baseConf = VENUE_BASELINES[venueKey].meta.confidence || 0.6;
            return {
                value: VENUE_BASELINES[venueKey].defaults[attrName],
                source: 'baseline',
                sourceDetail: `Baseline: ${venueKey}`,
                inferenceReason: 'venue_baseline',
                confidence: this._computeConfidence('baseline', 1.0, baseConf)
            };
        }
        return null;
    }

    _scanKeywords(meta, attrName, keywordList, sourceType) {
        const text = `${meta.title} ${meta.description || ''}`.toLowerCase();
        const matches = [];

        keywordList.forEach(kw => {
            if (kw.attribute === attrName && text.includes(kw.phrase)) {
                matches.push({
                    value: kw.value,
                    source: sourceType,
                    sourceDetail: `Matched: "${kw.phrase}"`,
                    inferenceReason: 'keyword',
                    confidence: this._computeConfidence(sourceType, kw.strength)
                });
            }
        });
        return matches;
    }

    _computeConfidence(source, keywordStrength, baselineConfidence = 0.6) {
        const weight = WEIGHTS[source] || 0;
        let conf = 0;

        switch (source) {
            case 'human': conf = 1.0; break;
            case 'nlp_strong': conf = weight * keywordStrength; break;
            case 'nlp_weak': conf = weight * keywordStrength; break;
            case 'baseline': conf = weight * baselineConfidence; break;
            default: conf = 0;
        }

        // Clamp 0..1
        return Math.max(0, Math.min(1, conf));
    }
}

module.exports = new SensoryInferenceEngine();
