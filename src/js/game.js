import { WORDS } from "./consts";
import { KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");

let triesLeft;
let winCount;

const createPlaceHoldersHTML = () => {
  const word = sessionStorage.getItem("word");
  const wordArray = Array.from(word);
  const placeHoldersHTML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id='letter_${i}' class='letter'>_</h1>`,
    ""
  );
  return `<div id='placeholders' class='placeholders-wrapper'>${placeHoldersHTML}</div>`;
};

const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button class='button-primary keyboard-button' id ='${curr}'>${curr}</button>`
    );
  }, "");

  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.alt = "hangman image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";
  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem('word');
  const inputLetter = letter.toLowerCase();

  if (!word.includes(inputLetter)) {
    const triesCounter = document.querySelector('#tries-left');
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.querySelector('#hangman-img');
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame('lose');
    }
  } else {
    const wordArray = word.split('');
    wordArray.forEach((currentLetter, index) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame('win');
          return;
        }
        document.querySelector(`#letter_${index}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};

 const stopGame = (status) => {
  document.getElementById('placeholders').remove()
  document.getElementById('tries').remove()
  document.getElementById('keyboard').remove()
  document.querySelector('#quit').remove();

  const word = sessionStorage.getItem('word')
  if(status === 'win'){
    //сценарий выигрыша
    document.getElementById('hangman-img').src = 'images/hg-win.png'
    document.getElementById('game').innerHTML += '<h2 class="result-header wine"> You won!</h2>'
  } else if(status === 'lose'){
    //сценарий проигрыша
    document.getElementById('game').innerHTML += '<h2 class="result-header lose"> You lost :(</h2>'
  } else if (status === 'quit'){
    logoH1.classList.remove('logo-sm');
    document.querySelector('#hangman-img').remove();
  }

  document.getElementById('game').innerHTML +=
  `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again"
  class="button-primary px-5 py-2 mt-5">Play again</button>`;
  document.getElementById('play-again').onclick = startGame
}

export const startGame = () => {
  triesLeft = 10;
  winCount = 0;

  logoH1.classList.add("logo-sm");
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);
  gameDiv.innerHTML = createPlaceHoldersHTML();

  gameDiv.innerHTML +=
    '<p id ="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>';

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === 'button'){
      e.target.disabled = true
      checkLetter(e.target.id)
    }
  });
  const hangmanImg = createHangmanImg();
    gameDiv.prepend(hangmanImg);

    gameDiv.appendChild(keyboardDiv);
    gameDiv.insertAdjacentHTML(
      'beforeend',
      '<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>'
    );
    document.querySelector('#quit').onclick = () => {
      const isSure = confirm('Are you sure you want to quit and lose progress?');
      isSure ? stopGame('quit') : null;
    };
};
