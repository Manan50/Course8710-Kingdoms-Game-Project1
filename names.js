var backgroundMusic;
var wasMusicPlaying;
document.addEventListener("DOMContentLoaded", function () {
  backgroundMusic = document.getElementById("bg-music");
  wasMusicPlaying = localStorage.getItem("isMusicPlaying");
  createInputFields();
  handleFormSubmission();
  startBackgroundMusic();
});

var isMusicPlaying = false; // Track whether music is playing

if (wasMusicPlaying === "true") {
  isMusicPlaying = true;
}

// Function to start playing background music
function startBackgroundMusic() {
  backgroundMusic.volume = 0.2; // Adjust the volume as needed
  backgroundMusic
    .play()
    .then(function () {
      console.log("Background music is playing.");
      isMusicPlaying = true;
    })
    .catch(function (error) {
      console.error("Failed to play background music:", error);
    });
}

// Function to stop background music
function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0; // Reset the playback to the beginning
  isMusicPlaying = false;
  localStorage.setItem("isMusicPlaying", "false"); // Store the state
}

// Revamped by Manan to add localStorage sessions in it

function createInputFields() {
  const params = new URLSearchParams(window.location.search);
  const numPlayers = parseInt(params.get("Players"));
  const realKingdoms = parseInt(params.get("Kingdoms"));
  const falseKingdoms = parseInt(params.get("checkfalsename"));
  const inputContainer = document.getElementById("input-container");

  // Create input fields for players and kingdoms
  for (let i = 1; i <= numPlayers; i++) {
    const playerLabel = document.createElement("label");
    playerLabel.classList.add('playerLabel')
    playerLabel.textContent = `Name for Player ${i}: `;

    const playerInput = document.createElement("input");
    playerInput.type = "text";
    playerInput.classList.add('form-control');
    playerInput.classList.add('playerInput');
    playerInput.id = `player${i}`;
    playerInput.required = true;

    inputContainer.appendChild(playerLabel);
    inputContainer.appendChild(playerInput);

    const kingdomLabel = document.createElement("label");
    kingdomLabel.classList.add('kingdomLabel')
    kingdomLabel.textContent = `Kingdom ${i} Name: `;

    const kingdomInput = document.createElement("input");
    kingdomInput.type = "text";
    kingdomInput.classList.add('form-control');
    kingdomInput.classList.add('kingdomInput');
    kingdomInput.id = `kingdom${i}`;
    kingdomInput.required = true;

    inputContainer.appendChild(kingdomLabel);
    inputContainer.appendChild(kingdomInput);
  }

  for (let j = 1; j <= falseKingdoms; j++) {
    const fakeKingdomLabel = document.createElement("label");
    fakeKingdomLabel.classList.add('fakeKingdomLabel')
    fakeKingdomLabel.textContent = `Fake Kingdom ${j} Name: `;

    const fakeKingdomInput = document.createElement("input");
    fakeKingdomInput.type = "text";
    fakeKingdomInput.classList.add('form-control');
    fakeKingdomInput.classList.add('fakeKingdomInput');
    fakeKingdomInput.id = `fakeKingdom${j}`;
    fakeKingdomInput.required = true;

    inputContainer.appendChild(fakeKingdomLabel);
    inputContainer.appendChild(fakeKingdomInput);
  }
}

function handleFormSubmission() {
  const form = document.getElementById("player-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const numPlayers = new URLSearchParams(window.location.search).get("Players");
    const playerNames = [];
    const kingdomNames = []; // This will now be directly associated with players, not shuffled.
    const fakeKingdomNames = [];
    const numFakeKingdomNames = new URLSearchParams(window.location.search).get("checkfalsename");

    // Collect player names and kingdom names
    for (let i = 1; i <= numPlayers; i++) {
      const playerNameInput = document.getElementById(`player${i}`);
      const playerName = playerNameInput.value;
      playerNames.push(playerName);

      const kingdomNameInput = document.getElementById(`kingdom${i}`);
      const kingdomName = kingdomNameInput.value;
      kingdomNames.push(kingdomName); // Directly storing the kingdoms in the order entered.
    }

    // Collect fake kingdom names
    for (let j = 1; j <= numFakeKingdomNames; j++) {
      const fakeKingdomNameInput = document.getElementById(`fakeKingdom${j}`);
      const fakeKingdomName = fakeKingdomNameInput.value;
      fakeKingdomNames.push(fakeKingdomName);
    }

    // Store in localStorage
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
    localStorage.setItem("realKingdomNames", JSON.stringify(kingdomNames)); // These are not to be shuffled.
    localStorage.setItem("fakeKingdomNames", JSON.stringify(fakeKingdomNames));

    // Redirect to the next page, kingdoms.html, which should handle the retrieved data without shuffling.
    window.location.href = `kingdoms.html`;
  });
}

/* function handleFormSubmission() {
    const form = document.getElementById('player-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const numPlayers = new URLSearchParams(window.location.search).get('Players');
        const playerNames = [];
        const kingdomNames = [];
        const fakeKingdomNames = [];

        // Collect player names and real kingdom names
        for (let i = 1; i <= numPlayers; i++) {
            const playerName = document.getElementById(`player${i}`).value;
            const kingdomName = document.getElementById(`kingdom${i}`).value;

            playerNames.push(playerName);
            kingdomNames.push(kingdomName);
        }

        // Collect fake kingdom names
        const falseKingdoms = parseInt(new URLSearchParams(window.location.search).get('checkfalsename'));
        for (let j = 1; j <= falseKingdoms; j++) {
            const fakeKingdomName = document.getElementById(`fakeKingdom${j}`).value;
            fakeKingdomNames.push(fakeKingdomName);
        }

        // Construct the query string for the URL
        const queryString = playerNames.map((name, index) => `player${index + 1}=${encodeURIComponent(name)}`).join('&') +
                            '&' +
                            kingdomNames.map((name, index) => `kingdom${index + 1}=${encodeURIComponent(name)}`).join('&') +
                            (fakeKingdomNames.length ? '&' : '') +
                            fakeKingdomNames.map((name, index) => `fakeKingdom${index + 1}=${encodeURIComponent(name)}`).join('&');

        // Redirect to the kingdoms page with the query string
        window.location.href = `kingdoms.html?${queryString}`;
    });
} */
