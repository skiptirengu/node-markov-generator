"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCollection = void 0;
class TokenCollection {
    constructor(initialValues) {
        this.values = new Map();
        this.totalCount = 0;
        this.shouldUpdateProbabilities = false;
        initialValues && initialValues.forEach(v => this.add(v));
    }
    add(value) {
        this.totalCount++;
        const existing = this.values.get(value);
        if (existing) {
            existing.numberOfOccurrences++;
        }
        else {
            this.values.set(value, { numberOfOccurrences: 1 });
        }
        this.shouldUpdateProbabilities = true;
    }
    getRandom() {
        this.ensureProbabilitiesUpdated();
        const random = Math.random();
        for (const [value, occurenceInfo] of this.values.entries()) {
            if (occurenceInfo.intervalFrom <= random && random < occurenceInfo.intervalTo) {
                return value;
            }
        }
    }
    ensureProbabilitiesUpdated() {
        if (!this.shouldUpdateProbabilities) {
            return;
        }
        const delta = 1 / this.totalCount;
        let lastBoundary = 0;
        for (const v of this.values.values()) {
            let newBoundary = lastBoundary + (delta * v.numberOfOccurrences);
            v.intervalFrom = lastBoundary;
            v.intervalTo = newBoundary;
            lastBoundary = newBoundary;
        }
        this.shouldUpdateProbabilities = false;
    }
}
exports.TokenCollection = TokenCollection;