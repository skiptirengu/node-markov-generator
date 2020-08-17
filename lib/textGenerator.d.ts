import { GeneratorOptions } from "./generatorOptions";
export declare class TextGenerator {
    private readonly wordsToStart;
    private readonly wordsToFinish;
    private readonly wordStorage;
    constructor(input: string | string[]);
    private processWords;
    private static getKeyForMultipleWords;
    generate(options?: GeneratorOptions): string[];
    generateSentence(options?: GeneratorOptions): string;
    private generateInternal;
}
