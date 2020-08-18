import { SentenceHelper } from "../sentenceHelper";

test("sentence helper splits text correctly", () => {
  const sentences = SentenceHelper.splitIntoSentences(
    'This. Is, a single; test "test"'
  );
  expect(sentences).toHaveLength(3);
});

test("properly split special tags and emojis", () => {
  const sentences = SentenceHelper.splitIntoSentences(
    "<@!209871057295911111> special <:TEST:697608377060294750> test 😳 dummy foo 😳😳"
  );
  expect(sentences).toHaveLength(4);
  expect(sentences[0].trim()).toEqual("special <:TEST:697608377060294750>");
  expect(sentences[1].trim()).toEqual("test 😳");
  expect(sentences[2].trim()).toEqual("dummy foo 😳");
  expect(sentences[3].trim()).toEqual("😳");
});

test("special characters are valid", () => {
  expect(SentenceHelper.areAllCharsValid("😳")).toBeTruthy();
  expect(
    SentenceHelper.areAllCharsValid("Hello <:TEST:697608377060294750>")
  ).toBeTruthy();
  expect(
    SentenceHelper.areAllCharsValid("<:TEST:697608377060294750>")
  ).toBeTruthy();
});
