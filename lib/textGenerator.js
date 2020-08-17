"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextGenerator = void 0;
const fs = require("fs");
const tokenCollection_1 = require("./tokenCollection");
const sentenceHelper_1 = require("./sentenceHelper");
class TextGenerator {
    constructor(input) {
        this.wordsToStart = new tokenCollection_1.TokenCollection();
        this.wordsToFinish = new Set();
        this.wordStorage = new Map();
        let corpus;
        if (Array.isArray(input)) {
            corpus = input;
        }
        else {
            const corpusContents = fs.readFileSync(input).toString();
            corpus = corpusContents.split(/\r?\n/);
        }
        const minLastWordLength = 4;
        for (const line of corpus) {
            const sentences = sentenceHelper_1.SentenceHelper.splitIntoSentences(line.trim().toLowerCase())
                .map((s) => s.trim())
                .filter(sentenceHelper_1.SentenceHelper.areAllCharsValid);
            for (const sentence of sentences) {
                const words = sentence.split(" ");
                if (!words.length) {
                    continue;
                }
                this.wordsToStart.add(words[0]);
                const lastWord = words[words.length - 1];
                if (lastWord.length >= minLastWordLength) {
                    this.wordsToFinish.add(lastWord);
                }
                for (let i = 0; i < words.length - 1; i++) {
                    const currentWord = words[i];
                    const nextWord = words[i + 1];
                    this.processWords(null, currentWord, nextWord);
                    if (i > 0) {
                        const previousWord = words[i - 1];
                        this.processWords(previousWord, currentWord, nextWord);
                    }
                }
            }
        }
    }
    processWords(prevWord, currentWord, nextWord) {
        const key = prevWord
            ? TextGenerator.getKeyForMultipleWords(prevWord, currentWord)
            : currentWord;
        if (this.wordStorage.has(key)) {
            this.wordStorage.get(key).add(nextWord);
        }
        else {
            this.wordStorage.set(key, new tokenCollection_1.TokenCollection([nextWord]));
        }
    }
    static getKeyForMultipleWords(...words) {
        return words.reduce((cur, next) => (cur ? `${cur}|${next}` : next), "");
    }
    generate(options) {
        var _a, _b, _c, _d, _e, _f;
        const minWordCount = (_a = options === null || options === void 0 ? void 0 : options.minWordCount) !== null && _a !== void 0 ? _a : 7;
        const maxWordCount = (_b = options === null || options === void 0 ? void 0 : options.maxWordCount) !== null && _b !== void 0 ? _b : 20;
        const contextUsageDegree = (_c = options === null || options === void 0 ? void 0 : options.contextUsageDegree) !== null && _c !== void 0 ? _c : 0.5;
        let retryCount = (_d = options === null || options === void 0 ? void 0 : options.retryCount) !== null && _d !== void 0 ? _d : 100;
        do {
            const wordToStart = (_f = (_e = options === null || options === void 0 ? void 0 : options.wordToStart) === null || _e === void 0 ? void 0 : _e.toLowerCase()) !== null && _f !== void 0 ? _f : this.wordsToStart.getRandom();
            const result = this.generateInternal(wordToStart, minWordCount, maxWordCount, contextUsageDegree);
            retryCount--;
            if (result) {
                return result;
            }
        } while (retryCount);
        return null;
    }
    generateSentence(options) {
        const generated = this.generate(options);
        if (generated === null || generated === void 0 ? void 0 : generated.length) {
            const [firstWord, ...rest] = generated;
            return ([firstWord[0].toUpperCase() + firstWord.substr(1)]
                .concat(rest)
                .join(" ") + ".");
        }
        else {
            return null;
        }
    }
    generateInternal(wordToStart, minWordCount, maxWordCount, contextAwarenessDegree) {
        const resultWords = [wordToStart];
        let preLastGeneratedWord = null;
        let lastGeneratedWord = wordToStart;
        while (true) {
            const possibleNextWordAwareOfContext = preLastGeneratedWord
                ? this.wordStorage.get(TextGenerator.getKeyForMultipleWords(preLastGeneratedWord, lastGeneratedWord))
                : null;
            const possibleSimpleNextWords = this.wordStorage.get(lastGeneratedWord);
            const possibleNextWords = possibleNextWordAwareOfContext && Math.random() < contextAwarenessDegree
                ? possibleNextWordAwareOfContext
                : possibleSimpleNextWords;
            if (!possibleNextWords) {
                if (resultWords.length >= minWordCount) {
                    return resultWords;
                }
                else {
                    return null;
                }
            }
            const nextWord = possibleNextWords.getRandom();
            if (nextWord) {
                resultWords.push(nextWord);
            }
            if (resultWords.length > minWordCount &&
                this.wordsToFinish.has(nextWord)) {
                return resultWords;
            }
            if (resultWords.length === maxWordCount) {
                return null;
            }
            preLastGeneratedWord = lastGeneratedWord;
            lastGeneratedWord = nextWord;
        }
    }
}
exports.TextGenerator = TextGenerator;
