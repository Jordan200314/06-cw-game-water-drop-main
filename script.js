let gameRunning = false;
let dropMaker;
let timerInterval;
let score = 0;
let timeLeft = 30;

let badDropChance = 0.25;
let spawnRate = 800;
let minFallSpeed = 3;
let maxFallSpeed = 4.5;

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const difficultySelect = document.getElementById("difficulty");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");
const feedbackMessage = document.getElementById("feedback-message");
const milestoneMessage = document.getElementById("milestone-message");
const endMessage = document.getElementById("end-message");

const milestoneData = [
  { score: 50, text: "Nice start! Keep going!" },
  { score: 100, text: "You're making a difference!" },
  { score: 200, text: "Every drop counts!" }
];

let shownMilestones = [];

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", updateDifficultySettings);

function updateDifficultySettings() {
  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    timeLeft = 45;
    badDropChance = 0.15;
    spawnRate = 1000;
    minFallSpeed = 4;
    maxFallSpeed = 5.5;
  } else if (difficulty === "normal") {
    timeLeft = 30;
    badDropChance = 0.25;
    spawnRate = 800;
    minFallSpeed = 3;
    maxFallSpeed = 4.5;
  } else {
    timeLeft = 20;
    badDropChance = 0.4;
    spawnRate = 600;
    minFallSpeed = 2;
    maxFallSpeed = 3.3;
  }

  timeDisplay.textContent = timeLeft;
}

updateDifficultySettings();

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  feedbackMessage.textContent = "";
  milestoneMessage.textContent = "";
  endMessage.textContent = "";
  shownMilestones = [];

  dropMaker = setInterval(createDrop, spawnRate);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  if (!gameRunning) return;

  const drop = document.createElement("div");
  const isBadDrop = Math.random() < badDropChance;

  drop.classList.add("water-drop");
  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  const minSize = 40;
  const maxSize = 70;
  const size = Math.random() * (maxSize - minSize) + minSize;

  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;

  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = `${xPosition}px`;

  const fallDuration = Math.random() * (maxFallSpeed - minFallSpeed) + minFallSpeed;
  drop.style.animationDuration = `${fallDuration}s`;

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (isBadDrop) {
      score -= 20;
      feedbackMessage.textContent = "Polluted! -20";
    } else {
      score += 10;
      feedbackMessage.textContent = "+10 Clean Water!";
    }

    scoreDisplay.textContent = score;
    checkMilestones();
    drop.remove();
  });

  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  gameContainer.appendChild(drop);
}

function checkMilestones() {
  milestoneData.forEach((milestone) => {
    if (score >= milestone.score && !shownMilestones.includes(milestone.score)) {
      milestoneMessage.textContent = milestone.text;
      shownMilestones.push(milestone.score);
    }
  });
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  endMessage.textContent = `Game Over! Final Score: ${score}`;

  if (score >= 300) {
    feedbackMessage.textContent = "Great job! Every drop counts!";
  } else {
    feedbackMessage.textContent = "Nice try! Play again to improve your score.";
  }
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  gameRunning = false;
  score = 0;
  shownMilestones = [];

  scoreDisplay.textContent = score;
  feedbackMessage.textContent = "";
  milestoneMessage.textContent = "";
  endMessage.textContent = "";
  gameContainer.innerHTML = "";

  updateDifficultySettings();
}