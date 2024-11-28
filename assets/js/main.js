let Word = "";
let hint = "";

const wordDisplay = document.getElementById("wordDisplay");
const hintElement = document.getElementById("hint");
const playButton = document.getElementById("playButton");
const keyboardButtons = document.querySelectorAll(".keyboard button");
const playSound = new Audio("./assets/audio/play-sound.mp3");
const buttonSound = new Audio("./assets/audio/button-sound.mp3");
const bodySound = new Audio("./assets/audio/body-sound.mp3");
const winSound = new Audio("./assets/audio/win-sound.mp3");
const loseSound = new Audio("./assets/audio/lose-sound.mp3");

const bodyParts = [
  document.getElementById("polar"),
  document.getElementById("sline"),
  document.getElementById("rope"),
  [
    document.getElementById("headd"),
    document.querySelectorAll("#headd")[1],
    document.querySelectorAll("#headd")[2],
  ],
  document.getElementById("body"),
  document.querySelectorAll("#hand")[0],
  document.querySelectorAll("#hand")[1],
  document.querySelectorAll("#leg")[0],
  document.querySelectorAll("#leg")[1],
];

let guessedLetters = [];
let wrongGuessCount = 0;

async function getRandomWordAndHint() {
  try {
    const response = await fetch("./assets/wordrandom.txt");
    const text = await response.text();
    const wordsWithHints = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const randomLine =
      wordsWithHints[Math.floor(Math.random() * wordsWithHints.length)];
    const [randomWord, randomHint] = randomLine
      .split("/")
      .map((part) => part.trim());

    Word = randomWord.toUpperCase();
    hint = randomHint;

    displayWord();
    hintElement.textContent = `Hint: ${hint}`;
  } catch (error) {
    console.error("Lỗi khi đọc file:", error);
  }
}

function displayWord() {
  wordDisplay.innerHTML = "";

  Word.split("").forEach((letter) => {
    const letterBox = document.createElement("div");
    letterBox.classList.add("letter");
    letterBox.textContent = guessedLetters.includes(letter) ? letter : "_";
    wordDisplay.appendChild(letterBox);
  });

  if (checkWin()) {
    winSound.play();
    setTimeout(() => alert("You Win! The word was ${Word}"), 100);
    resetGame();
  }
}

function handleGuess(letter, button) {
  button.style.visibility = "hidden";
  if (Word.includes(letter)) {
    guessedLetters.push(letter);
    buttonSound.play();
    displayWord();
  } else {
    wrongGuessCount++;

    if (wrongGuessCount <= bodyParts.length) {
      showBodyPart(bodyParts[wrongGuessCount - 1]);
    }
    bodySound.play();
    if (wrongGuessCount === bodyParts.length) {
      setTimeout(() => {
        loseSound.play();
        alert(`You Lose! The word was: ${Word}`);
        resetGame();
      }, 100);
    }
  }
}

function checkWin() {
  return Word.split("").every((letter) => guessedLetters.includes(letter));
}

function showBodyPart(part) {
  if (Array.isArray(part)) {
    part.forEach((p) => (p.style.display = "block"));
  } else {
    part.style.display = "block";
  }
}

function resetGame() {
  guessedLetters = [];
  wrongGuessCount = 0;

  bodyParts.flat().forEach((part) => (part.style.display = "none"));

  keyboardButtons.forEach((button) => {
    button.style.visibility = "visible";
    button.disabled = false;
  });

  getRandomWordAndHint();
}

function hideKeyboard() {
  keyboardButtons.forEach((button) => {
    button.style.visibility = "hidden";
  });
}

playButton.addEventListener("click", () => {
  playSound.play();
  resetGame();
});

keyboardButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const letter = button.textContent;

    handleGuess(letter, button);
  });
});

hideKeyboard();

getRandomWordAndHint();
