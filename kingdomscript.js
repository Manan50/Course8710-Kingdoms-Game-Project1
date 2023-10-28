var backgroundMusic;
var kingdomOwnership = {}; // Keeps track of which player owns which kingdom
var playerColors = {}; // Maps player names to their respective colors
var roundNumber = 1;
var roundInterval;
var realKingdomNames;


document.addEventListener("DOMContentLoaded", function () {
  backgroundMusic = document.getElementById("bg-music");
  kingdomOwnership = {}; // Reset kingdom ownership at the start of the game
  playerColors = {}; // Reset player colors
  roundNumber = 1; // Reset round number
  populateKingdoms();
  populatePlayers();
  createGrid();
  startRound(0, roundNumber); // Start from the first player and the first round
});

const colors = [
  "rgba(255, 0, 0, 0.6)",      // Red
  "rgba(0, 128, 0, 0.6)",      // Green
  "rgba(0, 0, 255, 0.6)",      // Blue
  "rgba(255, 165, 0, 0.6)",    // Orange
  "rgba(148, 0, 211, 0.6)",    // Violet
  "rgba(139, 69, 19, 0.6)",    // Brown
  "rgba(255, 182, 193, 0.6)",  // Pink
  "rgba(255, 255, 0, 0.6)",    // Yellow
  "rgba(169, 169, 169, 0.6)",  // Grey
  "rgba(173, 216, 230, 0.6)"   // Light Blue
];

function getRandomColor() {
  // Generate random RGB values
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Create a CSS color string
  return `rgb(${r},${g},${b},${0.7})`;
}

// Manan has just incorporated localStorage for the player and kingdom Names
function populatePlayers() {
  const storedNamesJSON = localStorage.getItem("playerNames");
  const storedPlayerNames = JSON.parse(storedNamesJSON);
  console.log(storedPlayerNames);

  const realKingdomNames = JSON.parse(localStorage.getItem("realKingdomNames")); // Retrieve the real kingdom names

  const playersSection = document.getElementById("players-section");

  for (let i = 0; i < storedPlayerNames.length; i++) {
    const playerName = storedPlayerNames[i];
    const kingdomName = realKingdomNames[i]; // Get the corresponding kingdom name

    const playerDiv = document.createElement("button");
    playerDiv.textContent = playerName;
    playerDiv.className = "player-name";
    playerDiv.classList.add('btn');
    playerDiv.classList.add('btn-primary');
    playerDiv.classList.add('btn-lg');
    playerDiv.style.background = getRandomColor();
    playerDiv.setAttribute('data-active', 'true');
    playersSection.appendChild(playerDiv);

    playerColors[playerName] = playerDiv.style.background;
    kingdomOwnership[kingdomName] = playerName; // Initialize the ownership
  }
}

function shuffleArray(array) {
  const shuffledArray = [...array]; // Create a copy of the original array

  // Perform the Fisher-Yates shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
    // Swap elements at i and j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

function populateKingdoms() {
  let storedkingdomNamesJSON = localStorage.getItem("totalKingdoms");
  let storedkingdomNames = JSON.parse(storedkingdomNamesJSON);
  console.log(storedkingdomNames);

  const realKingdomNames = JSON.parse(localStorage.getItem("realKingdomNames")); // assuming realKingdomNames is declared globally
  const fakeKingdomNames = JSON.parse(localStorage.getItem("fakeKingdomNames"));

    const allKingdomNames = realKingdomNames.concat(fakeKingdomNames);
  
  // Shuffle the kingdom names
  const buttons = [];
  

  for (const kingdomName of allKingdomNames) {
    const button = document.createElement("button");
    button.textContent = kingdomName;
    button.className = "kingdom-button";
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('btn-lg');
    button.disabled = true; 

    button.addEventListener("click", function () {
      if (fakeKingdomNames.includes(kingdomName)) {
        alert('Kingdom is fake!');
          endRound();
          button.disabled = true;
      } else {
        captureKingdom(kingdomName);
      }
    });
      buttons.push(button);
      const shuffledButtons = shuffleArray(buttons);

  const kingdomsSection = document.getElementById("kingdoms-section");
      for (const button of shuffledButtons) {
          kingdomsSection.appendChild(button);
      }
  }
}

// Modify the captureKingdom function to remove the button
function captureKingdom(kingdomName) {
  const currentPlayer = document.querySelector(".player-name.highlight");
  const currentPlayerName = currentPlayer.textContent;

  let previousOwner = null;
  
  // Ownership transfer logic...
  if (kingdomOwnership[kingdomName]) {
    previousOwner = kingdomOwnership[kingdomName];
    for (let kingdom in kingdomOwnership) {
      if (previousOwner === currentPlayerName) {
        alert("Cant select your own Kingdom!!!!! Please restart the game");
      
      } else if (kingdomOwnership[kingdom] === previousOwner) {
        kingdomOwnership[kingdom] = currentPlayerName;
        updateGridCellColor(kingdom, currentPlayerName);
      }
    }
  } else {
    kingdomOwnership[kingdomName] = currentPlayerName;
    updateGridCellColor(kingdomName, currentPlayerName);
  }




  // Remove the captured kingdom's button
  const kingdomButtons = document.querySelectorAll(".kingdom-button");
  kingdomButtons.forEach(button => {
    if (button.textContent === kingdomName) {
      button.remove(); // This removes the button from the DOM
    }
  });

  // Check if the previous owner has lost all their kingdoms
  if (previousOwner) {
    const kingdomsRemaining = Object.values(kingdomOwnership).includes(previousOwner);
    if (!kingdomsRemaining) {
      removePlayer(previousOwner);
    }
  }

  checkForVictory();
}

function removePlayer(playerName) {
  // Remove player from playerColors
  delete playerColors[playerName];

  // Remove player's UI element
  const players = document.querySelectorAll(".player-name");
  players.forEach(player => {
    if (player.textContent === playerName) {
      player.remove();
    }
  });
}


// New function to update grid cell colors
function updateGridCellColor(kingdomName, playerName) {
  const gridCells = document.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
      if (cell.textContent === kingdomName) {
      cell.style.backgroundColor = playerColors[playerName];
    }
  });
}

// New function to check for a victory
function checkForVictory() {
    const storedNamesJSON = localStorage.getItem("playerNames");
    const storedPlayerNames = JSON.parse(storedNamesJSON);
    const realKingdomNames = JSON.parse(localStorage.getItem("realKingdomNames"));
  // You can now safely use realKingdomNames here
  const allKingdoms = Object.values(kingdomOwnership);
  const allSame = allKingdoms.every(owner => owner === allKingdoms[0]);

    if (storedPlayerNames === 0) {
        alert(`Victory for ${allKingdoms[0]}!`);
    }
  if (allSame && allKingdoms.length === realKingdomNames.length) {
    alert(`Victory for ${allKingdoms[0]}!`);
    updateRoundUI(roundNumber, 0);
    stopRound();
    const players = document.getElementsByClassName("player-name");
    for (let i = 0; i < players.length; i++) {
      players[i].classList.remove("highlight");
      players[i].disabled = true;
    }
    // Here, you can also handle any end-of-game UI or functionality
  } else {
    endRound();
  }
}


function createGrid() {
  console.log("Creating grid...");
  // Retrieve the stored player names
  const storedNamesJSON = localStorage.getItem("playerNames");
  const storedPlayerNames = JSON.parse(storedNamesJSON);
  
  const realKingdomNames = JSON.parse(localStorage.getItem("realKingdomNames"));

  if (storedPlayerNames && Array.isArray(storedPlayerNames)) {
    const numPlayers = storedPlayerNames.length;

    // Find factors of numPlayers to determine rows and columns
    let factors = [];
    for (let i = 1; i <= Math.floor(Math.sqrt(numPlayers)); i++) {
      if (numPlayers % i === 0) {
        factors.push([i, numPlayers / i]);
      }
    }

    let [rows, columns] = factors.length
      ? factors[factors.length - 1]
      : [1, numPlayers]; 

    // Set the grid style dynamically based on the calculated columns and rows
    const gridOverlay = document.getElementById("grid-overlay");
    gridOverlay.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Create the grid cells
    for (let i = 0; i < numPlayers; i++) {
      const gridCell = document.createElement("div");
      gridCell.className = "grid-cell";
  
      if (i < realKingdomNames.length) {
        const kingdomName = realKingdomNames[i];
        const playerName = kingdomOwnership[kingdomName];
        gridCell.textContent = kingdomName;
        gridCell.style.backgroundColor = playerColors[playerName]; 
      }
  
      gridOverlay.appendChild(gridCell);
    }

  } else {
    console.log("No player names found in local storage.");
  }
}



function startRound(index, round) {
  const players = document.querySelectorAll("#players-section .player-name");
  if (players.length === 0) return; 

  // Reset for a new round
  if (index >= players.length) {
    index = 0; 
    round++; 
  }

  // Manage player highlighting and interaction
  players.forEach((player, idx) => {
    if (idx === index) {
      player.classList.add("highlight");
      enableKingdomButtons(true);
    } else {
      player.classList.remove("highlight"); 
    }
  });

  // Update round UI
  roundNumber = round;
  roundDuration = 15;
  updateRoundUI(roundNumber, roundDuration);

  // Start the round timer
  startRoundTimer( 15 , round, () => {
    startRound(index + 1, round); 
  });
}



function updateRoundUI(round, roundDuration) {
  /* const roundDuration = 15;  */
  const roundsElement = document.getElementById("rounds");
  roundsElement.textContent = `Round ${round}, ${roundDuration} seconds remaining`;
}

function startRoundTimer(roundDuration,round, callback) {
  /* let roundDuration = 15; */
  roundInterval = setInterval(() => {
    roundDuration--;
    updateRoundUI(round, roundDuration);

    if (roundDuration <= 0) {
      clearInterval(roundInterval);
      enableKingdomButtons(false);
      if (callback) callback();
    }
  }, 1000);
}

function stopRound() {
  clearInterval(roundInterval); 
}

function enableKingdomButtons(enable) {
  const kingdomButtons = document.querySelectorAll(".kingdom-button");
  kingdomButtons.forEach(button => {
    button.disabled = !enable;
  });
}

function endRound() {
  clearInterval(roundInterval);
  enableKingdomButtons(false); 

  const currentPlayerIndex = Array.from(document.querySelectorAll(".player-name")).findIndex(player =>
    player.classList.contains("highlight")
  );

  if (currentPlayerIndex !== -1) {
    const nextPlayerIndex = (currentPlayerIndex + 1) % document.querySelectorAll(".player-name").length;
    const nextRoundNumber = nextPlayerIndex === 0 ? roundNumber + 1 : roundNumber;
    startRound(nextPlayerIndex, nextRoundNumber);
  }
}
