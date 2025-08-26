document.title = "U.S. States Game";

const statesData = [
  { state: "Alabama", x: 139, y: -77 },
  { state: "Alaska", x: -204, y: -170 },
  { state: "Arizona", x: -203, y: -40 },
  { state: "Arkansas", x: 57, y: -53 },
  { state: "California", x: -297, y: 13 },
  { state: "Colorado", x: -112, y: 20 },
  { state: "Connecticut", x: 297, y: 96 },
  { state: "Delaware", x: 275, y: 42 },
  { state: "Florida", x: 220, y: -145 },
  { state: "Georgia", x: 182, y: -75 },
  { state: "Hawaii", x: -317, y: -143 },
  { state: "Idaho", x: -216, y: 122 },
  { state: "Illinois", x: 95, y: 37 },
  { state: "Indiana", x: 133, y: 39 },
  { state: "Iowa", x: 38, y: 65 },
  { state: "Kansas", x: -17, y: 5 },
  { state: "Kentucky", x: 149, y: 1 },
  { state: "Louisiana", x: 59, y: -114 },
  { state: "Maine", x: 319, y: 164 },
  { state: "Maryland", x: 288, y: 27 },
  { state: "Massachusetts", x: 312, y: 112 },
  { state: "Michigan", x: 148, y: 101 },
  { state: "Minnesota", x: 23, y: 135 },
  { state: "Mississippi", x: 94, y: -78 },
  { state: "Missouri", x: 49, y: 6 },
  { state: "Montana", x: -141, y: 150 },
  { state: "Nebraska", x: -61, y: 66 },
  { state: "Nevada", x: -257, y: 56 },
  { state: "New Hampshire", x: 302, y: 127 },
  { state: "New Jersey", x: 282, y: 65 },
  { state: "New Mexico", x: -128, y: -43 },
  { state: "New York", x: 236, y: 104 },
  { state: "North Carolina", x: 239, y: -22 },
  { state: "North Dakota", x: -44, y: 158 },
  { state: "Ohio", x: 176, y: 52 },
  { state: "Oklahoma", x: -8, y: -41 },
  { state: "Oregon", x: -278, y: 138 },
  { state: "Pennsylvania", x: 238, y: 72 },
  { state: "Rhode Island", x: 318, y: 94 },
  { state: "South Carolina", x: 218, y: -51 },
  { state: "South Dakota", x: -44, y: 109 },
  { state: "Tennessee", x: 131, y: -34 },
  { state: "Texas", x: -38, y: -106 },
  { state: "Utah", x: -189, y: 34 },
  { state: "Vermont", x: 282, y: 154 },
  { state: "Virginia", x: 234, y: 12 },
  { state: "Washington", x: -257, y: 193 },
  { state: "West Virginia", x: 200, y: 20 },
  { state: "Wisconsin", x: 83, y: 113 },
  { state: "Wyoming", x: -134, y: 90 }
];

const allStates = statesData.map(d => d.state);
let guessedStates = [];
let highScore = 0;

function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function createLabel(stateName, x, y, isRed = false) {
  const label = document.createElement("span");
  label.className = "state-label";
  if (isRed) label.classList.add("red");
  label.textContent = stateName;
  label.style.left = `calc(50% + ${x}px)`;
  label.style.top = `calc(50% - ${y}px)`;
  document.getElementById("map-container").appendChild(label);
  return label;
}

function updateScore() {
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = `States Guessed: ${guessedStates.length}/50`;
  const hsEl = document.getElementById("highscore");
  if (hsEl) hsEl.textContent = `High Score: ${highScore}`;
}

function submitState() {
  const input = document.getElementById("state-input");
  const answer = toTitleCase(input.value.trim());
  input.value = "";

  if (allStates.includes(answer) && !guessedStates.includes(answer)) {
    const stateData = statesData.find(d => d.state === answer);
    if (stateData) {
      createLabel(answer, stateData.x, stateData.y);
      guessedStates.push(answer);
      if (guessedStates.length > highScore) highScore = guessedStates.length;
      updateScore();
    }
  }

  if (guessedStates.length >= 50) {
    endGame();
  }
}

function showRetryButton() {
  let retryBtn = document.getElementById("retry");
  if (!retryBtn) {
    retryBtn = document.createElement("button");
    retryBtn.id = "retry";
    retryBtn.textContent = "Retry";
    retryBtn.style.display = "block";
    retryBtn.style.margin = "12px auto";
    retryBtn.style.padding = "10px 20px";
    retryBtn.style.fontSize = "16px";
    retryBtn.style.borderRadius = "8px";
    retryBtn.style.cursor = "pointer";

    const mapContainer = document.getElementById("map-container");
    mapContainer.insertAdjacentElement("afterend", retryBtn);

    retryBtn.addEventListener("click", resetGame);
  } else {
    retryBtn.style.display = "block";
  }
}

function giveUp() {
  const unguessed = allStates.filter(s => !guessedStates.includes(s));
  unguessed.forEach(name => {
    const stateData = statesData.find(d => d.state === name);
    if (stateData) createLabel(name, stateData.x, stateData.y, true);
  });

  const inputBox = document.getElementById("input-container");
  if (inputBox) inputBox.style.display = "none";
  
  const giveUpBox = document.getElementById("giveup-container");
  if (giveUpBox) giveUpBox.style.display = "none";

  showRetryButton();
}

function endGame() {
  const inputBox = document.getElementById("input-container");
  if (inputBox) inputBox.style.display = "none";
  
  const giveUpBox = document.getElementById("giveup-container");
  if (giveUpBox) giveUpBox.style.display = "none";
  
  showRetryButton();
}

function resetGame() {
  document.querySelectorAll(".state-label").forEach(el => el.remove());

  guessedStates = [];
  updateScore();

  const inputBox = document.getElementById("input-container");
  if (inputBox) inputBox.style.display = "flex";
  
  const giveUpBox = document.getElementById("giveup-container");
  if (giveUpBox) giveUpBox.style.display = "block";

  const retryBtn = document.getElementById("retry");
  if (retryBtn) retryBtn.style.display = "none";

  const input = document.getElementById("state-input");
  if (input) {
    input.value = "";
    input.focus();
  }
}

window.onload = () => {
  highScore = 0;
  updateScore();

  const input = document.getElementById("state-input");
  if (input) {
    input.focus();
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") submitState();
    });
  }
};