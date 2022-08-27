const timerEl = document.querySelector(`.timer`);
const lettersEl = document.querySelector(`.random-letters`);
const inputWord = document.querySelector(`.input-word`);
const btnStart = document.querySelector(`.btn-start`);
const btnRules = document.querySelector(`.btn-rules`);

const characters = `bcdfghjklmnpqrstvwxyz`;
const vowels = `aeiou`;

//we want to have a loop that will take between 5 and 7

const generateWord = function () {
  let str = [];

  for (let i = 0; i < Math.trunc(Math.random() * (7 - 6 + 1) + 6); i++) {
    str.push(characters[Math.trunc(Math.random() * 21)]);
  }

  console.log(str.length);

  let amountLeft = 10 - str.length;

  for (let j = 0; j < amountLeft; j++) {
    str.push(vowels[Math.trunc(Math.random() * 4)]);
  }
  console.log(str.length);
  console.log(str);
};
generateWord();

const options = {
  method: "GET",
};

fetch("https://api.dictionaryapi.dev/api/v2/entries/en/berg", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));

console.log();
