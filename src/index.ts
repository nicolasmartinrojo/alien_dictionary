interface MapCharacter {
  character: string;
  biggerThan: number;
  smallerThan: number;
}

const isSameParentWord = (word1: string, word2: string) => {
  return (
    word1.substr(0, word1.length - 1) === word2.substr(0, word1.length - 1)
  );
};

const calculateDictionary = (words: string[]) => {
  const dictionary: string[] = [];
  let possibleCharacters = "";
  words.forEach((word) => {
    word.split("").forEach((letter) => {
      if (!possibleCharacters.includes(letter)) {
        possibleCharacters += letter;
      }
    });
  });

  let letterPosition = 0;

  let mapCharacters: MapCharacter[] = [];
  let currentCharacter: MapCharacter | undefined;
  do {
    for (let word = 0; word < words.length; word++) {
      if (
        words[word][letterPosition] &&
        !dictionary.find((elem: string) => elem === words[word][letterPosition])
      ) {
        if (letterPosition == 0) {
          //On the first column we don't care about letter the order, because they're already ordered
          dictionary.push(words[word][letterPosition]);
        } else {
          // we check if the letter was already on our "watchlist"
          currentCharacter = mapCharacters.find(
            (elem: MapCharacter) =>
              elem.character == words[word][letterPosition]
          );
          if (!currentCharacter) {
            currentCharacter = {
              character: words[word][letterPosition],
              biggerThan: 0,
              smallerThan: words.length,
            };
            mapCharacters.push(currentCharacter);
          }
          for (let word2 = 0; word2 < word; word2++) {
            if (isSameParentWord(words[word], words[word2])) {
              const biggerThan = dictionary.findIndex(
                (elem: string) => elem === words[word2][letterPosition]
              );
              if (currentCharacter.biggerThan < biggerThan) {
                currentCharacter.biggerThan = biggerThan;
              }
            }
          }
          for (let word2 = word; word2 < words.length - 1; word2++) {
            if (isSameParentWord(words[word], words[word2])) {
              const smallerThan = dictionary.findIndex(
                (elem: string) => elem === words[word2][letterPosition - 1]
              );
              if (currentCharacter.smallerThan > smallerThan) {
                currentCharacter.smallerThan = smallerThan;
              }
            }
          }
          if (currentCharacter.smallerThan - currentCharacter.biggerThan <= 2) {
            const position =
              (currentCharacter.smallerThan + currentCharacter.biggerThan) / 2;
            dictionary.splice(position, 0, currentCharacter.character);
          }
        }
      }
    }

    letterPosition++;
  } while (dictionary.length != possibleCharacters.length);

  return dictionary;
};

console.log(calculateDictionary(["baa", "abcd", "abca", "cab", "cad"])); // should be "b", "d","a","c"

console.log(calculateDictionary(["caa", "aaa", "aab"])); // should be "c","a","b"
