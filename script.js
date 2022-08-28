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
const roundNumEl = document.querySelector(`.round-num`);
const btnToggleColor = document.querySelector(`.input-toggle`);
const pageContainer = document.querySelector(`.container`);
const burgerMenu = document.querySelector(`.burger-menu`);
const headerEl = document.querySelector(`.header`);
const btnCloseModal = document.querySelector(`.btn-close-modal`);

console.log(burgerMenu);
console.log(localStorage);

const saveScore = function () {
  localStorage.setItem("savedScore", highScore);
};

const getHighscore = function () {
  return localStorage.getItem("savedScore");
};

console.log(getHighscore());

const characters = `bcdfghjklmnpqrstvwxyz`;
const vowels = `aeiou`;
//How many seconds the player has
let gameTime = 30;
let timer;
let roundNum = 1;
let userAnswer = ``;
let currScore = 0;
let highScore = getHighscore() ? Number(getHighscore()) : 0;
let data;
let currWord;

scoreHighEl.textContent = `Highscore: ${highScore}`;
roundNumEl.textContent = `Round: ${roundNum}`;

//Create the random letters
const generateWord = function () {
  let str = [];

  //we want to have a loop that will run between 5 and 7 times
  for (let i = 0; i < Math.trunc(Math.random() * (7 - 6 + 1) + 6); i++) {
    str.push(characters[Math.trunc(Math.random() * 21)]);
  }

  let amountLeft = 10 - str.length;
  //we need to ensure a word can actually be made by ensuring that there are always some vowels
  for (let j = 0; j < amountLeft; j++) {
    str.push(vowels[Math.trunc(Math.random() * 4)]);
  }

  return shuffle(str);
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

      // if (roundNum < 5) roundNum++;
      // else roundNum--; //THIS NEEDS TO BE CHANGED TO GAME OVER FUNCTION
    }
    time--;
  };
  let time = gameTime;

  //call timer immediately and then every second
  ticks();
  const timer = setInterval(ticks, 1000);

  return timer;
};

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
  if (res[0] && checkLetters(userAnswer, currWord)) {
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
  saveScore();
};

const nextRound = function (answer) {
  // console.log(userAnswer);
  checkAnswer(answer);
  timerEl.textContent = `00:00`;
  inputWord.value = ``;
  randomLettersEl.textContent = `**********`;
  inputWord.setAttribute(`readonly`, true);
  inputLabel.textContent = `Please Enter The longest Word You Can Think of`;
  roundNum++;
  roundNumEl.textContent = `Round: ${roundNum}`;
};

const checkLetters = function (userInput, rLetters) {
  return userInput.split(``).every((l) => rLetters.split(``).includes(l));
};

//Fisher yates shuffle - not designed by me.
const shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

btnToggleColor.addEventListener(`click`, function () {
  btnToggleColor.classList.add(`.slider-light`);
  pageContainer.classList.toggle(`dark`);
});

btnStart.addEventListener(`click`, function () {
  //Allow the user to type
  inputWord.removeAttribute(`readonly`);

  currWord = generateWord().join(``);

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

  if (roundNum < 5) {
    nextRound(userAnswer);
  } else {
    gameOver();
  }
});

const gameOver = function () {
  inputLabel.textContent = `Game Over your final score this run was ${currScore}`;
  inputLabel.style.color = "green";
  currScore = 0;
  scoreEl.textContent = `Score: ${currScore}`;
  timerEl.textContent = `00:00`;
  inputWord.value = ``;
  randomLettersEl.textContent = `**********`;
  inputWord.setAttribute(`readonly`, true);
  roundNum = 0;
  roundNumEl.textContent = `Round: ${roundNum}`;
};

console.log(headerEl);
burgerMenu.addEventListener(`click`, function () {
  console.log(`worked`);
  document.querySelector(`.overlay`).classList.remove(`hidden`);
  document.querySelector(`.modal-window`).classList.remove(`hidden`);
  btnCloseModal.classList.remove(`hidden`);
});

btnCloseModal.addEventListener(`click`, function () {
  document.querySelector(`.overlay`).classList.add(`hidden`);
  document.querySelector(`.modal-window`).classList.add(`hidden`);
  btnCloseModal.classList.add(`hidden`);
});
