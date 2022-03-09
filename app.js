// Options for Player Colors... these are in the same order as our sprite sheet
const playerEar = ["1", "2", "3", "4"];
const playerHead = ["1", "2", "3", "4"];

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
  return `${x}x${y}`;
}

//Name
function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "COOL",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
  ]);
  const animal = randomFromArray([
    "CAT",
  ]);
  return `${prefix} ${animal}`;
}

function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomFromArray([
    { x: 1, y: 38 },
    { x: 2, y: 38 },
    { x: 3, y: 36 },
  ]);
}

(function () {
  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};

  const playerNameInput = document.querySelector("#player-name");
  const gameContainer = document.querySelector(".game-container");

  function handleArrowPress(xChange = 0) {
    const newX = players[playerId].x + xChange;
  }

  function initGame() {

    const allPlayersRef = firebase.database().ref(`players`);

    allPlayersRef.on("value", (snapshot) => {
      //player join and quit occurs

    })

    allPlayersRef.on("child_added", (snapshot) => {
      //player tree
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");

      //player Img
      characterElement.classList.add("Charater", "grid-cell");
      if (addedPlayer.id === playerId) {
        characterElement.classList.add("you");
      }

      characterElement.innerHTML = (`
      <div class="Character_shadow grid-cell"></div>
      <div class="Character_sprite grid-cell"></div>
      <div class="Character_name-container">
        <span class="Character_name"></span>
        <span class="Character_coins">0</span>
      </div>
      <div class="Character_you-arrow"></div>
    `);
      playerElements[addedPlayer.id] = characterElement;

      //Init State
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      `//ear
      characterElement.setAttribute("data-ear",).addedPlayer.ear;
      //face
      characterElement.setAttribute("data-ear",).addedPlayer.head;`
      //pos
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      //show on ground
      gameContainer.appendChild(characterElement);

    })

    new KeyPressListener("ArrowLeft", () => handleArrowPress(-1))
    new KeyPressListener("ArrowRight", () => handleArrowPress(1))

    //Updates player name with text input
    playerNameInput.addEventListener("change", (e) => {
      const newName = e.target.value || createName();
      
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      })
    })

  }

  firebase.auth().onAuthStateChanged((user) => {

    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
      playerNameInput.value = name;

      `eartype: randomFromArray(playerEar),
        bodytype: randomFromArray(playerBody),`

      const { x, y } = getRandomSafeSpot();

      playerRef.set({
        id: playerId,
        name,
        x,
        y,
      })

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();
      //Begin the game now that we are signed in
      initGame();
    } else {
      //You're logged out.
    }
  })

  firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
  });


})();
