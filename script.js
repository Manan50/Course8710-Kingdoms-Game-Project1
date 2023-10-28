document.addEventListener("DOMContentLoaded", function () {
  var backgroundMusic = document.getElementById("bg-music");
  var startButton = document.getElementById("start-button");
  var returnToMainMenuButton = document.getElementById("return-to-main-menu"); // Added button reference

  var isMusicPlaying = false; // Track whether music is playing
  localStorage.setItem("isMusicPlaying", isMusicPlaying);
  if (isMusicPlaying === "true") {
    isMusicPlaying = true;
  }
  // Function to start playing background music
  function startBackgroundMusic() {
    backgroundMusic.volume = 0.5; // Adjust the volume as needed
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

  // Function to show the moderator setup and hide the main menu
  function showModeratorSetup() {
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("moderator-setup").style.display = "block";

    // Start playing background music after the user interaction
    startBackgroundMusic();
  }

  // Function to return to the main menu from the moderator setup
  function returnToMainMenu() {
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("moderator-setup").style.display = "none";

    // Stop background music if it's playing
    if (isMusicPlaying) {
      stopBackgroundMusic();
    }
  }

  // Add click event listeners
  startButton.addEventListener("click", showModeratorSetup);
  returnToMainMenuButton.addEventListener("click", returnToMainMenu);

  // Rest of your code...

  document
    .getElementById("setup-complete-button")
    .addEventListener("click", function () {
      // Here you can get the values from the input fields and proceed with setting up the game
      var realKingdomsCount = document.getElementById(
        "real-kingdoms-count"
      ).value;
      var fakeKingdomsCount = document.getElementById(
        "fake-kingdoms-count"
      ).value;

      console.log(
        "Real Kingdoms:",
        realKingdomsCount,
        "Fake Kingdoms:",
        fakeKingdomsCount
      );
    });
});

function namesPage() {
  const realKingdomName = document.getElementById("real-kingdoms-count").value;
  const fakeKingdomName = document.getElementById("fake-kingdoms-count").value;

  const realKingdomCount = parseInt(
    document.getElementById("real-kingdoms-count").value
  );
  const fakeKingdomCount = parseInt(
    document.getElementById("fake-kingdoms-count").value
  );

  const KingdomName = realKingdomCount + fakeKingdomCount;

  if (realKingdomName.trim() !== "" && fakeKingdomName.trim() !== "") {
    console.log("");
    const newPage = `names.html?Kingdoms=${realKingdomCount}&Players=${realKingdomCount}&checkfalsename=${fakeKingdomCount}`;
    window.location.href = newPage;
  } else {
    console.log("No names provided");
  }
}
