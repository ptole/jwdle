import loyalists from "./loyalists.json" with { type: "json" };
import heretics from "./heretics.json" with { type: "json" };
import xenos from "./xenos.json" with { type: "json" };

const splashScreen = document.getElementById('splash-screen');
const answerDiv = document.getElementById('answer');
const questions = [];
var currentQ = 1;
var score = [];

function generateQuestions() {
    questions.length = 0; // Clear previous questions
    document.querySelector("#closeScreenBtn").textContent = "Next";
    let rand = Math.floor(Math.random() * loyalists.loyalists.length);
    questions.push(loyalists.loyalists[rand]);

    rand = Math.floor(Math.random() * heretics.heretics.length);
    questions.push(heretics.heretics[rand]);

    rand = Math.floor(Math.random() * xenos.xenos.length);
    questions.push(xenos.xenos[rand]);
}

function showImage(index) {
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to the clicked button
    document.querySelector(`.tab-button:nth-child(${index})`).classList.add('active');

    const imgElement = document.getElementById('displayImage');

    const selectedImage = questions[index - 1];

    if (selectedImage) {
        imgElement.src = selectedImage.src;
    }
}

// Initialize with the first image on load
document.addEventListener('DOMContentLoaded', () => {
    generateQuestions();
    showImage(currentQ);
});

function getDiff(guess, actual) {
    const bigger = Math.max(guess, actual);
    const smaller = Math.min(guess, actual);
    var result = bigger / smaller;
    if (bigger == actual) {
        result *= -1;
    }
    return result;
}

function guess() {
    const costInput = document.getElementById('numberInput');
    const guessedCostString = costInput.value;

    // Get the currently displayed image index (based on active tab)
    const activeTab = document.querySelector('.tab-button.active');
    const currentIndex = Array.from(document.querySelectorAll('.tab-button')).indexOf(activeTab) + 1;

    const selectedImage = questions[currentIndex - 1];

    // Validation and comparison logic
    if (!selectedImage) {
        alert("Error: No image selected.");
        return;
    }

    const guessedCost = parseFloat(guessedCostString);
    const actualCost = selectedImage.cost;
    const name = selectedImage.name;

    if (isNaN(guessedCost)) {
        alert("Please enter a valid number for the cost.");
        return;
    }

    splashScreen.style.display = 'grid';

    const answer = getDiff(guessedCost, actualCost);
    const absAnswer = Math.abs(answer);
    score.push(answer);

    costInput.value = ''; // Clear the input field after guessing


    if (guessedCost == actualCost) {
        answerDiv.innerHTML = `<h1>Correct!</h1><h2>${name}</h2><h2>${actualCost}£</h2>`;
    } else if (answer < 0) {
        answerDiv.innerHTML = `<h1>You guessed ${guessedCost}£</h1><h1>${absAnswer.toFixed(2)}x too low!</h1><h2>${name}</h2><h2>${actualCost}£</h2>`;
    } else {
        answerDiv.innerHTML = `<h1>You guessed ${guessedCost}£</h1><h1>${absAnswer.toFixed(2)}x too high!</h1><h2>${name}</h2><h2>${actualCost}£</h2>`;
    }

    if (currentQ == 3) {
        document.querySelector("#closeScreenBtn").textContent = "Show score";
    }

}

function showScore() {
    const totalScore = Math.pow(Math.abs(score[0]) * Math.abs(score[1]) * Math.abs(score[2]),1/3);
    //format scores
    const a1 = score[0] < 0 ? `<${Math.abs(score[0]).toFixed(2)}x` : `>${Math.abs(score[0]).toFixed(2)}x`;
    const a2 = score[1] < 0 ? `<${Math.abs(score[1]).toFixed(2)}x` : `>${Math.abs(score[1]).toFixed(2)}x`;
    const a3 = score[2] < 0 ? `<${Math.abs(score[2]).toFixed(2)}x` : `>${Math.abs(score[2]).toFixed(2)}x`;   
    document.querySelector("#closeScreenBtn").textContent = "Play again";
    answerDiv.innerHTML = `<h1>Game Over</h1><h1>Your guesses:</h1><h2>${a1}, ${a2}, ${a3}</h2><h1>Your total accuracy:</h1><h1>${totalScore.toFixed(2)}x</h1>`;
    currentQ = 4;
}


document.querySelector(".guess-button").addEventListener("click", guess);
document.querySelector("#closeScreenBtn").addEventListener("click", () => {
    if (currentQ < 3) {
        splashScreen.style.display = 'none';
        currentQ++;
        showImage(currentQ);
    } else if (currentQ == 3) {
        showScore();
    } else if (currentQ == 4) {
        score.length = 0; // Reset score for new game
        splashScreen.style.display = 'none';
        generateQuestions();
        currentQ = 1;
        showImage(currentQ);
    }
});