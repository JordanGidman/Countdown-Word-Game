`use strict`;

const timerEl = document.querySelector(`.timer`);
const randomLettersEl = document.querySelector(`.random-letters`);
const inputWord = document.getElementById(`input-word`);
const btnStart = document.querySelector(`.btn-start`);
const btnRules = document.querySelector(`.btn-rules`);
const btnSubmit = document.querySelector(`.btn-submit`);
const inputForm = document.querySelector(`.input-form`);
const scoreEl = document.querySelector(`.curr-score`);
const scoreHighEl = document.querySelector(`.high-score`);
const inputLabel = document.querySelector(`.input-label`);

const characters = `bcdfghjklmnpqrstvwxyz`;
const vowels = `aeiou`;
//How many seconds the player has
let gameTime = 10;
let timer;
let roundNum = 1;
let userAnswer = ``;
let currScore = 0;
let highScore = 0;
let data;

//we want to have a loop that will run between 5 and 7 times

const generateWord = function () {
  let str = [];

  for (let i = 0; i < Math.trunc(Math.random() * (7 - 6 + 1) + 6); i++) {
    str.push(characters[Math.trunc(Math.random() * 21)]);
  }

  let amountLeft = 10 - str.length;

  for (let j = 0; j < amountLeft; j++) {
    str.push(vowels[Math.trunc(Math.random() * 4)]);
  }

  return str;
};

//TIMER
const startTimer = function () {
  const ticks = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(Math.trunc(time % 60)).padStart(2, 0);
    //each run of this callback we print the updated time
    timerEl.textContent = `${minutes}:${seconds}`;

    //when time is up, stop timer
    if (time === 0) {
      clearInterval(timer);
      randomLettersEl.textContent = `**********`;
      nextRound(`+++`);

      if (roundNum < 5) {
        roundNum++;
      } else {
        roundNum--; //THIS NEEDS TO BE CHANGED TO GAME OVER FUNCTION
      }
    }
    time--;
  };
  let time = gameTime;

  //call timer every second
  ticks();
  const timer = setInterval(ticks, 1000);

  return timer;
};

btnStart.addEventListener(`click`, function () {
  inputWord.removeAttribute(`readonly`);
  console.log(inputWord.attributes);

  let currWord = generateWord().join(``);

  randomLettersEl.textContent = currWord;

  if (timer) {
    clearInterval(timer);
  }

  timer = startTimer();
});

btnSubmit.addEventListener(`click`, function (e) {
  e.preventDefault();
  userAnswer = inputWord.value;
  // checkAnswer(userAnswer);
  clearInterval(timer);
  nextRound(userAnswer);
});

const options = {
  method: "GET",
};

const checkAnswer = function (word) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, options)
    .then((response) => response.json())
    .then((response) => {
      resolveAnswer(response);
    });

  // .catch((err) => {
  //   resolveAnswer(err);
  // });
};

const resolveAnswer = function (res) {
  console.log(`res: ${res[0]}`);
  if (res[0]) {
    currScore += userAnswer.length;

    if (currScore > highScore) {
      highScore = currScore;
    }

    inputLabel.textContent = `Great! Your scores have been updated`;
    inputLabel.style.color = `green`;
  } else {
    inputLabel.textContent = `Sorry! Not a valid word. 0 points.`;
    inputLabel.style.color = `red`;
  }
  scoreEl.textContent = `Score: ${currScore}`;
  scoreHighEl.textContent = `Highscore: ${highScore}`;
};

const nextRound = function (answer) {
  // console.log(userAnswer);
  checkAnswer(answer);
  timerEl.textContent = `00:00`;
  inputWord.value = ``;
  randomLettersEl.textContent = `**********`;
  inputWord.setAttribute(`readonly`, true);
};
