import loyalists from "./loyalists.json" with { type: "json" };
import heretics from "./heretics.json" with { type: "json" };
import xenos from "./xenos.json" with { type: "json" };

const splashScreen = document.getElementById('splash-screen');
const answerDiv = document.getElementById('answer');
const questions = [];

function generateQuestions() {
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
    showImage(1);
});

function getDiff(b,a){
    const abs = Math.abs((a-b));
    const avg = (a+b)/2;
    const diff = abs/avg;
    console.log(diff);
    return Math.floor(diff*100);
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

    
    if (guessedCost === actualCost) {
        answerDiv.innerHTML = `<h2>Correct!</h2><p>${name} ${actualCost}£</p>`;
    } else if (guessedCost < actualCost) {
        answerDiv.innerHTML = `<h2>${getDiff(guessedCost, actualCost)}% too low!</h2><p>${name} ${actualCost}£</p>`;
    } else {
        answerDiv.innerHTML = `<h2>${getDiff(guessedCost, actualCost)}% too high!</h2><p>${name} ${actualCost}£</p>`;
    }
        
}


document.querySelector("#tab1").addEventListener("click", () => showImage(1));
document.querySelector("#tab2").addEventListener("click", () => showImage(2));
document.querySelector("#tab3").addEventListener("click", () => showImage(3));
document.querySelector(".guess-button").addEventListener("click", guess);
document.querySelector("#closeScreenBtn").addEventListener("click", () => {
    splashScreen.style.display = 'none';
});