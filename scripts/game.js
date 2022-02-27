let numberCorrect = 0;
let numberAttempted = 0;
let cardName = "";
let cardImage = "";

function init() {
  // Submit button for user input
  const submitButton = document.querySelector(`#submitButton`);
  submitButton.addEventListener(`click`, cardGuess);

  // Skip to the next art
  const skipButton = document.querySelector(`#skip`);
  skipButton.addEventListener(`click`, skip);

  // Detect enter key for submission
  document
    .querySelector("#guessBox")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        cardGuess();
        document.getElementById("guessBox").value = "";
      }
    });
}

// Fetch a random card that has flavor text
async function fetchCard() {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/random?q=has%3Aflavor`
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

// Pull the needed card information for the current round
async function nextRound() {
  let card = await fetchCard();

  // Define the card's name
  cardName = card.name;
  console.log(`The card is ${cardName}, you filthy cheater!`);

  // Define the card's flavor text and display it
  let cardFlavor = card.flavor_text;
  document.getElementById("flavorText").innerHTML = `'${cardFlavor}'`;

  // Define the card image and prevent an error if the card has more than one face
  if (card.card_faces === undefined) {
    cardImage = card.image_uris.border_crop;
  } else if (card.card_faces === 2) {
    cardImage = card.card_faces[0].border_crop;
  } else {
    cardImage = card.image_uris.border_crop;
  }
}

// Display the card image for the previous round
function displayCard() {
  let imageCreate = document.getElementById("cardImage");
  imageCreate.setAttribute("src", `${cardImage}`);
  imageCreate.setAttribute("width", `300px`);
}

//
function keepScore() {
  document.getElementById("scoreBox").style.visibility = "visible";
  numberAttempted++;

  document.getElementById(
    "scoreBox"
  ).innerHTML = `Score: ${numberCorrect} / ${numberAttempted}`;

  nextRound();
}

// Collect user input and check if correct
function cardGuess() {
  let guess = document.getElementById("guessBox").value;
  let answer = cardName;
  let compareAnswer = guess.localeCompare(answer, undefined, {sensitivity: 'accent'});
  if (guess === "") {
    document.getElementById("answerBox").innerHTML = `Please enter an answer.`;
  } else if (compareAnswer === 0) {
    document.getElementById(
      "answerBox"
    ).innerHTML = `Correct! The card was ${answer}.`;
    numberCorrect++;
    displayCard();
    keepScore();
  } else {
    document.getElementById(
      "answerBox"
    ).innerHTML = `Sorry. The correct answer was ${answer}. <br> You answered "${guess}".`;

    displayCard();
    keepScore();
  }
}

function skip() {
  document.getElementById("scoreBox").style.visibility = "visible";
  document.getElementById(
    "answerBox"
  ).innerHTML = `Skipped! The correct answer was ${cardName}.`;

  // This requires a 1 second delay between skipping to avoid abuse
  document.getElementById("skip").disabled = true;
  setTimeout('document.getElementById("skip").disabled=false;', 1000);

  numberAttempted++;

  document.getElementById(
    "scoreBox"
  ).innerHTML = `Score: ${numberCorrect} / ${numberAttempted}`;

  displayCard();
  nextRound();
}

// Run the game on page load
init();
nextRound();

// Always display the current year for the copyright
document
  .getElementById("year")
  .appendChild(document.createTextNode(new Date().getFullYear()));
