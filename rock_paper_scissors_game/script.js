const score = JSON.parse(localStorage.getItem("score")) || {
    wins: 0,
    losses: 0,
    ties: 0,
};

updateScoreElement();

/*if (!score) {
score = {
  wins: 0,
  losses: 0,
  ties:0
};
*/

let isAutoPlaying = false;
let intervalID;

function autoPlay() {

  if(!isAutoPlaying) {
      intervalID = setInterval(() => {
          const playerMove = pickComputerMove();
          playGame(playerMove);

      },1000);
      isAutoPlaying = true;
  }
else {
   clearInterval(intervalID);
   isAutoPlaying = false;

}
}


document.querySelector('.js-rock-button').addEventListener('click', () => {
playGame('rock');
});

document.querySelector('.js-paper-button').addEventListener('click', () => {
playGame('paper');
});

document.querySelector('.js-scissors-button').addEventListener('click', () => {
playGame('scissors');
});

document.body.addEventListener('keydown', (event) => {
if (event.key === 'r') {
  playGame('rock');
}
else if(event.key === 'p') {
  playGame('paper');
}
else if (event.key === 's') {
  playGame('scissors');
}

});





function playGame(playerMove) {
  let computerMove = pickComputerMove();
  let result = "";
  if (playerMove === "scissors") {
    if (computerMove === "rock") {
      result = "You lose.";
    } else if (computerMove === "paper") {
      result = "You win.";
    } else {
      result = "Tie.";
    }
  } else if (playerMove === "paper") {
    if (computerMove === "rock") {
      result = "You win.";
    } else if (computerMove === "paper") {
      result = "Tie.";
    } else {
      result = "You lose.";
    }
  } else {
    if (computerMove === "scissors") {
      result = "You win.";
    } else if (computerMove === "paper") {
      result = "You lose.";
    } else {
      result = "Tie.";
    }
  }
  
  if (result === "You win.") {
    score.wins++;
  } else if (result === "You lose.") {
    score.losses++;
  } else {
    score.ties++;
  }

  localStorage.setItem("score", JSON.stringify(score));
  updateScoreElement();

  document.querySelector(".js-result").innerHTML = result;
  document.querySelector(
    ".js-moves"
  ).innerHTML = `You <img src="images/${playerMove}.png" class="moves-icon" />
      <img src="images/${computerMove}.png" alt="" class="moves-icon" /> Computer;`;
}

function updateScoreElement() {
  document.querySelector(
    ".js-score"
  ).innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

let computerMove = "";

function pickComputerMove() {
  const randomNumber = Math.random();

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = "rock";
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = "paper";
  } else {
    computerMove = "scissors";
  }

  return computerMove;
}

function resetScore() {
  score.wins = 0;
  score.ties = 0;
  score.losses = 0;

  localStorage.removeItem("score");
  updateScoreElement();
}

setInterval(function() {},3000);