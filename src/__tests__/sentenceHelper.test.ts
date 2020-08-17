import { SentenceHelper } from "../sentenceHelper";

test("sentence helper splits text correctly", () => {
  const sentences = SentenceHelper.splitIntoSentences(
    'This. Is, a single; test "test"'
  );
  expect(sentences).toHaveLength(5);
});

test("properly split special tags and emojis", () => {
  const sentences = SentenceHelper.splitIntoSentences(
    "<@!209871057295911111> <:TEST:697608377060294750> test 😳"
  );
  expect(sentences).toHaveLength(4);
  expect(sentences[0]).toEqual(" ");
  expect(sentences[1]).toEqual("<:TEST:697608377060294750>");
  expect(sentences[2]).toEqual(" test ");
  expect(sentences[3]).toEqual("😳");
});

test("special characters are valid", () => {
  expect(SentenceHelper.areAllCharsValid("😳")).toBeTruthy();
  expect(SentenceHelper.areAllCharsValid("Hello <:TEST:697608377060294750>")).toBeTruthy();
  expect(SentenceHelper.areAllCharsValid("<:TEST:697608377060294750>")).toBeTruthy();
});
